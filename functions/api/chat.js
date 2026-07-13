import { verifyToken } from '../utils/auth.js';

export async function onRequest(context) {
    const { request, env } = context;
    
    // --- 新增：強制驗證 ---
    // 呼叫共用驗證邏輯，若未通過直接拒絕
    const user = await verifyToken(request, env);
    if (!user) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), { 
            status: 401,
            headers: { "Content-Type": "application/json" }
        });
    }
    // ----------------------

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
        
        return new Response(JSON.stringify({ url: `/api/media/${storedFilename}`, name: originalName }), { 
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
    }

    // 2. 處理查詢聊天室列表 (GET /api/chat/rooms)
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
