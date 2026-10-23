# Nimantran Admin Studio setup

The private admin page is available at `/admin` after deployment. It is not linked from the public site, is excluded from the sitemap, and sends `noindex` headers. The API checks the login on the server and uses a signed, HTTP-only session cookie. Do not prefix any secret with `VITE_`.

## Vercel environment variables

Add these in **Vercel → Project → Settings → Environment Variables**, for Production and Preview as appropriate:

| Variable | Value |
| --- | --- |
| `ADMIN_USERNAME` | Your private admin username |
| `ADMIN_PASSWORD` | A long unique password |
| `ADMIN_SESSION_SECRET` | Random secret, at least 32 characters |

Connect two Blob stores to the `wedding` project in Vercel Storage: a private store with the default `BLOB` prefix for the template catalog, and a public store with the `MEDIA_BLOB` prefix for uploaded media. Vercel injects the store IDs into the project environment. The app uses Vercel OIDC and short-lived, path-scoped upload permissions; it does not need a Blob API key or read-write token. Browser uploads are allowed only after admin authentication. Media files are public because published invitations need to load them for every visitor.

After connecting stores or changing environment variables, redeploy the Vercel project so serverless functions receive the store IDs. No username, password, session secret or Blob token belongs in source control.

To generate a session secret in PowerShell:

```powershell
[Convert]::ToBase64String([Security.Cryptography.RandomNumberGenerator]::GetBytes(48))
```

## What Save does

The admin API saves catalog overrides and new templates in the private Blob store. The public site reads that catalog at startup and merges changes with its bundled templates. Uploaded images, videos and music are saved to the public media Blob store; the template references their CDN URL. A save is shared across visitors after they refresh the site.

The catalog uses a revision check to reject stale saves instead of silently overwriting another admin save. Export/import catalog backups are available in the panel. Large media is uploaded directly from the browser to Vercel Blob, with the server issuing the constrained upload permission.

## Local preview

The Vite dev server does not run Vercel serverless functions. Use `vercel dev` with the same environment variables to exercise the secured admin login, catalog save and media upload locally. Opening `/admin` on a plain Vite server will show that the admin API is unavailable; public editing is not silently stored in browser local storage.

