import { handleUpload } from '@vercel/blob/client';
import { isAdminRequest, isSameOriginRequest, sendJson } from '../../server/admin.js';

const allowedByKind = {
  image: ['image/jpeg', 'image/png', 'image/webp', 'image/avif'],
  video: ['video/mp4', 'video/webm', 'video/quicktime'],
  audio: ['audio/mpeg', 'audio/mp4', 'audio/aac', 'audio/wav', 'audio/ogg', 'audio/webm'],
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return sendJson(res, 405, { error: 'Method not allowed.' });
  }
  if (!process.env.MEDIA_BLOB_READ_WRITE_TOKEN) {
    return sendJson(res, 503, { error: 'Connect a public Vercel Blob media store and set MEDIA_BLOB_READ_WRITE_TOKEN.' });
  }
  try {
    const result = await handleUpload({
      token: process.env.MEDIA_BLOB_READ_WRITE_TOKEN,
      body: req.body,
      request: req,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        if (!isAdminRequest(req)) throw new Error('Admin sign-in required.');
        if (!isSameOriginRequest(req)) throw new Error('Upload origin is not allowed.');
        if (!pathname.startsWith('nimantran-media/')) throw new Error('Invalid upload path.');
        let payload = {};
        try { payload = JSON.parse(clientPayload || '{}'); } catch { throw new Error('Invalid upload details.'); }
        if (!['image', 'video', 'audio'].includes(payload.kind)) throw new Error('Unsupported media type.');
        return {
          allowedContentTypes: allowedByKind[payload.kind],
          addRandomSuffix: true,
          maximumSizeInBytes: 250 * 1024 * 1024,
          tokenPayload: JSON.stringify({ kind: payload.kind }),
        };
      },
      onUploadCompleted: async () => {},
    });
    return sendJson(res, 200, result);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Upload authorization failed.';
    const status = /sign-in|origin|unauthorized/i.test(message) ? 401 : 400;
    return sendJson(res, status, { error: message });
  }
}

