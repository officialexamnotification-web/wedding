# Nimantran Admin Studio setup

The private admin page is available at `/admin` after deployment. It is not linked from the public site, is excluded from the sitemap, and sends `noindex` headers. The API checks the login on the server and uses a signed, HTTP-only session cookie. Do not prefix any secret with `VITE_`.

## Vercel environment variables

Add these in **Vercel → Project → Settings → Environment Variables**, for Production and Preview as appropriate:

| Variable | Value |
| --- | --- |
| `ADMIN_USERNAME` | Your private admin username |
| `ADMIN_PASSWORD` | A long unique password |
| `ADMIN_SESSION_SECRET` | Random secret, at least 32 characters |
| `BLOB_READ_WRITE_TOKEN` | Token created for a **private** Vercel Blob store (template catalog) |
| `MEDIA_BLOB_READ_WRITE_TOKEN` | Token created for a separate **public** Vercel Blob store (published media) |

Create two Blob stores in the Vercel project. Keep the catalog store private. Create the media store as public and set its environment variable prefix to `MEDIA_BLOB`, which makes Vercel create `MEDIA_BLOB_READ_WRITE_TOKEN`. Vercel Blob tokens stay on the server; browser uploads receive short-lived, restricted upload tokens only after admin authentication. The media files are public because published invitations need to load them for every visitor.

After adding or changing variables, redeploy the Vercel project so the serverless functions receive them. No username, password, session secret or Blob token belongs in source control.

To generate a session secret in PowerShell:

```powershell
[Convert]::ToBase64String([Security.Cryptography.RandomNumberGenerator]::GetBytes(48))
```

## What Save does

The admin API saves catalog overrides and new templates in the private Blob store. The public site reads that catalog at startup and merges changes with its bundled templates. Uploaded images, videos and music are saved to the public media Blob store; the template references their CDN URL. A save is shared across visitors after they refresh the site.

The catalog uses a revision check to reject stale saves instead of silently overwriting another admin save. Export/import catalog backups are available in the panel. Large media is uploaded directly from the browser to Vercel Blob, with the server issuing the constrained upload permission.

## Local preview

The Vite dev server does not run Vercel serverless functions. Use `vercel dev` with the same environment variables to exercise the secured admin login, catalog save and media upload locally. Opening `/admin` on a plain Vite server will show that the admin API is unavailable; public editing is not silently stored in browser local storage.

