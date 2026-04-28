from fastapi import APIRouter, Depends, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from database import get_db
from models.transaction import Transaction, TransactionStatus
from services.mpesa import get_access_token
from config import get_settings
import logging
import httpx
import base64
from datetime import datetime

logger = logging.getLogger(__name__)
settings = get_settings()
router = APIRouter(prefix="/payment", tags=["payment"])


@router.post("/callback")
async def mpesa_callback(request: Request, db: AsyncSession = Depends(get_db)):
    """Handle M-Pesa STK Push callback"""
    try:
        callback_data = await request.json()
        logger.info(f"M-Pesa Callback Received: {callback_data}")
        
        body = callback_data.get("Body", {}).get("stkCallback", {})
        checkout_request_id = body.get("CheckoutRequestID")
        result_code = str(body.get("ResultCode", ""))
        result_description = body.get("ResultDesc", "No description")
        
        logger.info(f"CheckoutRequestID: {checkout_request_id}, ResultCode: {result_code}")
        
        # Find transaction by checkout_request_id
        query = select(Transaction).where(
            Transaction.checkout_request_id == checkout_request_id
        )
        result = await db.execute(query)
        transaction = result.scalar_one_or_none()
        
        if transaction:
            transaction.result_code = result_code
            transaction.result_description = result_description
            
            if result_code == "0":
                # Payment successful
                transaction.status = TransactionStatus.SUCCESS
                
                # Extract receipt number from callback metadata
                items = body.get("CallbackMetadata", {}).get("Item", [])
                for item in items:
                    if item.get("Name") == "MpesaReceiptNumber":
                        transaction.mpesa_receipt_number = item.get("Value")
                        logger.info(f"Receipt: {item.get('Value')}")
                    if item.get("Name") == "Amount":
                        logger.info(f"Amount Paid: {item.get('Value')}")
                
                logger.info(f"Transaction {transaction.id} marked as SUCCESS")
            else:
                # Payment failed
                transaction.status = TransactionStatus.FAILED
                logger.warning(f"Transaction {transaction.id} FAILED: {result_description}")
            
            await db.flush()
            return {"ResultCode": 0, "ResultDesc": "Callback processed successfully"}
        
        logger.warning(f"No transaction found for CheckoutRequestID: {checkout_request_id}")
        return {"ResultCode": 0, "ResultDesc": "Callback acknowledged - no matching transaction"}
    
    except Exception as e:
        logger.error(f"Callback processing error: {str(e)}")
        return {"ResultCode": 1, "ResultDesc": "Error processing callback"}


@router.post("/test-stk-push")
async def test_stk_push(
    phone_number: str = "254708374149", 
    amount: float = 1,
    db: AsyncSession = Depends(get_db)
):
    """Test STK Push directly - Debug endpoint"""
    
    logger.info(f"Testing STK Push to {phone_number} for KES {amount}")
    
    # Step 1: Get OAuth token
    token = await get_access_token()
    
    if not token:
        return {
            "success": False,
            "step": "oauth",
            "error": "Failed to get access token. Check CONSUMER_KEY and CONSUMER_SECRET.",
            "consumer_key_prefix": settings.MPESA_CONSUMER_KEY[:10] + "...",
        }
    
    logger.info(f"OAuth token obtained: {token[:20]}...")
    
    # Step 2: Prepare STK Push
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    password = base64.b64encode(
        f"{settings.MPESA_SHORTCODE}{settings.MPESA_PASSKEY}{timestamp}".encode()
    ).decode()
    
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "BusinessShortCode": settings.MPESA_SHORTCODE,
        "Password": password,
        "Timestamp": timestamp,
        "TransactionType": "CustomerPayBillOnline",
        "Amount": int(amount),
        "PartyA": phone_number,
        "PartyB": settings.MPESA_SHORTCODE,
        "PhoneNumber": phone_number,
        "CallBackURL": f"{settings.CALLBACK_BASE_URL}/api/payment/callback",
        "AccountReference": "Test Payment",
        "TransactionDesc": "Testing STK Push"
    }
    
    # Step 3: Send STK Push
    url = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest"
    
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(url, json=payload, headers=headers)
            response_data = response.json()
            
            logger.info(f"STK Push Response: {response_data}")
            
            return {
                "success": True,
                "status_code": response.status_code,
                "response": response_data,
                "request_details": {
                    "phone": phone_number,
                    "amount": int(amount),
                    "shortcode": settings.MPESA_SHORTCODE,
                    "callback_url": f"{settings.CALLBACK_BASE_URL}/api/payment/callback",
                }
            }
    
    except Exception as e:
        logger.error(f"STK Push failed: {str(e)}")
        return {
            "success": False,
            "step": "stk_push",
            "error": str(e),
            "request_details": {
                "phone": phone_number,
                "amount": int(amount),
                "callback_url": f"{settings.CALLBACK_BASE_URL}/api/payment/callback",
            }
        }


@router.get("/check-callback")
async def check_callback_url():
    """Verify the callback URL is accessible"""
    return {
        "callback_url": f"{settings.CALLBACK_BASE_URL}/api/payment/callback",
        "ngrok_working": "Verify this URL is accessible from the internet",
        "tip": "Open this URL in your browser - you should get a 'Method Not Allowed' response (that means it's working)"
    }