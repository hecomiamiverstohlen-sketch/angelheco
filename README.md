# angelheco

A romantic anniversary & memory bank web application with Supabase integration.

## Environment Setup

### 1. Configuration Files
The application supports environment variables via `.env` (for server/local configuration) and `env.js` (for direct client-side configuration).

- Copy `.env.example` to `.env`:
  ```bash
  cp .env.example .env
  ```
- Configure your Supabase credentials in `.env`:
  ```env
  SUPABASE_URL=https://your-project-ref.supabase.co
  SUPABASE_ANON_KEY=your-supabase-anon-key
  STORAGE_BUCKET=memories
  PORT=8000
  ```

### 2. Running Locally with Python Virtual Environment

A Python virtual environment (`.venv`) is set up for running the local development server:

#### Windows:
```powershell
# Activate the virtual environment
.\.venv\Scripts\Activate.ps1

# Start the dev server
python server.py
```

The server will automatically load variables from `.env` and serve the application at:
```
http://localhost:8000
```
