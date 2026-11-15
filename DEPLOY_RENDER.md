# Deploying CrazyPDF to Render

This guide outlines two seamless methods to deploy the **CrazyPDF** FastAPI backend and React Vite frontend to **[Render.com](https://render.com/)**.

---

## Architecture Overview

- **Backend (`backend/`)**: Python 3.11 FastAPI service running via `uvicorn`, with automatic 60-minute file lifecycle cleanup, sub-second PyMuPDF engine, and AES-256 encryption.
- **Frontend (`frontend/`)**: React + Vite + Tailwind CSS single-page application (SPA) with client-side routing and instant processing.

---

## Method 1: Instant Blueprint Deployment (Recommended)

Render provides automatic Blueprint deployment using the included [`render.yaml`](./render.yaml).

### Steps:
1. Log in to your [Render Dashboard](https://dashboard.render.com/).
2. Click **New +** in the top navigation bar and select **Blueprint**.
3. Connect your GitHub repository:
   ```
   https://github.com/221fa19027-ui/crazypdf
   ```
4. Render will automatically detect [`render.yaml`](./render.yaml) and configure:
   - **`crazypdf-backend`** (Python Web Service)
   - **`crazypdf-frontend`** (Static Site with SPA rewrite rules)
5. Click **Apply**. Render will automatically provision, build, and deploy both services!

---

## Method 2: Manual Deployment

If you prefer to configure each service manually in the Render dashboard:

### Step 1: Deploy the Backend (Web Service)

1. In Render Dashboard, click **New +** → **Web Service**.
2. Select your repository: `https://github.com/221fa19027-ui/crazypdf`.
3. Configure the following fields:
   - **Name**: `crazypdf-backend`
   - **Root Directory**: `backend`
   - **Runtime**: `Python`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Instance Type**: `Free`
4. Expand **Environment Variables** and add:
   | Key | Value | Notes |
   |---|---|---|
   | `PYTHON_VERSION` | `3.11.0` | Ensures Python 3.11 runtime |
   | `SECRET_KEY` | *(Click "Generate")* | Random cryptographic secret |
   | `FILE_EXPIRATION_MINUTES` | `60` | Auto-shred lifecycle interval |
   | `TEMP_STORAGE_DIR` | `./tmp_storage` | Ephemeral sandbox folder |
   | `DATABASE_URL` | `sqlite+aiosqlite:///./crazypdf.db` | Async SQLite database |
   | `CORS_ORIGINS` | `*` | Or your frontend render URL |
5. Click **Create Web Service**.
6. Once deployed, copy your backend URL (e.g., `https://crazypdf-backend.onrender.com`).

---

### Step 2: Deploy the Frontend (Static Site)

1. In Render Dashboard, click **New +** → **Static Site**.
2. Select the same repository: `https://github.com/221fa19027-ui/crazypdf`.
3. Configure the following fields:
   - **Name**: `crazypdf-frontend`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
4. Expand **Environment Variables** and add:
   | Key | Value | Notes |
   |---|---|---|
   | `VITE_API_URL` | `https://crazypdf-backend.onrender.com/api/v1` | Replace with your backend URL from Step 1 |
5. Expand **Redirects / Rewrites** and add an SPA routing rule:
   - **Type**: `Rewrite`
   - **Source**: `/*`
   - **Destination**: `/index.html`
   *(This ensures routes like `/tools/compress-pdf` or `/security` load properly on page refresh)*.
6. Click **Create Static Site**.

---

## Verification & Health Check

Once both services show **Live**:

1. Test backend health:
   ```bash
   curl https://crazypdf-backend.onrender.com/health
   # Expected response: {"status": "healthy", "service": "CrazyPDF", ...}
   ```
2. Open your frontend URL:
   ```
   https://crazypdf-frontend.onrender.com
   ```
3. Drop any PDF to test compression, conversion, or merging!

---

## Zero Permanent Storage Lifecycle on Render

- Render free web services provide an ephemeral disk filesystem.
- CrazyPDF stores files only during active processing and automatically shreds all uploaded and processed files after **60 minutes** via an internal async worker.
- Temporary files are stored in `./tmp_storage` within the isolated container.
