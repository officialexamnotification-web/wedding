import { handleUploadPresigned } from '@vercel/blob/client';
import { issueSignedToken } from '@vercel/blob';
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
  if (!process.env.MEDIA_BLOB_STORE_ID) {
    return sendJson(res, 503, { error: 'Connect the public Vercel Blob media store to this project.' });
  }
  try {
    const result = await handleUploadPresigned({
      body: req.body,
      request: req,
      getSignedToken: async (pathname, clientPayload) => {
        if (!isAdminRequest(req)) throw new Error('Admin sign-in required.');
        if (!isSameOriginRequest(req)) throw new Error('Upload origin is not allowed.');
        if (!pathname.startsWith('nimantran-media/')) throw new Error('Invalid upload path.');
        let payload = {};
        try { payload = JSON.parse(clientPayload || '{}'); } catch { throw new Error('Invalid upload details.'); }
        if (!['image', 'video', 'audio'].includes(payload.kind)) throw new Error('Unsupported media type.');

        const token = await issueSignedToken({
          storeId: process.env.MEDIA_BLOB_STORE_ID,
          pathname,
          operations: ['put'],
          allowedContentTypes: allowedByKind[payload.kind],
          maximumSizeInBytes: 250 * 1024 * 1024,
        });
        return { token, urlOptions: { tokenPayload: JSON.stringify({ kind: payload.kind }) } };
      },
    });
    return sendJson(res, 200, result);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Upload authorization failed.';
    const status = /sign-in|origin|unauthorized/i.test(message) ? 401 : 400;
    return sendJson(res, status, { error: message });
  }
}
