// functions/api/chat.js (修正版)
export async function onRequest(context) {
    const { request, env } = context;
    const url = new URL(request.url);
    const room = url.searchParams.get('rm') || 'default'; // 取得房間參數

    // 處理檔案上傳
    if (request.method === "POST" && url.pathname.includes("/upload")) {
        const contentType = request.headers.get("Content-Type") || "application/octet-stream";
        const originalName = decodeURIComponent(request.headers.get("X-Filename") || "file");
        const extension = originalName.split('.').pop() || "bin";
        
        // 將檔案存入獨立的房間資料夾
        const storedFilename = `chat01/${room}/${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${extension}`;
        
        await env.BUCKET.put(storedFilename, await request.arrayBuffer(), {
            httpMetadata: { contentType: contentType },
            customMetadata: { originalName: originalName }
        });
        return new Response(JSON.stringify({ url: `/api/media/${storedFilename}`, name: originalName }), { status: 200 });
    }

    return new Response("Method not allowed", { status: 405 });
}
