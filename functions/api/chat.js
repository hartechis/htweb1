//functions/api/chat.js

export async function onRequest(context) {
    const { request, env } = context;
    const url = new URL(request.url);

    // 處理檔案上傳
    if (request.method === "POST") {
        const contentType = request.headers.get("Content-Type") || "application/octet-stream";
        const originalName = decodeURIComponent(request.headers.get("X-Filename") || "file");
        const extension = originalName.split('.').pop() || "bin";
        const storedFilename = `chat01/${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${extension}`;
        
        await env.BUCKET.put(storedFilename, await request.arrayBuffer(), {
            httpMetadata: { contentType: contentType },
            customMetadata: { originalName: originalName }
        });
        return new Response(JSON.stringify({ url: `${url.origin}/api/media/${storedFilename}` }), { status: 200 });
    }

    return new Response("Method not allowed", { status: 405 });
}
