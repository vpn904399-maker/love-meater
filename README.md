# HeartSync — Love Meter with Discord Webhook (Vercel-Ready)

A romantic, interactive Love Meter built with **Next.js (App Router)**, **TypeScript**, and **Tailwind CSS**. Visitors enter a **Male Name** and **Female Name** to reveal an animated compatibility gauge, 4-pillar breakdown (Chemistry, Trust, Vibe, Destiny), love fortune, and date idea — while a server-side API route formats and sends a clean **Discord Embed** to your Discord webhook.

## Features

- **Lovable Romantic UI**: Soft blush aurora background, floating heart silhouettes, interactive liquid-fill SVG heart gauge, celebratory heart-confetti burst, copy-to-clipboard result sharing, and local recent-matches history.
- **Secure Server-Side Discord Webhook**: `POST /api/love` validates and sanitizes names, disables `@everyone` / `@here` mentions, and delivers a rich structured Discord Embed via `DISCORD_WEBHOOK_URL` so your webhook secret is never exposed in browser code.
- **Vercel Zero-Config Ready**: Standard Next.js App Router project with `/api/love` and `/api/health`.

## 1. Create Your Discord Webhook

1. Open your Discord server and go to **Server Settings** → **Integrations** → **Webhooks** (or click the gear icon on a specific channel → **Integrations** → **Webhooks**).
2. Click **New Webhook**, give it a name (e.g. `Love Meter`), choose the target channel, and click **Copy Webhook URL**.

## 2. Run Locally

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env.local` and paste your webhook URL:
   ```bash
   cp .env.example .env.local
   ```
   ```env
   DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/YOUR_WEBHOOK_ID/YOUR_WEBHOOK_TOKEN
   ```
3. Start the dev server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) and test submitting two names.
   You can also check `http://localhost:3000/api/health` to verify `discordWebhookConfigured: true`.

## 3. Deploy to Vercel

### Option A: Using GitHub + Vercel Dashboard
1. Push this project to a GitHub repository (`.env.local` is ignored by `.gitignore`).
2. Import the repository on [vercel.com/new](https://vercel.com/new).
3. Under **Environment Variables**, add:
   - **Name**: `DISCORD_WEBHOOK_URL`
   - **Value**: your copied Discord webhook URL
4. Click **Deploy**.

### Option B: Using the Vercel CLI
```bash
npm i -g vercel
vercel
vercel env add DISCORD_WEBHOOK_URL
vercel --prod
```

