from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from database import get_db
from models.donation import Donation
from models.transaction import Transaction, TransactionStatus
from models.progress import Progress
from schemas.progress import ProgressUpdate
from config import get_settings

settings = get_settings()
router = APIRouter(prefix="/admin", tags=["admin"])


# ==================== AUTH MIDDLEWARE ====================

async def verify_admin(x_admin_key: str = Header(None)):
    """Verify admin key from request header"""
    if not x_admin_key or x_admin_key != settings.ADMIN_SECRET_KEY:
        raise HTTPException(status_code=403, detail="Unauthorized")
    return True


# ==================== AUTH ENDPOINTS ====================

@router.get("/verify")
async def verify_admin_key(_: bool = Depends(verify_admin)):
    """Verify admin key is valid"""
    return {
        "status": "ok",
        "message": "Admin key verified successfully",
        "app": settings.APP_NAME
    }


# ==================== STATS ENDPOINTS ====================

@router.get("/stats")
async def get_admin_stats(db: AsyncSession = Depends(get_db), _: bool = Depends(verify_admin)):
    """Get dashboard statistics"""
    
    # Total donations count
    total_donations_result = await db.execute(select(func.count(Donation.id)))
    total_donations = total_donations_result.scalar() or 0
    
    # Total amount from successful transactions
    total_amount_result = await db.execute(
        select(func.coalesce(func.sum(Transaction.amount), 0))
        .where(Transaction.status == TransactionStatus.SUCCESS)
    )
    total_amount = total_amount_result.scalar() or 0
    
    # Total messages (donations with messages)
    total_messages_result = await db.execute(
        select(func.count(Donation.id))
        .where(Donation.message.isnot(None))
        .where(Donation.message != '')
    )
    total_messages = total_messages_result.scalar() or 0
    
    # Unique supporters (unique phone numbers)
    unique_supporters_result = await db.execute(
        select(func.count(func.distinct(Donation.phone_number)))
    )
    unique_supporters = unique_supporters_result.scalar() or 0
    
    # Successful transactions count
    successful_result = await db.execute(
        select(func.count(Transaction.id))
        .where(Transaction.status == TransactionStatus.SUCCESS)
    )
    successful_transactions = successful_result.scalar() or 0
    
    # Pending transactions count
    pending_result = await db.execute(
        select(func.count(Transaction.id))
        .where(Transaction.status == TransactionStatus.PENDING)
    )
    pending_transactions = pending_result.scalar() or 0
    
    return {
        "total_donations": total_donations,
        "total_amount": float(total_amount),
        "total_messages": total_messages,
        "unique_supporters": unique_supporters,
        "successful_transactions": successful_transactions,
        "pending_transactions": pending_transactions,
    }


# ==================== MESSAGE ENDPOINTS ====================

@router.get("/messages")
async def get_all_messages(db: AsyncSession = Depends(get_db), _: bool = Depends(verify_admin)):
    """Get all donation messages with transaction status"""
    query = select(Donation).order_by(Donation.created_at.desc())
    result = await db.execute(query)
    donations = result.scalars().all()
    
    messages_list = []
    for donation in donations:
        # Get the latest transaction for this donation
        tx_query = select(Transaction).where(
            Transaction.donation_id == donation.id
        ).order_by(Transaction.created_at.desc()).limit(1)
        tx_result = await db.execute(tx_query)
        transaction = tx_result.scalar_one_or_none()
        
        messages_list.append({
            "id": str(donation.id),
            "amount": donation.amount,
            "name": donation.name,
            "message": donation.message,
            "phone_number": donation.phone_number[-4:] if donation.phone_number else "****",
            "is_public": donation.is_public,
            "created_at": donation.created_at.isoformat() if donation.created_at else None,
            "transaction_status": transaction.status.value if transaction else "unknown",
        })
    
    return messages_list


@router.patch("/messages/{donation_id}/approve")
async def approve_message(donation_id: str, db: AsyncSession = Depends(get_db), _: bool = Depends(verify_admin)):
    """Approve a message for public display"""
    query = select(Donation).where(Donation.id == donation_id)
    result = await db.execute(query)
    donation = result.scalar_one_or_none()
    
    if not donation:
        raise HTTPException(status_code=404, detail="Donation not found")
    
    donation.is_public = True
    await db.flush()
    
    return {
        "message": "Message approved successfully",
        "donation_id": str(donation.id),
        "is_public": True
    }


@router.patch("/messages/{donation_id}/hide")
async def hide_message(donation_id: str, db: AsyncSession = Depends(get_db), _: bool = Depends(verify_admin)):
    """Hide a message from public display"""
    query = select(Donation).where(Donation.id == donation_id)
    result = await db.execute(query)
    donation = result.scalar_one_or_none()
    
    if not donation:
        raise HTTPException(status_code=404, detail="Donation not found")
    
    donation.is_public = False
    await db.flush()
    
    return {
        "message": "Message hidden successfully",
        "donation_id": str(donation.id),
        "is_public": False
    }


@router.delete("/messages/{donation_id}")
async def delete_message(donation_id: str, db: AsyncSession = Depends(get_db), _: bool = Depends(verify_admin)):
    """Delete a donation and its associated transactions"""
    query = select(Donation).where(Donation.id == donation_id)
    result = await db.execute(query)
    donation = result.scalar_one_or_none()
    
    if not donation:
        raise HTTPException(status_code=404, detail="Donation not found")
    
    # Delete associated transactions first (cascade should handle this, but explicit is safer)
    tx_query = select(Transaction).where(Transaction.donation_id == donation_id)
    tx_result = await db.execute(tx_query)
    transactions = tx_result.scalars().all()
    
    for tx in transactions:
        await db.delete(tx)
    
    # Delete the donation
    await db.delete(donation)
    await db.flush()
    
    return {
        "message": "Message deleted successfully",
        "donation_id": donation_id
    }


# ==================== TRANSACTION ENDPOINTS ====================

@router.get("/transactions")
async def get_all_transactions(
    db: AsyncSession = Depends(get_db), 
    _: bool = Depends(verify_admin),
    limit: int = 50,
    status: str = None
):
    """Get all transactions with optional filtering"""
    query = select(Transaction)
    
    if status:
        try:
            tx_status = TransactionStatus(status)
            query = query.where(Transaction.status == tx_status)
        except ValueError:
            pass  # Ignore invalid status values
    
    query = query.order_by(Transaction.created_at.desc()).limit(limit)
    result = await db.execute(query)
    transactions = result.scalars().all()
    
    return [
        {
            "id": str(tx.id),
            "donation_id": str(tx.donation_id),
            "amount": tx.amount,
            "phone_number": tx.phone_number[-4:] if tx.phone_number else "****",
            "status": tx.status.value,
            "mpesa_receipt_number": tx.mpesa_receipt_number,
            "result_description": tx.result_description,
            "created_at": tx.created_at.isoformat() if tx.created_at else None,
        }
        for tx in transactions
    ]


# ==================== PROGRESS ENDPOINTS ====================

@router.get("/progress")
async def get_admin_progress(db: AsyncSession = Depends(get_db), _: bool = Depends(verify_admin)):
    """Get current progress (admin version)"""
    query = select(Progress).where(Progress.id == 1)
    result = await db.execute(query)
    progress = result.scalar_one_or_none()
    
    if not progress:
        progress = Progress()
        db.add(progress)
        await db.commit()
        await db.refresh(progress)
    
    percentage = (progress.current_amount / progress.goal_amount * 100) if progress.goal_amount > 0 else 0
    
    return {
        "goal_amount": progress.goal_amount,
        "current_amount": progress.current_amount,
        "percentage": round(percentage, 1),
        "updated_at": progress.updated_at.isoformat() if progress.updated_at else None,
    }


@router.patch("/progress")
async def update_progress(
    progress_data: ProgressUpdate, 
    db: AsyncSession = Depends(get_db), 
    _: bool = Depends(verify_admin)
):
    """Update progress amounts"""
    query = select(Progress).where(Progress.id == 1)
    result = await db.execute(query)
    progress = result.scalar_one_or_none()
    
    if not progress:
        progress = Progress()
        db.add(progress)
    
    if progress_data.goal_amount is not None:
        if progress_data.goal_amount < 0:
            raise HTTPException(status_code=400, detail="Goal amount cannot be negative")
        progress.goal_amount = progress_data.goal_amount
    
    if progress_data.current_amount is not None:
        if progress_data.current_amount < 0:
            raise HTTPException(status_code=400, detail="Current amount cannot be negative")
        progress.current_amount = progress_data.current_amount
    
    await db.flush()
    
    percentage = (progress.current_amount / progress.goal_amount * 100) if progress.goal_amount > 0 else 0
    
    return {
        "message": "Progress updated successfully",
        "goal_amount": progress.goal_amount,
        "current_amount": progress.current_amount,
        "percentage": round(percentage, 1)
    }