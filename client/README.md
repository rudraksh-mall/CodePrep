# CodePrep AI — Frontend

## Vercel Deployment

### 1. Connect Repository
- Go to [vercel.com](https://vercel.com) and click **Add New → Project**
- Import your GitHub repo (`rudraksh-mall/codePrep`)
- Set **Root Directory** to `client`
- Framework preset: **Vite** (auto-detected)

### 2. Environment Variables
In the Vercel dashboard → Project Settings → Environment Variables, add:

| Variable | Value |
|---|---|
| `VITE_API_URL` | `https://<your-render-api>.onrender.com/api` |

Replace with your actual Render backend URL once deployed.

### 3. Deploy
Click **Deploy**. Vercel will run `npm run build` and publish the `dist/` folder.

### 4. Verify
- SPA routing works on all paths (handled by `vercel.json` rewrites)
- The app connects to the backend API via `VITE_API_URL`
- Refresh on any route returns the correct page, not a 404

## Local Development

```bash
VITE_API_URL=http://localhost:5000/api npm run dev
```
