# BFL Flux 2 Wrapper (Prototype)

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env.local`:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and fill in:

- `BFL_API_KEY`
- `BFL_API_BASE_URL`
- `BLOB_READ_WRITE_TOKEN`

3. Run locally:

```bash
npm run dev
```

Open http://localhost:3000

## Deploy to Vercel

- Ensure the same env vars are set in Vercel Project Settings.
- Deploy using the Vercel CLI or Git integration.

## Notes

- Update `AD_PROMPT` in `lib/bflClient.ts` with your existing prompt.
- `{{PRODUCT_IMAGE_URL}}`, `{{LOGO_IMAGE_URL}}`, and `{{REFERENCE_IMAGE_URL}}` placeholders are replaced at runtime.
- The BFL field names are abstracted in `lib/bflClient.ts` and marked with TODOs to confirm exact API contract.
- Generated image URLs from BFL are short-lived and do not support CORS; the API route re-hosts them in Vercel Blob before returning to the client.
