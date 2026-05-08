from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.routes import resume, jobs

app = FastAPI(title="AI Resume Analyzer API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routes
app.include_router(resume.router, prefix="/resume", tags=["Resume"])
app.include_router(jobs.router, prefix="/jobs", tags=["Jobs"])

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
