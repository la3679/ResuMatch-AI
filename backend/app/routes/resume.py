from fastapi import APIRouter, UploadFile, File, HTTPException
import fitz  # PyMuPDF
from docx import Document
import io

router = APIRouter()

@router.post("/upload")
async def upload_resume(file: UploadFile = File(...)):
    extension = file.filename.split(".")[-1].lower()
    content = await file.read()
    
    text = ""
    try:
        if extension == "pdf":
            doc = fitz.open(stream=content, filetype="pdf")
            for page in doc:
                text += page.get_text()
        elif extension == "docx":
            doc = Document(io.BytesIO(content))
            for para in doc.paragraphs:
                text += para.text + "\n"
        else:
            raise HTTPException(status_code=400, detail="Unsupported file format. Please upload PDF or DOCX.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error extracting text: {str(e)}")

    if not text.strip():
        raise HTTPException(status_code=400, detail="Resume appears to be empty or unreadable.")

    return {"text": text, "filename": file.filename}
