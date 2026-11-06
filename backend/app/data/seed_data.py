import sys
import os
from datetime import datetime, timedelta, timezone

# Ensure backend root is on sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from app.core.database import SessionLocal, engine, Base
from app.core.security import hash_password
from app.models.models import (
    User,
    Company,
    RecruiterProfile,
    ApplicantProfile,
    Job,
    Application,
    ApplicationTimeline,
    SavedJob,
    JobAlert,
    Interview,
    Notification,
    UserReport,
    CompanyVerificationRequest,
    AuditLog,
    PlatformFeedback
)

def utc_now():
    return datetime.now(timezone.utc)

def seed():
    print("Dropping existing tables and recreating schema...")
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        print("Seeding Users...")
        # 1. Administrator
        admin = User(
            email="admin@hirenest.com",
            hashed_password=hash_password("Admin@123"),
            full_name="Eleanor Vance",
            role="admin",
            phone="+1 (555) 019-2831",
            is_active=True,
            is_verified=True
        )
        db.add(admin)

        # 2. Recruiters
        recruiter_sarah = User(
            email="sarah.recruiter@techpulse.io",
            hashed_password=hash_password("Recruiter@123"),
            full_name="Sarah Jenkins",
            role="recruiter",
            phone="+1 (555) 438-9201",
            is_active=True,
            is_verified=True
        )
        recruiter_david = User(
            email="david.hiring@greenwave.co",
            hashed_password=hash_password("Recruiter@123"),
            full_name="David Miller",
            role="recruiter",
            phone="+1 (555) 672-1149",
            is_active=True,
            is_verified=True
        )
        recruiter_elena = User(
            email="elena.talent@apexfinancial.com",
            hashed_password=hash_password("Recruiter@123"),
            full_name="Elena Rostova",
            role="recruiter",
            phone="+1 (555) 891-3420",
            is_active=True,
            is_verified=True
        )
        db.add_all([recruiter_sarah, recruiter_david, recruiter_elena])

        # 3. Applicants
        applicant_alex = User(
            email="alex.dev@gmail.com",
            hashed_password=hash_password("Applicant@123"),
            full_name="Alex Rivera",
            role="applicant",
            phone="+1 (555) 234-5678",
            is_active=True,
            is_verified=True
        )
        applicant_maya = User(
            email="maya.ux@gmail.com",
            hashed_password=hash_password("Applicant@123"),
            full_name="Maya Chen",
            role="applicant",
            phone="+1 (555) 345-6789",
            is_active=True,
            is_verified=True
        )
        applicant_liam = User(
            email="liam.data@gmail.com",
            hashed_password=hash_password("Applicant@123"),
            full_name="Liam O'Connor",
            role="applicant",
            phone="+1 (555) 456-7890",
            is_active=True,
            is_verified=True
        )
        db.add_all([applicant_alex, applicant_maya, applicant_liam])
        db.flush()

        print("Seeding Companies...")
        comp_techpulse = Company(
            name="TechPulse Innovations",
            description="TechPulse builds scalable enterprise cloud architectures, AI workflows, and modern web applications trusted by global enterprises.",
            industry="Software & Cloud Infrastructure",
            website="https://techpulse.io",
            size="51-200",
            headquarters="San Francisco, CA",
            contact_email="careers@techpulse.io",
            is_verified=True,
            verification_status="verified",
            verification_notes="Verified via California Corporate Registry & Domain validation."
        )
        comp_greenwave = Company(
            name="GreenWave Logistics",
            description="GreenWave operates high-efficiency carbon-neutral freight logistics powered by automated routing algorithms and IoT telemetry.",
            industry="Supply Chain & Logistics",
            website="https://greenwavelogistics.com",
            size="201-500",
            headquarters="Chicago, IL",
            contact_email="talent@greenwave.co",
            is_verified=True,
            verification_status="verified",
            verification_notes="Verified via Illinois Secretary of State Certificate of Good Standing."
        )
        comp_apex = Company(
            name="Apex Financial Systems",
            description="Apex develops resilient transactional banking cores, automated fraud detection pipelines, and high-frequency settlement networks.",
            industry="Fintech & Banking",
            website="https://apexfinancial.com",
            size="500+",
            headquarters="New York, NY",
            contact_email="recruiting@apexfinancial.com",
            is_verified=True,
            verification_status="verified",
            verification_notes="Verified via FINRA & New York State Banking Department registration."
        )
        comp_cloudforge = Company(
            name="CloudForge Systems",
            description="CloudForge provides developer experience platforms, Kubernetes management tooling, and continuous deployment pipelines.",
            industry="DevOps & Platform Engineering",
            website="https://cloudforge.dev",
            size="11-50",
            headquarters="Austin, TX",
            contact_email="jobs@cloudforge.dev",
            is_verified=True,
            verification_status="verified",
            verification_notes="Verified business entity."
        )
        comp_lumina = Company(
            name="Lumina Health Technologies",
            description="Lumina develops HIPAA-compliant telehealth portals, clinical diagnostics workflows, and remote patient monitoring software.",
            industry="Healthcare & Telemedicine",
            website="https://luminahealth.org",
            size="11-50",
            headquarters="Boston, MA",
            contact_email="contact@luminahealth.org",
            is_verified=False,
            verification_status="pending",
            verification_notes="Pending administrative credential review."
        )
        db.add_all([comp_techpulse, comp_greenwave, comp_apex, comp_cloudforge, comp_lumina])
        db.flush()

        print("Seeding Recruiter Profiles...")
        prof_sarah = RecruiterProfile(
            user_id=recruiter_sarah.id,
            company_id=comp_techpulse.id,
            job_title="Director of Technical Recruiting",
            department="Engineering Talent"
        )
        prof_david = RecruiterProfile(
            user_id=recruiter_david.id,
            company_id=comp_greenwave.id,
            job_title="Lead Talent Acquisition Partner",
            department="People & Growth"
        )
        prof_elena = RecruiterProfile(
            user_id=recruiter_elena.id,
            company_id=comp_apex.id,
            job_title="Head of Global Recruitment",
            department="Human Resources"
        )
        db.add_all([prof_sarah, prof_david, prof_elena])

        print("Seeding Applicant Profiles...")
        prof_alex = ApplicantProfile(
            user_id=applicant_alex.id,
            headline="Senior Full Stack Software Engineer | React, TypeScript & Python",
            bio="Full stack software engineer with 6+ years of experience designing high-throughput web applications, microservices, and distributed cloud systems. Passionate about clean code, robust test coverage, and human-centered user experiences.",
            location="San Francisco, CA (Open to Remote)",
            preferred_employment_type="Full-time",
            preferred_location="Remote",
            expected_salary="$140,000 - $160,000",
            skills=["React", "TypeScript", "Python", "FastAPI", "PostgreSQL", "Tailwind CSS", "Docker", "RESTful APIs", "Git", "Redis"],
            experience=[
                {
                    "company": "Vanguard Tech Labs",
                    "role": "Senior Software Engineer",
                    "period": "2022 - Present",
                    "description": "Architected event-driven microservices serving 1.2M daily active users. Migrated core React dashboard to TypeScript and reduced page load times by 42%."
                },
                {
                    "company": "Nexus Interactive",
                    "role": "Full Stack Developer",
                    "period": "2019 - 2022",
                    "description": "Built responsive SaaS interfaces using React and FastAPI. Authored comprehensive automated test suites achieving 88% branch coverage."
                }
            ],
            education=[
                {
                    "institution": "University of California, Berkeley",
                    "degree": "B.S. in Computer Science",
                    "year": "2019"
                }
            ],
            projects=[
                {
                    "title": "CloudTask Orchestrator",
                    "description": "Open-source asynchronous job queue dashboard with real-time WebSocket telemetry and Python FastAPI backend.",
                    "link": "https://github.com/alexrivera/cloudtask"
                }
            ],
            certifications=[
                {"name": "AWS Certified Solutions Architect - Associate", "year": "2023"}
            ],
            profile_completion=95,
            resume_url="/uploads/resumes/alex_rivera_resume.pdf",
            resume_filename="alex_rivera_resume.pdf"
        )

        prof_maya = ApplicantProfile(
            user_id=applicant_maya.id,
            headline="Lead Product Designer & UX Strategist | Design Systems & Complex Web SaaS",
            bio="Senior Product Designer with 7 years specializing in complex B2B workflows, data visualization dashboards, and comprehensive design systems. Focused on making sophisticated tools delightfully intuitive.",
            location="Seattle, WA (Open to Hybrid / Remote)",
            preferred_employment_type="Full-time",
            preferred_location="Hybrid",
            expected_salary="$130,000 - $155,000",
            skills=["Figma", "Design Systems", "UI/UX", "User Research", "Prototyping", "Information Architecture", "Wireframing", "Tailwind CSS"],
            experience=[
                {
                    "company": "Stratum Design Studio",
                    "role": "Lead Product Designer",
                    "period": "2021 - Present",
                    "description": "Led UX overhaul for enterprise analytics suite, improving task completion speed by 35% across 40,000 corporate users."
                }
            ],
            education=[
                {
                    "institution": "University of Washington",
                    "degree": "B.Des in Interaction Design",
                    "year": "2018"
                }
            ],
            projects=[],
            certifications=[{"name": "Nielsen Norman Group UX Master Certified", "year": "2022"}],
            profile_completion=85,
            resume_url="/uploads/resumes/maya_chen_portfolio.pdf",
            resume_filename="maya_chen_portfolio.pdf"
        )

        prof_liam = ApplicantProfile(
            user_id=applicant_liam.id,
            headline="Machine Learning & Data Engineer | PyTorch, NLP & High-Scale Data Pipelines",
            bio="Data scientist and machine learning practitioner with a background in applied NLP, feature engineering, and deploying inference engines on Kubernetes clusters.",
            location="Austin, TX (Remote)",
            preferred_employment_type="Full-time",
            preferred_location="Remote",
            expected_salary="$145,000 - $170,000",
            skills=["Python", "PyTorch", "SQL", "Pandas", "Scikit-Learn", "FastAPI", "Docker", "AWS", "Airflow"],
            experience=[
                {
                    "company": "Cognitive Insights AI",
                    "role": "Machine Learning Engineer",
                    "period": "2021 - Present",
                    "description": "Trained semantic search embedding models and productionized low-latency vector index retrieval with 99.9% uptime."
                }
            ],
            education=[
                {
                    "institution": "University of Texas at Austin",
                    "degree": "M.S. in Data Science",
                    "year": "2021"
                }
            ],
            projects=[],
            certifications=[],
            profile_completion=80,
            resume_url="/uploads/resumes/liam_oconnor_cv.pdf",
            resume_filename="liam_oconnor_cv.pdf"
        )
        db.add_all([prof_alex, prof_maya, prof_liam])
        db.flush()

        print("Seeding Realistic Jobs...")
        job1 = Job(
            recruiter_id=recruiter_sarah.id,
            company_id=comp_techpulse.id,
            title="Senior Full Stack Engineer",
            department="Platform Core",
            category="Engineering",
            location="San Francisco, CA",
            work_arrangement="Remote",
            employment_type="Full-time",
            experience_level="Senior",
            min_salary=140000,
            max_salary=175000,
            currency="USD",
            description="We are seeking an experienced Senior Full Stack Engineer to spearhead our next-generation platform services. You will collaborate closely with product management and designers to architect high-performance, fault-tolerant web applications. Our stack leverages React, TypeScript, FastAPI, PostgreSQL, and AWS.",
            responsibilities=[
                "Architect and implement customer-facing web applications using React, TypeScript, and modern state management patterns.",
                "Build scalable REST APIs and asynchronous microservices in Python with FastAPI.",
                "Optimize relational database queries, migrations, and indexing strategies in PostgreSQL.",
                "Collaborate in code reviews, mentor mid-level software engineers, and establish high engineering standards."
            ],
            requirements=[
                "5+ years of production experience in full-stack web development.",
                "Proficiency in React, TypeScript, and modern CSS tooling.",
                "Strong backend proficiency in Python (FastAPI/Django) and relational databases (PostgreSQL/MySQL).",
                "Familiarity with containerization (Docker) and CI/CD automated deployment pipelines."
            ],
            skills_required=["React", "TypeScript", "Python", "FastAPI", "PostgreSQL"],
            skills_preferred=["Docker", "Redis", "AWS", "Tailwind CSS"],
            status="published",
            deadline=utc_now() + timedelta(days=30),
            views_count=184,
            created_at=utc_now() - timedelta(days=5)
        )

        job2 = Job(
            recruiter_id=recruiter_sarah.id,
            company_id=comp_techpulse.id,
            title="Lead Product Designer",
            department="Product Experience",
            category="Design",
            location="San Francisco, CA",
            work_arrangement="Hybrid",
            employment_type="Full-time",
            experience_level="Lead",
            min_salary=135000,
            max_salary=165000,
            currency="USD",
            description="TechPulse is looking for a Lead Product Designer to unify our enterprise product suite. You will define the UX roadmap, evolve our Figma design system tokens, and lead qualitative research sessions with executive users.",
            responsibilities=[
                "Drive end-to-end UX architecture for complex enterprise workflows and data-dense dashboards.",
                "Maintain and scale our comprehensive multi-brand Figma design system.",
                "Conduct user interviews, usability testing, and synthesize quantitative analytics into product improvements.",
                "Partner with engineering leads to ensure faithful pixel-level implementation."
            ],
            requirements=[
                "6+ years designing B2B SaaS or enterprise software products.",
                "Expert mastery of Figma, interactive prototyping, and component token libraries.",
                "Strong portfolio showcasing user-centered methodologies and data visualization work.",
                "Excellent cross-functional communication and presentation skills."
            ],
            skills_required=["Figma", "Design Systems", "UI/UX", "User Research"],
            skills_preferred=["Prototyping", "Information Architecture", "Wireframing"],
            status="published",
            deadline=utc_now() + timedelta(days=25),
            views_count=142,
            created_at=utc_now() - timedelta(days=7)
        )

        job3 = Job(
            recruiter_id=recruiter_david.id,
            company_id=comp_greenwave.id,
            title="Senior Frontend Developer",
            department="Client Engineering",
            category="Engineering",
            location="Chicago, IL",
            work_arrangement="Hybrid",
            employment_type="Full-time",
            experience_level="Senior",
            min_salary=120000,
            max_salary=145000,
            currency="USD",
            description="GreenWave Logistics is modernizing commercial freight management. We are hiring a Senior Frontend Developer to engineer our mission-critical dispatch console, live telemetry maps, and driver route optimizer.",
            responsibilities=[
                "Develop responsive, real-time client applications using React, TypeScript, and WebSocket integrations.",
                "Craft accessible, high-performance UI components with Tailwind CSS.",
                "Participate in sprint planning and collaborate closely with product and operations teams."
            ],
            requirements=[
                "4+ years of professional frontend engineering experience with React and modern JavaScript.",
                "In-depth knowledge of web performance profiling and responsive layout paradigms.",
                "Solid understanding of RESTful API consumption and state caching."
            ],
            skills_required=["React", "TypeScript", "Tailwind CSS", "JavaScript"],
            skills_preferred=["WebSocket", "RESTful APIs", "Jest", "Git"],
            status="published",
            deadline=utc_now() + timedelta(days=18),
            views_count=98,
            created_at=utc_now() - timedelta(days=3)
        )

        job4 = Job(
            recruiter_id=recruiter_sarah.id,
            company_id=comp_techpulse.id,
            title="Machine Learning Engineer",
            department="AI Research & Labs",
            category="AI & Data Science",
            location="San Francisco, CA",
            work_arrangement="Remote",
            employment_type="Full-time",
            experience_level="Mid-level",
            min_salary=145000,
            max_salary=180000,
            currency="USD",
            description="Join our AI Labs team to build semantic search, candidate skill extraction, and conversational workflows. You will train PyTorch models, fine-tune open weights, and build low-latency inference services.",
            responsibilities=[
                "Train, fine-tune, and evaluate transformer models for domain-specific classification and search.",
                "Build scalable model inference endpoints using Python and FastAPI.",
                "Curate training datasets, establish benchmarking metrics, and monitor drift in production."
            ],
            requirements=[
                "3+ years building and deploying machine learning pipelines in production.",
                "Proficiency in Python, PyTorch, Scikit-Learn, and SQL.",
                "Experience containerizing ML services and deploying with Docker/Kubernetes."
            ],
            skills_required=["Python", "PyTorch", "SQL", "Scikit-Learn"],
            skills_preferred=["FastAPI", "Docker", "Pandas", "AWS"],
            status="published",
            deadline=utc_now() + timedelta(days=28),
            views_count=134,
            created_at=utc_now() - timedelta(days=4)
        )

        job5 = Job(
            recruiter_id=recruiter_elena.id,
            company_id=comp_apex.id,
            title="Product Manager - Settlement Core",
            department="Core Fintech",
            category="Product",
            location="New York, NY",
            work_arrangement="On-site",
            employment_type="Full-time",
            experience_level="Mid-level",
            min_salary=135000,
            max_salary=160000,
            currency="USD",
            description="Apex Financial is looking for a technical Product Manager to lead our real-time gross settlement clearing platform. You will translate banking regulatory mandates into precise technical roadmaps.",
            responsibilities=[
                "Define platform product strategy, write detailed PRDs, and maintain sprint backlog.",
                "Collaborate with compliance, engineering, and enterprise banking partners.",
                "Establish KPI dashboards tracking transaction latency and settlement reliability."
            ],
            requirements=[
                "4+ years of product management experience within fintech, banking, or enterprise SaaS.",
                "Strong analytical mindset and ability to communicate technical requirements with engineers."
            ],
            skills_required=["Product Management", "Roadmapping", "SQL", "Agile"],
            skills_preferred=["Fintech", "Compliance", "API Design"],
            status="published",
            deadline=utc_now() + timedelta(days=22),
            views_count=79,
            created_at=utc_now() - timedelta(days=6)
        )

        job6 = Job(
            recruiter_id=recruiter_sarah.id,
            company_id=comp_cloudforge.id,
            title="DevOps & Platform Architect",
            department="Infrastructure",
            category="DevOps",
            location="Austin, TX",
            work_arrangement="Remote",
            employment_type="Full-time",
            experience_level="Senior",
            min_salary=145000,
            max_salary=175000,
            currency="USD",
            description="Design resilient cloud infrastructure on AWS and Kubernetes for fast-growing SaaS startups. You will automate deployments with Terraform and ensure 99.99% service availability.",
            responsibilities=[
                "Manage Kubernetes clusters and GitOps continuous delivery pipelines.",
                "Automate multi-region cloud infrastructure using Terraform.",
                "Implement proactive observability with Prometheus, Grafana, and OpenTelemetry."
            ],
            requirements=[
                "5+ years supporting production cloud infrastructure in AWS or GCP.",
                "Deep experience with Docker, Kubernetes, Terraform, and Linux administration."
            ],
            skills_required=["Docker", "Kubernetes", "AWS", "Terraform", "CI/CD"],
            skills_preferred=["Python", "Prometheus", "GitOps"],
            status="published",
            deadline=utc_now() + timedelta(days=35),
            views_count=112,
            created_at=utc_now() - timedelta(days=2)
        )

        # Flagged job for Admin moderation testing
        job_flagged = Job(
            recruiter_id=recruiter_david.id,
            company_id=comp_greenwave.id,
            title="Fast Data Entry Assistant - Guaranteed Daily Payout",
            department="Operations",
            category="Operations",
            location="Remote",
            work_arrangement="Remote",
            employment_type="Part-time",
            experience_level="Entry-level",
            min_salary=30000,
            max_salary=50000,
            currency="USD",
            description="Simple data entry tasks with quick daily cash payout. Work from home with flexible hours. Applicants must provide payment processing account details.",
            responsibilities=["Copy and paste text rows into spreadsheet."],
            requirements=["Computer and internet."],
            skills_required=["Data Entry"],
            skills_preferred=[],
            status="published",
            deadline=utc_now() + timedelta(days=10),
            views_count=45,
            created_at=utc_now() - timedelta(days=1)
        )

        db.add_all([job1, job2, job3, job4, job5, job6, job_flagged])
        db.flush()

        print("Seeding Applications...")
        # 1. Alex applied to Job 1 (Senior Full Stack Engineer)
        app1 = Application(
            job_id=job1.id,
            applicant_id=applicant_alex.id,
            status="shortlisted",
            resume_url=prof_alex.resume_url,
            cover_letter="I am very excited about the Senior Full Stack Engineer role at TechPulse Innovations. Having architected high-throughput services with React, TypeScript, and FastAPI for the past 6 years, my background aligns closely with your technical roadmap.",
            ai_match_score=94.5,
            ai_match_details={
                "match_score": 94.5,
                "rating_category": "High Match",
                "matching_skills": ["React", "TypeScript", "Python", "FastAPI", "PostgreSQL", "Docker", "Tailwind CSS"],
                "missing_required_skills": [],
                "missing_preferred_skills": ["AWS"],
                "explanation": "Candidate demonstrates complete alignment across all core stack technologies with substantial relevant experience.",
                "suggested_next_steps": ["Review system design case studies", "Discuss Docker deployment optimizations"],
                "provider": "deterministic (Rule-Based Engine)"
            },
            created_at=utc_now() - timedelta(days=4)
        )

        # 2. Alex applied to Job 3 (Senior Frontend Developer) - has scheduled interview
        app2 = Application(
            job_id=job3.id,
            applicant_id=applicant_alex.id,
            status="interview_scheduled",
            resume_url=prof_alex.resume_url,
            cover_letter="My deep experience with React and Tailwind CSS makes me eager to contribute to GreenWave's high-efficiency dispatch console.",
            ai_match_score=88.0,
            ai_match_details={
                "match_score": 88.0,
                "rating_category": "Strong Candidate",
                "matching_skills": ["React", "TypeScript", "Tailwind CSS", "Git"],
                "missing_required_skills": [],
                "missing_preferred_skills": ["WebSocket"],
                "explanation": "Candidate satisfies primary frontend requirements with comprehensive modern UI experience.",
                "suggested_next_steps": ["Prepare React state management walkthrough"],
                "provider": "deterministic (Rule-Based Engine)"
            },
            created_at=utc_now() - timedelta(days=3)
        )

        # 3. Maya applied to Job 2 (Lead Product Designer)
        app3 = Application(
            job_id=job2.id,
            applicant_id=applicant_maya.id,
            status="under_review",
            resume_url=prof_maya.resume_url,
            cover_letter="I have spent 7 years leading design systems and enterprise UX workflows. I would love to shape the user experience vision for TechPulse.",
            ai_match_score=92.0,
            ai_match_details={
                "match_score": 92.0,
                "rating_category": "High Match",
                "matching_skills": ["Figma", "Design Systems", "UI/UX", "User Research", "Prototyping", "Information Architecture"],
                "missing_required_skills": [],
                "missing_preferred_skills": [],
                "explanation": "Outstanding alignment with design system stewardship and enterprise usability research.",
                "suggested_next_steps": ["Portfolio case study review"],
                "provider": "deterministic (Rule-Based Engine)"
            },
            created_at=utc_now() - timedelta(days=2)
        )

        # 4. Liam applied to Job 4 (Machine Learning Engineer)
        app4 = Application(
            job_id=job4.id,
            applicant_id=applicant_liam.id,
            status="applied",
            resume_url=prof_liam.resume_url,
            cover_letter="Excited to apply my PyTorch modeling and inference pipeline experience to TechPulse's AI research.",
            ai_match_score=85.0,
            ai_match_details={
                "match_score": 85.0,
                "rating_category": "Strong Candidate",
                "matching_skills": ["Python", "PyTorch", "SQL", "Scikit-Learn", "FastAPI", "Docker", "Pandas"],
                "missing_required_skills": [],
                "missing_preferred_skills": ["AWS"],
                "explanation": "Strong foundation in transformer modeling and vector search architectures.",
                "suggested_next_steps": ["Review distributed training tradeoffs"],
                "provider": "deterministic (Rule-Based Engine)"
            },
            created_at=utc_now() - timedelta(days=1)
        )

        db.add_all([app1, app2, app3, app4])
        db.flush()

        print("Seeding Timelines...")
        t1_1 = ApplicationTimeline(application_id=app1.id, status="applied", notes="Application submitted by candidate.", changed_by_user_id=applicant_alex.id, created_at=utc_now() - timedelta(days=4))
        t1_2 = ApplicationTimeline(application_id=app1.id, status="under_review", notes="Candidate resume sent to engineering hiring manager.", changed_by_user_id=recruiter_sarah.id, created_at=utc_now() - timedelta(days=3))
        t1_3 = ApplicationTimeline(application_id=app1.id, status="shortlisted", notes="Selected for initial technical conversation.", changed_by_user_id=recruiter_sarah.id, created_at=utc_now() - timedelta(days=2))

        t2_1 = ApplicationTimeline(application_id=app2.id, status="applied", notes="Application submitted.", changed_by_user_id=applicant_alex.id, created_at=utc_now() - timedelta(days=3))
        t2_2 = ApplicationTimeline(application_id=app2.id, status="interview_scheduled", notes="Technical panel interview scheduled with lead engineer.", changed_by_user_id=recruiter_david.id, created_at=utc_now() - timedelta(days=1))

        t3_1 = ApplicationTimeline(application_id=app3.id, status="applied", notes="Application submitted.", changed_by_user_id=applicant_maya.id, created_at=utc_now() - timedelta(days=2))
        t3_2 = ApplicationTimeline(application_id=app3.id, status="under_review", notes="Portfolio link under review by VP Product.", changed_by_user_id=recruiter_sarah.id, created_at=utc_now() - timedelta(days=1))

        t4_1 = ApplicationTimeline(application_id=app4.id, status="applied", notes="Application submitted.", changed_by_user_id=applicant_liam.id, created_at=utc_now() - timedelta(days=1))

        db.add_all([t1_1, t1_2, t1_3, t2_1, t2_2, t3_1, t3_2, t4_1])

        print("Seeding Interviews...")
        # Interview for Alex with David Miller for Senior Frontend Developer
        interview1 = Interview(
            application_id=app2.id,
            job_id=job3.id,
            applicant_id=applicant_alex.id,
            recruiter_id=recruiter_david.id,
            title="Technical Architecture & Frontend Deep Dive",
            interview_date=(utc_now() + timedelta(days=3)).strftime("%Y-%m-%d"),
            start_time="14:00",
            duration_minutes=45,
            timezone="CST",
            mode="online",
            meeting_link="https://meet.google.com/hrc-qjvt-kmp",
            instructions="Please have a code editor ready and be prepared to discuss component modularity and React state management.",
            status="scheduled"
        )
        db.add(interview1)

        print("Seeding Saved Jobs & Alerts...")
        save1 = SavedJob(user_id=applicant_alex.id, job_id=job1.id)
        save2 = SavedJob(user_id=applicant_alex.id, job_id=job6.id)
        db.add_all([save1, save2])

        alert1 = JobAlert(
            user_id=applicant_alex.id,
            title="Full Stack Remote Roles",
            keywords="React Python FastAPI",
            location="Remote",
            category="Engineering",
            job_type="Full-time",
            frequency="weekly",
            is_active=True
        )
        db.add(alert1)

        print("Seeding Notifications...")
        notif1 = Notification(
            user_id=applicant_alex.id,
            title="Interview Scheduled",
            message="David Miller scheduled an interview for 'Senior Frontend Developer' on " + (utc_now() + timedelta(days=3)).strftime("%Y-%m-%d") + " at 14:00 CST.",
            type="interview",
            link="/applicant/interviews",
            is_read=False,
            created_at=utc_now() - timedelta(hours=4)
        )
        notif2 = Notification(
            user_id=applicant_alex.id,
            title="Application Shortlisted",
            message="Your application for 'Senior Full Stack Engineer' at TechPulse Innovations was shortlisted!",
            type="application",
            link="/applicant/applications",
            is_read=True,
            created_at=utc_now() - timedelta(days=2)
        )
        notif_recruiter = Notification(
            user_id=recruiter_sarah.id,
            title="New High-Match Application",
            message="Alex Rivera (94.5% Match) applied for 'Senior Full Stack Engineer'",
            type="application",
            link="/recruiter/applicants",
            is_read=False,
            created_at=utc_now() - timedelta(days=4)
        )
        db.add_all([notif1, notif2, notif_recruiter])

        print("Seeding Admin Moderation & Verification Demo Data...")
        # Moderation report against flagged job
        report1 = UserReport(
            reporter_id=applicant_alex.id,
            reported_job_id=job_flagged.id,
            reason="suspicious_listing",
            details="Listing promises daily cash payouts and requests financial account details upfront. Suspicious activity.",
            status="pending",
            created_at=utc_now() - timedelta(hours=12)
        )
        db.add(report1)

        # Company verification request from Lumina Health Tech
        v_req1 = CompanyVerificationRequest(
            company_id=comp_lumina.id,
            requester_id=recruiter_sarah.id,
            business_registration_no="MA-CORP-2024-881923",
            official_website="https://luminahealth.org",
            status="pending",
            created_at=utc_now() - timedelta(days=1)
        )
        db.add(v_req1)

        # Feedback items
        fb1 = PlatformFeedback(
            user_id=applicant_alex.id,
            user_name=applicant_alex.full_name,
            category="platform_usability",
            message="The Skill Gap Analyzer gave me very clear guidance on what to learn next. Clean and fast UI!",
            rating=5,
            created_at=utc_now() - timedelta(days=1)
        )
        fb2 = PlatformFeedback(
            user_id=recruiter_sarah.id,
            user_name=recruiter_sarah.full_name,
            category="recruiter_tools",
            message="The Kanban pipeline drag and candidate filtering makes applicant triage significantly smoother.",
            rating=5,
            created_at=utc_now() - timedelta(hours=6)
        )
        db.add_all([fb1, fb2])

        # Audit logs
        log1 = AuditLog(
            user_id=admin.id,
            user_email=admin.email,
            action="SYSTEM_INITIALIZED",
            resource_type="System",
            resource_id="0",
            details="HireNest relational database initialized with production seed data.",
            ip_address="127.0.0.1",
            created_at=utc_now() - timedelta(days=1)
        )
        log2 = AuditLog(
            user_id=recruiter_sarah.id,
            user_email=recruiter_sarah.email,
            action="JOB_POSTED",
            resource_type="Job",
            resource_id=str(job1.id),
            details="Sarah Jenkins posted Senior Full Stack Engineer vacancy.",
            ip_address="192.168.1.10",
            created_at=utc_now() - timedelta(days=5)
        )
        db.add_all([log1, log2])

        db.commit()
        print("Database seeded successfully with all roles, jobs, applications, and moderation items!")

    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    seed()
