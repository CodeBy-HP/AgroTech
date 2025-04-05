import os
import sys
from sqlalchemy.orm import Session
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base

# Add the parent directory to the path so we can import our modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from models import Base, GovScheme
from database import get_db, engine

def seed_schemes(db: Session):
    # Check if schemes already exist
    existing_schemes = db.query(GovScheme).all()
    if existing_schemes:
        print(f"Database already has {len(existing_schemes)} schemes. Skipping seeding.")
        return

    schemes_data = [
        {
            "scheme_name": "Namo Drone Didi",
            "detailed_description": "Provides drones to 15,000 Women Self Help Groups (SHGs) to assist with precision agriculture, crop health monitoring, and timely interventions. The scheme offers central assistance covering 80% of the drone cost (up to ₹8 lakh) and is designed to empower women while enhancing productivity, with the potential for SHGs to earn up to ₹1 lakh per year.",
            "type": "Central",
            "url": "https://pmkisan.gov.in/drone-scheme"
        },
        {
            "scheme_name": "National Food Security Mission (NFSM)",
            "detailed_description": "Aims to boost production of rice, wheat, pulses, and millets by expanding the cultivated area and improving productivity through modern agricultural practices, quality inputs, and efficient resource management. It also supports seed hubs and Farmer Producer Organizations (FPOs) to create sustainable food systems.",
            "type": "Central",
            "url": "https://nfsmonline.nic.in/"
        },
        {
            "scheme_name": "Mission for Integrated Development of Horticulture (MIDH)",
            "detailed_description": "Focuses on the comprehensive growth of the horticulture sector by supporting production, post-harvest management, and market access for fruits, vegetables, spices, and flowers. Since 2014-15, MIDH has covered about 12.95 lakh hectares, offering technical guidance, financial assistance, and capacity building to enhance quality and productivity.",
            "type": "Central",
            "url": "https://midh.gov.in/"
        },
        {
            "scheme_name": "National Bamboo Mission (NBM)",
            "detailed_description": "Targets the development of the bamboo value chain by promoting large-scale plantation, capacity building, and the establishment of 416 value-addition units over 46,000 hectares. The mission connects bamboo growers with processing industries and markets to create sustainable livelihoods and boost rural income.",
            "type": "Central",
            "url": "https://nbm.gov.in/"
        },
        {
            "scheme_name": "Integrated Scheme for Agriculture Marketing (ISAM)",
            "detailed_description": "Enhances agricultural marketing by integrating 1,389 mandis across 23 states into the e-NAM platform. The scheme aims to streamline price discovery, reduce post-harvest losses, and improve transparency and efficiency in the marketing of agricultural produce through digital connectivity.",
            "type": "Central",
            "url": "https://enam.gov.in/"
        },
        {
            "scheme_name": "Mission Organic Value Chain Development for North Eastern Region (MOVCDNER)",
            "detailed_description": "Promotes the creation of organic farming clusters in the Northeast by developing a complete organic value chain. Covering 172,966 hectares and supporting 379 FPOs, the mission facilitates organic certification, technical support, and market linkages to boost sustainable agricultural practices in the region.",
            "type": "Central",
            "url": "https://movcdner.gov.in/"
        },
        {
            "scheme_name": "Sub-Mission on Agriculture Extension (SMAE)",
            "detailed_description": "Aims to disseminate modern agricultural practices and technologies to farmers across India. Utilizing digital platforms such as ATMA, VISTAAR, and the Kisan Call Centre, SMAE provides timely advisory services and capacity-building initiatives to enhance productivity and sustainability in farming.",
            "type": "Central",
            "url": "https://agricoop.nic.in/smae"
        },
        {
            "scheme_name": "Digital Agriculture",
            "detailed_description": "Focuses on establishing a robust digital infrastructure for agriculture through initiatives like AgriStack. The scheme facilitates real-time data integration, decision support systems, and digital services to empower farmers with better market access, efficient resource management, and enhanced productivity.",
            "type": "Central",
            "url": "https://digitalagriculture.gov.in/"
        },
        {
            "scheme_name": "Pradhan Mantri Krishi Sinchayee Yojana (PMKSY)",
            "detailed_description": "A comprehensive irrigation initiative aimed at ensuring water availability across all agricultural farms. PMKSY focuses on creating a balanced irrigation network with measures for micro-irrigation, water conservation, and reduction of wastage, thereby supporting sustainable and productive farming practices.",
            "type": "Central",
            "url": "https://pmksy.gov.in/"
        },
        {
            "scheme_name": "Krishi UDAN 2.0",
            "detailed_description": "Designed to enhance the logistics of agricultural produce, this scheme leverages 53 airports to facilitate quick and efficient air transport of perishable commodities. By reducing post-harvest losses and ensuring rapid market access, Krishi UDAN 2.0 aims to improve farmer incomes and strengthen supply chains.",
            "type": "Central",
            "url": "https://civilaviation.gov.in/krishi-udan"
        },
        {
            "scheme_name": "Mission Amrit Sarovar",
            "detailed_description": "Focuses on the rejuvenation and development of 75 water bodies (Amrit Sarovars) to promote water conservation and support rural livelihoods. The mission emphasizes modernizing infrastructure, community participation, and integrated water resource management to restore and maintain these vital water resources.",
            "type": "Central",
            "url": "https://amritsarovar.gov.in/"
        },
        {
            "scheme_name": "National Beekeeping and Honey Mission (NBHM)",
            "detailed_description": "Aims to boost honey production and promote beekeeping as a sustainable income source for farmers. NBHM provides technical training, financial support, and market linkage assistance to establish modern beekeeping operations, ensuring sustainable practices and improved returns from bee products.",
            "type": "Central",
            "url": "https://nbhm.gov.in/"
        },
        {
            "scheme_name": "National Mission on Edible Oils – Oil Palm",
            "detailed_description": "Seeks to increase domestic oil palm cultivation to reduce reliance on imported edible oils. The mission provides technical support, high-yielding varieties, and guidance on sustainable cultivation practices, helping farmers transition to oil palm farming and strengthening the national edible oil sector.",
            "type": "Central",
            "url": "https://nmoeo.gov.in/"
        },
        {
            "scheme_name": "Animal Husbandry Infrastructure Development Fund (AHIDF)",
            "detailed_description": "Aims at modernizing the animal husbandry sector by financing the development of dairy, meat, and poultry infrastructure. AHIDF supports the construction of modern livestock facilities, improved animal health management systems, and efficient processing units to boost productivity and farmer incomes.",
            "type": "Central",
            "url": "https://ahidf.gov.in/"
        },
        {
            "scheme_name": "Vibrant Villages Programme",
            "detailed_description": "Targets the holistic development of rural areas, especially villages near international borders. The programme integrates agricultural support with infrastructure development, community services, and security enhancements to uplift rural economies and improve the overall quality of life.",
            "type": "Central",
            "url": "https://vibrantvillages.gov.in/"
        },
        {
            "scheme_name": "Interest Subvention on Dairy Loans",
            "detailed_description": "Provides financial relief to dairy farmers by offering interest subvention on working capital loans. This scheme is designed to lower the cost of borrowing, enabling farmers to invest in better technology, improve infrastructure, and enhance overall dairy production in a competitive market.",
            "type": "Central",
            "url": "https://dairyindia.gov.in/"
        },
        {
            "scheme_name": "Group Accident Insurance for Fishermen",
            "detailed_description": "Offers group accident coverage for fishermen to mitigate risks associated with fishing operations. The scheme ensures that in the event of an accident, the affected fishermen and their families receive financial support, thus providing a safety net and enhancing livelihood security.",
            "type": "Central",
            "url": "https://fisheries.gov.in/"
        },
        {
            "scheme_name": "Kisan Credit Card (KCC) for Animal Husbandry",
            "detailed_description": "Provides a dedicated credit facility to livestock farmers for the purchase of cattle, feed, and equipment. By offering easier access to funds and streamlined credit processes, this scheme supports the modernization and growth of animal husbandry practices across the country.",
            "type": "Central",
            "url": "https://nabard.org/kcc-animal-husbandry.html"
        }
    ]

    # Create scheme objects
    schemes = []
    for scheme_data in schemes_data:
        scheme = GovScheme(**scheme_data)
        db.add(scheme)
        schemes.append(scheme)
    
    # Commit to database
    db.commit()
    
    print(f"Successfully seeded {len(schemes)} government schemes.")

if __name__ == "__main__":
    # Create tables if they don't exist
    Base.metadata.create_all(bind=engine)
    
    # Seed the database
    db = next(get_db())
    try:
        seed_schemes(db)
    finally:
        db.close() 