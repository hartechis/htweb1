// functions/api/chat.js (完整邏輯)
export async function onRequest(context) {
    const { request, env } = context;
    const url = new URL(request.url);
    const room = url.searchParams.get('rm') || 'default';
    
    // 假設您在登入後已將 employee_id 存入 Session 或 Header
    const sender_id = request.headers.get("X-Employee-ID"); 

    // 1. 權限檢查
    const user = await env.DB.prepare("SELECT user_type, allowed_room FROM employees WHERE employee_id = ?")
        .bind(sender_id).first();

    if (!user) return new Response("Forbidden", { status: 403 });

    // 若是外部人員，檢查他是否只能進入 allowed_room
    if (user.user_type === 'external' && user.allowed_room !== room) {
        return new Response("Unauthorized Room", { status: 403 });
    }

    // 2. POST 處理訊息發送
    if (request.method === "POST") {
        const { type, content } = await request.json();
        await env.DB.prepare("INSERT INTO chat_messages (room, sender, type, content) VALUES (?, ?, ?, ?)")
            .bind(room, sender_id, type, content).run();
        return new Response(JSON.stringify({ status: "success" }));
    }

    // 3. GET 處理訊息讀取 (自動過濾該房間)
    if (request.method === "GET") {
        const messages = await env.DB.prepare("SELECT * FROM chat_messages WHERE room = ? ORDER BY created_at ASC")
            .bind(room).all();
        return new Response(JSON.stringify(messages.results));
    }
}
