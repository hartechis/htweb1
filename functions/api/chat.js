//functions/api/chat.js

export async function onRequest(context) {
    const { request, env } = context;
    const url = new URL(request.url);
    const room = url.searchParams.get('rm') || 'default';

    // 1. 處理檔案上傳 (POST /api/chat/upload?rm=...)
    if (request.method === "POST" && url.pathname.includes("/upload")) {
        const contentType = request.headers.get("Content-Type") || "application/octet-stream";
        const originalName = decodeURIComponent(request.headers.get("X-Filename") || "file");
        const extension = originalName.split('.').pop() || "bin";
        
        const storedFilename = `chat01/${room}/${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${extension}`;
        
        await env.BUCKET.put(storedFilename, await request.arrayBuffer(), {
            httpMetadata: { contentType: contentType },
            customMetadata: { originalName: originalName }
        });
        return new Response(JSON.stringify({ url: `/api/media/${storedFilename}`, name: originalName }), { status: 200 });
    }

    // 2. 處理查詢聊天室列表 (GET /api/chat/rooms)
    // 這是給「聊天管理中心」用的
    if (request.method === "GET" && url.pathname.includes("/rooms")) {
        const { results } = await env.DB.prepare(
            "SELECT DISTINCT room FROM chat_messages ORDER BY MAX(created_at) DESC"
        ).all();
        
        return new Response(JSON.stringify(results), { 
            headers: { "Content-Type": "application/json" } 
        });
    }

    return new Response("Method not allowed", { status: 405 });
}
