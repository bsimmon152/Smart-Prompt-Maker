from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class StatusCheckCreate(BaseModel):
    client_name: str

# Use Case Management Models
class UseCase(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    template: str
    example: str

class UseCaseCreate(BaseModel):
    name: str
    template: str
    example: str

class UseCaseUpdate(BaseModel):
    name: Optional[str] = None
    template: Optional[str] = None
    example: Optional[str] = None

class Category(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    icon: str
    color: str
    example: str
    use_cases: List[UseCase] = []

class CategoryCreate(BaseModel):
    name: str
    icon: str
    color: str
    example: str

class CategoryUpdate(BaseModel):
    name: Optional[str] = None
    icon: Optional[str] = None
    color: Optional[str] = None
    example: Optional[str] = None

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.dict()
    status_obj = StatusCheck(**status_dict)
    _ = await db.status_checks.insert_one(status_obj.dict())
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**status_check) for status_check in status_checks]

# Admin API endpoints for use case management
@api_router.get("/admin/categories", response_model=List[Category])
async def get_categories():
    """Get all categories with their use cases"""
    categories = await db.categories.find().to_list(1000)
    return [Category(**cat) for cat in categories]

@api_router.post("/admin/categories", response_model=Category)
async def create_category(category: CategoryCreate):
    """Create a new category"""
    category_dict = category.dict()
    category_obj = Category(**category_dict)
    category_data = category_obj.dict()
    
    # Check if category with same name already exists
    existing = await db.categories.find_one({"name": category_data["name"]})
    if existing:
        raise HTTPException(status_code=400, detail="Category with this name already exists")
    
    await db.categories.insert_one(category_data)
    return category_obj

@api_router.put("/admin/categories/{category_id}", response_model=Category)
async def update_category(category_id: str, category: CategoryUpdate):
    """Update an existing category"""
    category_data = {k: v for k, v in category.dict().items() if v is not None}
    
    if not category_data:
        raise HTTPException(status_code=400, detail="No fields to update")
    
    result = await db.categories.find_one_and_update(
        {"id": category_id},
        {"$set": category_data},
        return_document=True
    )
    
    if not result:
        raise HTTPException(status_code=404, detail="Category not found")
    
    return Category(**result)

@api_router.delete("/admin/categories/{category_id}")
async def delete_category(category_id: str):
    """Delete a category"""
    result = await db.categories.delete_one({"id": category_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Category not found")
    
    return {"message": "Category deleted successfully"}

@api_router.post("/admin/categories/{category_id}/use-cases", response_model=UseCase)
async def create_use_case(category_id: str, use_case: UseCaseCreate):
    """Add a new use case to a category"""
    # Check if category exists
    category = await db.categories.find_one({"id": category_id})
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    use_case_obj = UseCase(**use_case.dict())
    use_case_data = use_case_obj.dict()
    
    # Add the use case to the category
    await db.categories.update_one(
        {"id": category_id},
        {"$push": {"use_cases": use_case_data}}
    )
    
    return use_case_obj

@api_router.put("/admin/use-cases/{use_case_id}", response_model=UseCase)
async def update_use_case(use_case_id: str, use_case: UseCaseUpdate):
    """Update an existing use case"""
    use_case_data = {k: v for k, v in use_case.dict().items() if v is not None}
    
    if not use_case_data:
        raise HTTPException(status_code=400, detail="No fields to update")
    
    # Find the category containing this use case and update it
    result = await db.categories.find_one_and_update(
        {"use_cases.id": use_case_id},
        {"$set": {f"use_cases.$.{k}": v for k, v in use_case_data.items()}},
        return_document=True
    )
    
    if not result:
        raise HTTPException(status_code=404, detail="Use case not found")
    
    # Find and return the updated use case
    updated_use_case = next(uc for uc in result["use_cases"] if uc["id"] == use_case_id)
    return UseCase(**updated_use_case)

@api_router.delete("/admin/use-cases/{use_case_id}")
async def delete_use_case(use_case_id: str):
    """Delete a use case"""
    result = await db.categories.update_one(
        {"use_cases.id": use_case_id},
        {"$pull": {"use_cases": {"id": use_case_id}}}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Use case not found")
    
    return {"message": "Use case deleted successfully"}

# Public API for frontend to get categories and use cases
@api_router.get("/categories", response_model=List[Category])
async def get_public_categories():
    """Get all categories for the main application"""
    categories = await db.categories.find().to_list(1000)
    return [Category(**cat) for cat in categories]

# Initialize default data
@api_router.post("/admin/initialize-data")
async def initialize_default_data():
    """Initialize the database with default categories and use cases"""
    # Check if data already exists
    existing_count = await db.categories.count_documents({})
    if existing_count > 0:
        return {"message": "Data already exists", "categories_count": existing_count}
    
    # Default categories and use cases data
    default_categories = [
        {
            "id": "marketing",
            "name": "Marketing Copy",
            "icon": "Target",
            "color": "bg-blue-500",
            "example": "Perfect for creating website copy, email campaigns, or ad content that converts",
            "use_cases": [
                {
                    "id": str(uuid.uuid4()),
                    "name": "Website Homepage Copy",
                    "template": "Create compelling homepage copy for {businessName}, a {industry} business targeting {targetAudience}. \n\nKey product/service: {mainProduct}\nMain challenge to address: {keyChallenge}\nBusiness size: {businessSize}\n\nPlease create homepage copy that:\n- Captures attention with a strong headline\n- Clearly explains what we do and who we serve\n- Highlights our unique value proposition\n- Includes social proof elements\n- Has a clear call-to-action above the fold\n- Addresses common objections\n\nFormat: Provide headline, subheadline, main sections, and CTA button text.",
                    "example": "Great for creating your main website homepage that converts visitors into customers"
                },
                {
                    "id": str(uuid.uuid4()),
                    "name": "Email Marketing Campaign",
                    "template": "Create an email marketing campaign for {businessName}, a {industry} business targeting {targetAudience}.\n\nKey product/service: {mainProduct}\nMain challenge to address: {keyChallenge}\nBusiness size: {businessSize}\n\nPlease create a 3-email sequence that:\n- Builds trust and provides value\n- Addresses our target audience's pain points\n- Gradually introduces our solution\n- Includes compelling subject lines\n- Has clear calls-to-action in each email\n\nFormat: Provide subject lines, email content, and timing recommendations.",
                    "example": "Perfect for nurturing leads and converting them into paying customers"
                },
                {
                    "id": str(uuid.uuid4()),
                    "name": "Social Media Ads",
                    "template": "Create social media ad copy for {businessName}, a {industry} business targeting {targetAudience}.\n\nKey product/service: {mainProduct}\nMain challenge to address: {keyChallenge}\nBusiness size: {businessSize}\n\nPlease create ad variations for:\n- Facebook/Instagram ads (different lengths)\n- LinkedIn ads (professional tone)\n- Ad headlines and descriptions\n- Multiple hooks to test\n- Clear value propositions\n- Strong calls-to-action\n\nFormat: Provide multiple ad variations with explanations of target audience fit.",
                    "example": "Ideal for creating high-converting social media advertisements"
                }
            ]
        },
        {
            "id": "customer-service",
            "name": "Customer Service",
            "icon": "MessageSquare",
            "color": "bg-green-500",
            "example": "Great for building response templates, training materials, and customer communication strategies",
            "use_cases": [
                {
                    "id": str(uuid.uuid4()),
                    "name": "Customer Complaint Resolution",
                    "template": "Help me create customer complaint resolution templates for {businessName}, a {industry} business serving {targetAudience}.\n\nBusiness context:\n- Main product/service: {mainProduct}\n- Key challenge: {keyChallenge}\n- Business size: {businessSize}\n\nPlease create templates for:\n- Acknowledging the complaint professionally\n- Investigating and gathering information\n- Providing solutions and alternatives\n- Following up to ensure satisfaction\n- Preventing similar issues in the future\n\nInclude specific phrases that show empathy while maintaining professionalism. Provide templates for both email and phone conversations.",
                    "example": "Essential for handling customer complaints professionally and maintaining relationships"
                },
                {
                    "id": str(uuid.uuid4()),
                    "name": "FAQ and Support Responses",
                    "template": "Create comprehensive FAQ responses for {businessName}, a {industry} business serving {targetAudience}.\n\nBusiness context:\n- Main product/service: {mainProduct}\n- Key challenge: {keyChallenge}\n- Business size: {businessSize}\n\nPlease help me create:\n- Answers to the top 10 most common customer questions\n- Clear, helpful responses that reduce back-and-forth\n- Proactive information that prevents issues\n- Escalation procedures for complex questions\n- Templates for different communication channels (email, chat, phone)\n\nFocus on being helpful while reducing support workload.",
                    "example": "Perfect for creating self-service resources and consistent support responses"
                },
                {
                    "id": str(uuid.uuid4()),
                    "name": "Customer Onboarding Sequence",
                    "template": "Design a customer onboarding sequence for {businessName}, a {industry} business serving {targetAudience}.\n\nBusiness context:\n- Main product/service: {mainProduct}\n- Key challenge: {keyChallenge}\n- Business size: {businessSize}\n\nPlease create an onboarding sequence that:\n- Welcomes new customers warmly\n- Sets clear expectations\n- Provides step-by-step guidance\n- Anticipates and addresses common questions\n- Includes check-in points and success milestones\n- Encourages engagement and feedback\n\nFormat as a series of communications (emails, calls, materials) with timing recommendations.",
                    "example": "Great for ensuring new customers have a smooth start and become long-term clients"
                }
            ]
        }
    ]
    
    # Insert default data
    await db.categories.insert_many(default_categories)
    
    return {"message": "Default data initialized successfully", "categories_added": len(default_categories)}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
