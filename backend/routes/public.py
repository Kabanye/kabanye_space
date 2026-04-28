from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from database import get_db
from models.donation import Donation
from models.transaction import Transaction, TransactionStatus
from models.progress import Progress
from schemas.donation import DonationCreate, PublicMessage
from schemas.progress import ProgressResponse
from services.mpesa import stk_push
from config import get_settings
import logging

logger = logging.getLogger(__name__)
settings = get_settings()
router = APIRouter()


@router.post("/donate", status_code=201)
async def create_donation(donation_data: DonationCreate, db: AsyncSession = Depends(get_db)):
    """Create donation and initiate M-Pesa STK Push"""
    
    # Create donation record
    donation = Donation(
        amount=donation_data.amount,
        name=donation_data.name,
        message=donation_data.message,
        phone_number=donation_data.phone_number,
        is_public=False
    )
    db.add(donation)
    await db.flush()
    
    # Create transaction record
    transaction = Transaction(
        donation_id=donation.id,
        amount=donation_data.amount,
        phone_number=donation_data.phone_number,
        status=TransactionStatus.PENDING
    )
    db.add(transaction)
    await db.flush()
    
    # Check if M-Pesa credentials are actually configured
    has_real_credentials = (
        settings.MPESA_CONSUMER_KEY != "your_consumer_key" and
        len(settings.MPESA_CONSUMER_KEY) > 10
    )
    
    if not has_real_credentials:
        # No real M-Pesa credentials - use simulated success for development
        logger.warning("No M-Pesa credentials configured - using simulated payment")
        transaction.status = TransactionStatus.SUCCESS
        transaction.mpesa_receipt_number = f"SIM{str(donation.id)[:8].upper()}"
        transaction.result_description = "Development mode - M-Pesa not configured"
        await db.flush()
        
        return {
            "donation_id": str(donation.id),
            "transaction_id": str(transaction.id),
            "checkout_request_id": "dev_mode",
            "status": "success",
            "message": "Development mode: Donation recorded successfully"
        }
    
    # Real M-Pesa flow
    try:
        stk_response = await stk_push(
            phone_number=donation_data.phone_number,
            amount=donation_data.amount,
            account_reference=donation_data.name or "Supporter"
        )
        
        logger.info(f"M-Pesa Response: {stk_response}")
        
        # Check M-Pesa response
        response_code = stk_response.get("ResponseCode")
        checkout_request_id = stk_response.get("CheckoutRequestID")
        error_message = stk_response.get("errorMessage")
        response_desc = stk_response.get("ResponseDescription")
        
        # M-Pesa success: ResponseCode = "0"
        if response_code == "0" and checkout_request_id:
            transaction.merchant_request_id = stk_response.get("MerchantRequestID")
            transaction.checkout_request_id = checkout_request_id
            transaction.status = TransactionStatus.PROCESSING
            await db.flush()
            
            return {
                "donation_id": str(donation.id),
                "transaction_id": str(transaction.id),
                "checkout_request_id": checkout_request_id,
                "status": "pending",
                "message": "STK Push sent. Check your phone to complete payment."
            }
        
        # M-Pesa returned an error
        error_detail = error_message or response_desc or "M-Pesa rejected the request"
        logger.error(f"M-Pesa Error: {error_detail}")
        transaction.status = TransactionStatus.FAILED
        transaction.result_description = str(error_detail)[:200]
        await db.flush()
        
        return {
            "donation_id": str(donation.id),
            "transaction_id": str(transaction.id),
            "checkout_request_id": None,
            "status": "failed",
            "message": str(error_detail)[:200]
        }
        
    except Exception as e:
        error_str = str(e)
        logger.error(f"M-Pesa Exception: {error_str}")
        transaction.status = TransactionStatus.FAILED
        transaction.result_description = error_str[:200]
        await db.flush()
        
        return {
            "donation_id": str(donation.id),
            "transaction_id": str(transaction.id),
            "checkout_request_id": None,
            "status": "failed",
            "message": f"Payment failed: {error_str[:150]}"
        }


@router.get("/public-messages")
async def get_public_messages(db: AsyncSession = Depends(get_db)):
    """Get approved public messages"""
    query = select(Donation).where(
        Donation.is_public == True,
        Donation.message.isnot(None),
        Donation.message != ''
    ).order_by(Donation.created_at.desc()).limit(50)
    
    result = await db.execute(query)
    donations = result.scalars().all()
    
    return {
        "messages": [
            PublicMessage(
                name=d.name or "Anonymous",
                message=d.message,
                created_at=d.created_at
            ) for d in donations
        ],
        "count": len(donations)
    }


@router.get("/progress")
async def get_progress(db: AsyncSession = Depends(get_db)):
    """Get current fundraising progress"""
    query = select(Progress).where(Progress.id == 1)
    result = await db.execute(query)
    progress = result.scalar_one_or_none()
    
    if not progress:
        progress = Progress()
        db.add(progress)
        await db.commit()
        await db.refresh(progress)
    
    percentage = (progress.current_amount / progress.goal_amount * 100) if progress.goal_amount > 0 else 0
    
    return ProgressResponse(
        current_amount=progress.current_amount,
        goal_amount=progress.goal_amount,
        percentage=round(percentage, 1),
        updated_at=progress.updated_at
    )


@router.get("/transaction/{transaction_id}")
async def check_transaction_status(transaction_id: str, db: AsyncSession = Depends(get_db)):
    """Check status of a transaction"""
    query = select(Transaction).where(Transaction.id == transaction_id)
    result = await db.execute(query)
    transaction = result.scalar_one_or_none()
    
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    
    return {
        "transaction_id": str(transaction.id),
        "status": transaction.status.value,
        "mpesa_receipt_number": transaction.mpesa_receipt_number,
        "result_description": transaction.result_description
    }