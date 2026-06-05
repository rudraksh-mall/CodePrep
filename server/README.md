# CodePrep AI — Server

## Required Environment Variables

| Variable | Description | Required |
|---|---|---|
| `PORT` | Server port (Render sets this automatically) | Yes |
| `NODE_ENV` | `production` or `development` | Yes |
| `MONGODB_URI` | MongoDB Atlas connection string | Yes |
| `JWT_SECRET` | Secret key for signing JWT tokens | Yes |
| `OPENROUTER_API_KEY` | API key for OpenRouter (AI features) | Yes |
| `FRONTEND_URL` | Frontend origin for CORS (e.g., `https://app.onrender.com`) | No* |

*Required in production to allow your frontend domain.

## Render Deployment

### 1. Create a Web Service
- Connect your GitHub repo to Render
- Set **Root Directory** to `server` (if using monorepo)
- Build command: `npm install`
- Start command: `node index.js`

### 2. Set Environment Variables
In the Render Dashboard → Environment Variables, add:

```
NODE_ENV=production
MONGODB_URI=<your-atlas-uri>
JWT_SECRET=<strong-random-string>
OPENROUTER_API_KEY=<your-key>
FRONTEND_URL=https://<your-frontend>.onrender.com
```

`PORT` is set automatically by Render — do not override it.

### 3. Verify
- `render.yaml` is provided for infrastructure-as-code setup
- `npm start` runs `node index.js` (no nodemon dependency)
- CORS rejects requests from unknown origins in production

## Local Development

```bash
cp .env.example .env
# fill in your values
npm install --legacy-peer-deps
npm run dev
```
