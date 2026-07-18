import json
import os
from datetime import datetime, timedelta
from uuid import uuid4

from sqlmodel import Session, select
from app.core.db import engine
from app.models.user import User
from app.models.family import Family
from app.models.trip_session import TripSession
from app.models.itinerary import Itinerary
from app.models.agent_job import AgentJob, JobType, JobStatus
from app.services.user_service import UserService
from app.core.security import get_password_hash

# Import PERSONAS for rich metadata
from scripts.generate_demo_data import PERSONAS

DEMO_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "demo_data")

class DemoProvisionService:
    @staticmethod
    def provision_all():
        print("Starting demo database provisioning...")
        with Session(engine) as session:
            # Create Demo Administrator
            admin = session.exec(select(User).where(User.email == "admin@demo.merydian.com")).first()
            if not admin:
                admin = User(
                    email="admin@demo.merydian.com",
                    hashed_password=get_password_hash("demo123"),
                    role="agent",
                    full_name="Demo Administrator",
                    is_active=True
                )
                session.add(admin)
                session.commit()
                print("Created Demo Administrator")
            
            # Process each persona
            for persona_name, config in PERSONAS.items():
                file_path = os.path.join(DEMO_DIR, f"{persona_name}_trip.json")
                if not os.path.exists(file_path):
                    print(f"Skipping {persona_name}: JSON fixture not found.")
                    continue
                    
                with open(file_path, "r") as f:
                    data = json.load(f)
                    
                trip_id = data.get("trip_id")
                
                existing_trip = session.exec(select(TripSession).where(TripSession.trip_id == trip_id)).first()
                if existing_trip:
                    print(f"Skipping {persona_name}: Trip {trip_id} already exists.")
                    continue
                
                # 1. Create User
                email = f"{persona_name.lower()}@demo.merydian.com"
                user = session.exec(select(User).where(User.email == email)).first()
                if not user:
                    user = User(
                        email=email,
                        hashed_password=get_password_hash("demo123"),
                        role="traveller",
                        full_name=persona_name.replace("_", " "),
                        is_active=True
                    )
                    session.add(user)
                    session.flush()
                
                # 2. Create Family
                fam_config = config["families"][0]
                family = session.exec(select(Family).where(Family.family_code == fam_config["family_id"])).first()
                if not family:
                    family = Family(
                        family_code=fam_config["family_id"],
                        family_name=f"{persona_name.replace('_', ' ')} Family",
                        trip_name=config["trip_name"],
                        destination=config["destination"],
                        start_date=datetime.fromisoformat(config["start_date"]),
                        end_date=datetime.fromisoformat(config["end_date"]),
                        preferences=fam_config,
                        is_active=True
                    )
                    session.add(family)
                    session.flush()
                
                user.family_id = family.id
                session.add(user)
                
                # 3. Create Itinerary Versions
                baseline_itin = Itinerary(
                    family_id=family.id,
                    version=1,
                    data={"days": [{"day": 1, "pois": [{"name": "Arrival"}]}]},
                    created_reason="Baseline generation",
                    created_by="system",
                    total_cost=2000.0,
                    total_satisfaction=5.0,
                    duration_days=4
                )
                session.add(baseline_itin)
                session.flush()
                
                optimized_itin = Itinerary(
                    family_id=family.id,
                    version=2,
                    data={"days": [{"day": 1, "pois": [{"name": "Arrival"}, {"name": "Sightseeing"}]}]},
                    created_reason="User feedback processed",
                    created_by="system",
                    total_cost=2500.0,
                    total_satisfaction=8.5,
                    duration_days=4
                )
                session.add(optimized_itin)
                session.flush()
                
                # 4. Create TripSession
                trip_session = TripSession(
                    trip_id=trip_id,
                    trip_name=config["trip_name"],
                    destination=config["destination"],
                    start_date=datetime.fromisoformat(config["start_date"]),
                    end_date=datetime.fromisoformat(config["end_date"]),
                    family_ids=[str(family.id)],
                    current_itinerary_id=optimized_itin.id,
                    iteration_count=2,
                    status="active",
                    feedback_history=[
                        {
                            "iteration": 1,
                            "timestamp": datetime.utcnow().isoformat(),
                            "family_id": fam_config["family_id"],
                            "message": "Add more sightseeing.",
                            "event_type": "FEEDBACK_SUBMITTED"
                        }
                    ]
                )
                session.add(trip_session)
                session.flush()
                
                family.current_itinerary_version = optimized_itin.id
                session.add(family)
                
                # 5. Create Agent Jobs
                job = AgentJob(
                    job_type=JobType.AGENT_TOOLS,
                    status=JobStatus.COMPLETED,
                    trip_id=trip_id,
                    created_by_user_id=user.id,
                    started_at=datetime.utcnow() - timedelta(minutes=5),
                    completed_at=datetime.utcnow() - timedelta(minutes=1)
                )
                session.add(job)
                
                print(f"Provisioned demo data for {persona_name} (Trip: {trip_id})")
                
            session.commit()
            print("Demo database provisioning complete.")
            return True
            
    @staticmethod
    def reset_demo():
        print("Resetting demo database...")
        with Session(engine) as session:
            # Simple cleanup of demo records
            demo_users = session.exec(select(User).where(User.email.like("%@demo.merydian.com"))).all()
            user_ids = [u.id for u in demo_users]
            fam_ids = [u.family_id for u in demo_users if u.family_id]
            
            if user_ids:
                jobs = session.exec(select(AgentJob).where(AgentJob.created_by_user_id.in_(user_ids))).all()
                for j in jobs: session.delete(j)
                
            if fam_ids:
                # We need to manually construct the JSON array contains check or just fetch all and filter
                trips = session.exec(select(TripSession)).all()
                for t in trips:
                    if any(str(f_id) in t.family_ids for f_id in fam_ids):
                        session.delete(t)
                
                itineraries = session.exec(select(Itinerary).where(Itinerary.family_id.in_(fam_ids))).all()
                for i in itineraries: session.delete(i)
                
                for u in demo_users: session.delete(u)
                
                families = session.exec(select(Family).where(Family.id.in_(fam_ids))).all()
                for f in families: session.delete(f)
                
            session.commit()
        return DemoProvisionService.provision_all()
