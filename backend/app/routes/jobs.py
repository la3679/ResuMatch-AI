from fastapi import APIRouter
from pydantic import BaseModel
from typing import List

router = APIRouter()

class Job(BaseModel):
    id: int
    title: str
    company: str
    skills: List[str]
    description: str

# Mock data
MOCK_JOBS = [
    {"id": 1, "title": "Frontend Developer", "company": "TechCorp", "skills": ["React", "TypeScript", "Tailwind CSS", "Next.js"], "description": "Building modern web applications with React."},
    {"id": 2, "title": "Backend Developer", "company": "DataSystems", "skills": ["Python", "FastAPI", "PostgreSQL", "Docker"], "description": "Designing scalable APIs and microservices."},
    {"id": 3, "title": "Full Stack Engineer", "company": "CloudNine", "skills": ["React", "Node.js", "MongoDB", "AWS"], "description": "End-to-end development of cloud-native apps."},
    {"id": 4, "title": "Data Analyst", "company": "InsightCo", "skills": ["Python", "SQL", "Pandas", "Tableau"], "description": "Extracting insights from complex datasets."},
    {"id": 5, "title": "ML Engineer", "company": "AI Labs", "skills": ["Python", "PyTorch", "Scikit-learn", "NLP"], "description": "Developing and deploying machine learning models."},
    {"id": 6, "title": "DevOps Engineer", "company": "OpsWorks", "skills": ["Kubernetes", "Terraform", "CI/CD", "Linux"], "description": "Automating infrastructure and deployments."},
    {"id": 7, "title": "UI/UX Designer", "company": "CreativeFlow", "skills": ["Figma", "Adobe XD", "Prototyping", "User Research"], "description": "Designing intuitive user experiences."},
    {"id": 8, "title": "Mobile Developer", "company": "AppGenius", "skills": ["React Native", "Swift", "Kotlin", "Firebase"], "description": "Building cross-platform mobile apps."},
    {"id": 9, "title": "Security Analyst", "company": "SecureNet", "skills": ["Cybersecurity", "Penetration Testing", "Network Security"], "description": "Protecting systems from cyber threats."},
    {"id": 10, "title": "Product Manager", "company": "StrategyHub", "skills": ["Agile", "Roadmapping", "Stakeholder Management", "Jira"], "description": "Leading product development lifecycle."}
]

class MatchRequest(BaseModel):
    resume_skills: List[str]

@router.post("/match")
async def match_jobs(request: MatchRequest):
    resume_skills = [s.lower() for s in request.resume_skills]
    matches = []
    
    for job in MOCK_JOBS:
        job_skills = [s.lower() for s in job["skills"]]
        common_skills = set(resume_skills).intersection(set(job_skills))
        missing_skills = [s for s in job["skills"] if s.lower() not in resume_skills]
        
        match_percentage = (len(common_skills) / len(job_skills)) * 100 if job_skills else 0
        
        matches.append({
            "job": job,
            "match_percentage": round(match_percentage, 1),
            "missing_skills": missing_skills
        })
    
    # Sort by match percentage descending
    matches.sort(key=lambda x: x["match_percentage"], reverse=True)
    
    return matches[:5]
