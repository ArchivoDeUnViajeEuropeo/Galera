import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('googledrive');
    const authHeader = { Authorization: `Bearer ${accessToken}` };

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

    // Locate the AlbumPDF folder: try root first, then under "Web"
    let albumFolderId = await findFolder('AlbumPDF', null);
    if (!albumFolderId) {
      const webId = await findFolder('Web', null);
      if (webId) albumFolderId = await findFolder('AlbumPDF', webId);
    }

    // List PDF files inside the folder
    const targetName = 'El archivo de un viaje europeo';
    let q = `mimeType='application/pdf' and trashed=false`;
    if (albumFolderId) q += ` and '${albumFolderId}' in parents`;
    const params = new URLSearchParams({
      q,
      fields: 'files(id,name,mimeType)',
      pageSize: '50',
      orderBy: 'createdTime desc',
    });

    const listRes = await fetch(
      `https://www.googleapis.com/drive/v3/files?${params.toString()}`,
      { headers: authHeader }
    );
    if (!listRes.ok) {
      const err = await listRes.text();
      return Response.json({ error: 'Drive API error', details: err }, { status: 502 });
    }
    const listData = await listRes.json();
    const files = listData.files || [];

    // Pick the file whose name matches (ignoring extension / case)
    const file =
      files.find(
        (f) => f.name.replace(/\.pdf$/i, '').trim().toLowerCase() === targetName.trim().toLowerCase()
      ) || files[0];

    if (!file) {
      return Response.json(
        { error: 'PDF no encontrado en la carpeta AlbumPDF' },
        { status: 404 }
      );
    }

    // Download the PDF bytes from Drive
    const dlRes = await fetch(
      `https://www.googleapis.com/drive/v3/files/${file.id}?alt=media`,
      { headers: authHeader }
    );
    if (!dlRes.ok) {
      const err = await dlRes.text();
      return Response.json({ error: 'No se pudo descargar el PDF', details: err }, { status: 502 });
    }

    const arrayBuf = await dlRes.arrayBuffer();
    const bytes = new Uint8Array(arrayBuf);

    // Base64-encode in chunks to avoid call stack overflow
    let binary = '';
    const chunk = 0x8000;
    for (let i = 0; i < bytes.length; i += chunk) {
      binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunk));
    }
    const base64 = btoa(binary);

    return Response.json({
      fileName: file.name.match(/\.pdf$/i) ? file.name : `${file.name}.pdf`,
      mimeType: 'application/pdf',
      base64,
      size: bytes.length,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});