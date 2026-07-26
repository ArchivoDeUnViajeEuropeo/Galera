import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('googledrive');
    const authHeader = { Authorization: `Bearer ${accessToken}` };

    // Accept an optional folderPath (default: Web/03-Participantes)
    const body = await req.json().catch(() => ({}));
    const folderPath = body.folderPath || 'Web/03-Participantes';

    // Helper: find a folder by name within a parent
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

    // Traverse the folder path
    const parts = folderPath.split('/');
    let currentParent = null;
    for (const part of parts) {
      const folderId = await findFolder(part, currentParent);
      if (!folderId) {
        return Response.json({ error: `Folder not found: ${part}`, participants: [] }, { status: 404 });
      }
      currentParent = folderId;
    }
    const targetFolderId = currentParent;

    // List subfolders ordered by name
    const subParams = new URLSearchParams({
      q: `mimeType='application/vnd.google-apps.folder' and trashed=false and '${targetFolderId}' in parents`,
      fields: 'files(id,name)',
      orderBy: 'name',
      pageSize: '100',
    });
    const subRes = await fetch(
      `https://www.googleapis.com/drive/v3/files?${subParams.toString()}`,
      { headers: authHeader }
    );
    if (!subRes.ok) {
      return Response.json({ error: 'Drive API error listing subfolders' }, { status: 502 });
    }
    const subData = await subRes.json();
    const participantFolders = subData.files || [];

    // For each participant folder, list images ordered by name
    const participants = [];
    for (const folder of participantFolders) {
      const imgParams = new URLSearchParams({
        q: `mimeType contains 'image/' and trashed=false and '${folder.id}' in parents`,
        fields: 'files(id,name,imageMediaMetadata(width,height),createdTime)',
        orderBy: 'name',
        pageSize: '50',
      });
      const imgRes = await fetch(
        `https://www.googleapis.com/drive/v3/files?${imgParams.toString()}`,
        { headers: authHeader }
      );
      if (!imgRes.ok) continue;
      const imgData = await imgRes.json();
      const files = imgData.files || [];
      participants.push({
        name: folder.name,
        mainImage: files[0]
          ? {
              id: files[0].id,
              name: files[0].name,
              viewUrl: `https://drive.google.com/thumbnail?id=${files[0].id}&sz=w1600`,
              width: files[0].imageMediaMetadata?.width,
              height: files[0].imageMediaMetadata?.height,
            }
          : null,
        gallery: files.slice(1).map((f) => ({
          id: f.id,
          name: f.name,
          viewUrl: `https://drive.google.com/thumbnail?id=${f.id}&sz=w1600`,
          width: f.imageMediaMetadata?.width,
          height: f.imageMediaMetadata?.height,
        })),
      });
    }

    return Response.json({ participants, total: participants.length });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});