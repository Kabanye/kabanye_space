from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import init_db
from routes import public, admin, payment
from config import get_settings
import os

settings = get_settings()

app = FastAPI(
    title="Kabanye Space API",
    description="Donation & Support Platform with M-Pesa Integration",
    version="1.0.0"
)

# CORS - Allow local dev + Render frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "https://kabanye-space.onrender.com",
        os.getenv("FRONTEND_URL", ""),
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(public.router, prefix="/api", tags=["public"])
app.include_router(admin.router, prefix="/api", tags=["admin"])
app.include_router(payment.router, prefix="/api", tags=["payment"])


@app.on_event("startup")
async def startup_event():
    await init_db()
    print("Database initialized successfully!")


@app.get("/")
async def root():
    return {
        "message": "Kabanye Space API",
        "version": "1.0.0",
        "docs": "/docs"
    }