import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    const body = await req.json().catch(() => ({}));
    const folderPath = body.folderPath || '';

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('googledrive');
    const authHeader = { Authorization: `Bearer ${accessToken}` };

    // Helper: find a folder by name (optionally within a parent)
    async function findFolder(name, parentId) {
      let q = `name='${name.replace(/'/g, "\\'")}' and mimeType='application/vnd.google-apps.folder' and trashed=false`;
      if (parentId) q += ` and '${parentId}' in parents`;
      const params = new URLSearchParams({ q, fields: 'files(id,name)', pageSize: '1' });
      const res = await fetch(
        `https://www.googleapis.com/drive/v3/files?${params.toString()}`,
        { headers: authHeader }
      );
      if (!res.ok) return null;
      const data = await res.json();
      return data.files?.[0]?.id || null;
    }

    // Traverse folder path to find the target folder ID
    let targetFolderId = null;
    if (folderPath) {
      const parts = folderPath.split('/').filter(Boolean);
      let currentParent = null;
      for (const part of parts) {
        const folderId = await findFolder(part, currentParent);
        if (!folderId) {
          return Response.json({ error: `Folder not found: ${part}`, images: [], total: 0 }, { status: 404 });
        }
        currentParent = folderId;
      }
      targetFolderId = currentParent;
    }

    // List image files within the target folder
    let q = "mimeType contains 'image/' and trashed = false";
    if (targetFolderId) q += ` and '${targetFolderId}' in parents`;

    const params = new URLSearchParams({
      q,
      fields: 'files(id,name,mimeType,thumbnailLink,webContentLink,imageMediaMetadata(width,height),createdTime),nextPageToken',
      pageSize: '200',
      orderBy: 'createdTime desc',
    });

    let allFiles = [];
    let pageToken = null;

    do {
      if (pageToken) params.set('pageToken', pageToken);
      const res = await fetch(
        `https://www.googleapis.com/drive/v3/files?${params.toString()}`,
        { headers: authHeader }
      );
      if (!res.ok) {
        const err = await res.text();
        return Response.json({ error: 'Drive API error', details: err }, { status: 502 });
      }
      const data = await res.json();
      allFiles.push(...(data.files || []));
      pageToken = data.nextPageToken;
    } while (pageToken);

    return Response.json({
      images: allFiles.map((f) => ({
        id: f.id,
        name: f.name,
        thumbnail: f.thumbnailLink,
        viewUrl: `https://drive.google.com/thumbnail?id=${f.id}&sz=w1600`,
        downloadUrl: f.webContentLink,
        width: f.imageMediaMetadata?.width,
        height: f.imageMediaMetadata?.height,
        createdTime: f.createdTime,
      })),
      total: allFiles.length,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});