import sys
from datetime import date, datetime, timedelta
from sqlalchemy.orm import Session
from passlib.context import CryptContext
import random

from database import get_db, engine
from models import Base, User, Farm, Bid, UserType, FarmStatusEnum, BidStatusEnum

# Password handling
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str):
    return pwd_context.hash(password)

def seed_database():
    db = next(get_db())
    
    try:
        print("Creating test farmers...")
        farm_locations = ["Punjab", "Haryana", "Uttar Pradesh", "Maharashtra", "Karnataka"]
        
        farmers = [
            {"username": f"farmer{i}", "email": f"farmer{i}@example.com", "hashed_password": hash_password("123"),
             "is_active": True, "user_type": UserType.FARMER, "full_name": f"Farmer {i}", "mobile_number": f"98765432{i}0", 
             "farm_location": random.choice(farm_locations), "farm_area": random.randint(20, 100), "government_id": f"FARM12345{i}"} 
            for i in range(1, 11)
        ]
        
        for farmer_data in farmers:
            db.add(User(**farmer_data))
        db.commit()
        
        print("Creating test companies...")
        company_types = ["Retailer", "Wholesaler", "Exporter", "Supermarket"]
        
        companies = [
            {"username": f"company{i}", "email": f"company{i}@example.com", "hashed_password": hash_password("123"),
             "is_active": True, "user_type": UserType.COMPANY, "full_name": f"Company {i} Manager", "mobile_number": f"76543210{i}9", 
             "company_name": f"Company {i} Pvt Ltd", "company_type": random.choice(company_types), "company_location": "India", 
             "contact_person_designation": "Manager", "company_gst_id": f"GST12345{i}"} 
            for i in range(1, 11)
        ]
        
        for company_data in companies:
            db.add(User(**company_data))
        db.commit()
        
        print("Creating test farms...")
        today = date.today()
        crop_types = ["Wheat", "Rice", "Corn", "Barley", "Soybeans", "Cotton", "Sugarcane", "Tomatoes", "Potatoes", "Onions"]
        
        farms = [
            {"farmer_username": f"farmer{i%10+1}", "farm_location": random.choice(farm_locations), "latitude": 25.0 + i, "longitude": 80.0 + i, 
             "farm_area": random.randint(10, 50), "crop_type": random.choice(crop_types), "is_organic": random.choice([True, False]), 
             "pesticides_used": "Organic" if i % 2 == 0 else "Chemical", "expected_harvest_date": today + timedelta(days=i*10),
             "expected_quantity": random.randint(500, 5000), "min_asking_price": random.randint(1500, 5000), "farm_status": random.choice(list(FarmStatusEnum))}
            for i in range(1, 21)
        ]
        
        for farm_data in farms:
            db.add(Farm(**farm_data))
        db.commit()
        
        print("Creating test bids...")
        all_farms = db.query(Farm).all()
        
        bids = [
            {"farm_id": farm.id, "company_username": f"company{i%10+1}", "bid_amount": random.randint(2000, 10000), 
             "bid_date": datetime.now() - timedelta(days=i), "status": random.choice(list(BidStatusEnum))}
            for i, farm in enumerate(all_farms, start=1)
        ]
        
        for bid_data in bids:
            db.add(Bid(**bid_data))
        db.commit()
        
        print("Database seeded successfully!")
    
    except Exception as e:
        db.rollback()
        print(f"Error: {e}")
        return False
    finally:
        db.close()
    
    return True

if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == '--reset':
        print("Dropping and recreating tables...")
        Base.metadata.drop_all(bind=engine)
        Base.metadata.create_all(bind=engine)
    
    print("Seeding database...")
    if seed_database():
        print("Test data has been added successfully!")
    else:
        print("Failed to add test data.")
