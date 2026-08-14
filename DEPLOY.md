# Deploy to Vercel

## Vercel settings

- Framework Preset: `Vite`
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`
- Node.js Version: `20.x` or newer

## Environment variables

Add these in Vercel Project Settings > Environment Variables:

```text
VITE_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=your-publishable-or-anon-key
CRON_SECRET=generate-a-long-random-string
```

Use the same values from your local `.env.production`.

## Keep Supabase active

Vercel runs `/api/keepalive` once every day at `06:00 UTC`. The endpoint reads one row from Supabase so Free plan projects have regular database activity.

Set `CRON_SECRET` in Vercel to protect the endpoint. Vercel sends it automatically as a bearer token when the cron runs.

## Upload songs

For bundled audio, put files in `public/songs/` and set the song `audioUrl` to:

```text
/songs/song-name.mp3
```

For Supabase Storage audio, upload to the public `bayna` bucket and set `audioUrl` to the object path.
