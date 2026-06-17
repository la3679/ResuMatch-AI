/** Response from `POST /api/v1/resume/upload`. */
export interface UploadResult {
  filename: string;
  text: string;
  characters: number;
}

/** Response from `POST /api/v1/cover-letter/generate`. */
export interface CoverLetterResult {
  coverLetter: string;
}

/** Shape of an error response body returned by the API. */
export interface ApiErrorBody {
  error: string;
}

/** Response from `GET /api/v1/health`. */
export interface HealthResponse {
  status: string;
  timestamp: string;
  service: string;
}
