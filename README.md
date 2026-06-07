# Screenshot API

A Vercel serverless API that captures full-page screenshots of any URL using Puppeteer and returns them as base64-encoded PNG images.

## Features

- Captures screenshots of any publicly accessible URL
- Returns base64-encoded PNG images
- CORS support with configurable allowed origins
- Secret-based and origin-based authorization
- Cloudflare / bot-protection detection
- Blocks unnecessary resource types (media, websockets, SSE) for faster load times

## Endpoints

### `GET /api/screenshots`

Captures a screenshot of the given URL.

**Query Parameters**

| Parameter | Type   | Required | Description              |
|-----------|--------|----------|--------------------------|
| `url`     | string | Yes      | The URL to screenshot    |

**Request Headers**

| Header            | Description                                      |
|-------------------|--------------------------------------------------|
| `x-proxy-secret`  | Optional secret token for server-to-server auth |

**Response**

`200 OK`
```json
{
  "image": "data:image/png;base64,<base64-encoded PNG>"
}
```

**Error Responses**

| Status | Description                                          |
|--------|------------------------------------------------------|
| `400`  | Missing or invalid `url` query parameter             |
| `401`  | Unauthorized — invalid or missing credentials        |
| `403`  | Page is protected by Cloudflare or a similar service |
| `500`  | Internal error (e.g. navigation timeout)             |

## Authorization

Requests are authorized if **any** of the following conditions are met:

- The `x-proxy-secret` header matches the `PROXY_SECRET` environment variable.
- The request `Origin` or `Referer` header matches one of the allowed origins (see [Environment Variables](#environment-variables)).
- The request `Origin` or `Referer` matches the API's own host.

## Environment Variables

| Variable         | Required | Description                                                  |
|------------------|----------|--------------------------------------------------------------|
| `PROXY_SECRET`   | No       | Shared secret for server-to-server authentication            |
| `ALLOWED_ORIGIN` | No       | An additional origin to whitelist (e.g. `https://myapp.com`) |

`http://localhost:3000` and `http://localhost:3001` are always whitelisted for local development.

## CORS

Only `GET` requests and the `x-proxy-secret` header are permitted. The `Access-Control-Allow-Origin` response header is set to the request origin when it matches an allowed origin.

## Project Structure

```
/api
  screenshots.ts          # Main endpoint handler
  utils/
    with_proxy.ts         # Middleware: CORS + authorization wrapper
    cors_headers.ts       # Sets CORS response headers
    authorization.ts      # Authorization logic
    constants.ts          # Shared constants (allowed origins)
```

## Tech Stack

- [Vercel](https://vercel.com) — serverless deployment
- [Puppeteer Core](https://github.com/puppeteer/puppeteer) — browser automation
- [@sparticuz/chromium](https://github.com/Sparticuz/chromium) — Chromium binary optimized for serverless environments

## Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file:
   ```env
   PROXY_SECRET=your_secret_here
   ALLOWED_ORIGIN=https://yourapp.com
   ```

3. Run the Vercel dev server:
   ```bash
   npx vercel dev
   ```

4. Test the endpoint:
   ```
   GET http://localhost:3000/api/screenshots?url=https://example.com
   ```

## Deployment

```bash
npx vercel deploy
```

Make sure to configure the environment variables (`PROXY_SECRET`, `ALLOWED_ORIGIN`) in your Vercel project settings.