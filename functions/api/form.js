//functions/api/form.js
export async function onRequest(context) {
    const { request, env } = context;
    const { method } = request;

    // 定義回應標頭 (處理跨域與 JSON 格式)
    const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Content-Type": "application/json"
    };

    // 處理預檢請求 (OPTIONS)
    if (method === "OPTIONS") {
        return new Response(null, { headers });
    }

    try {
        // 1. 處理 POST：將表單資料寫入 D1
        if (method === "POST") {
            const data = await request.json();
            const { empId, name, meal, qty } = data;

            // 基本驗證
            if (!empId || !name || !meal || !qty) {
                return new Response(JSON.stringify({ error: "資料不完整" }), { status: 400, headers });
            }

            // 寫入 D1 資料庫 (請確認 wrangler.toml 中的 binding 為 "DB")
            const stmt = env.DB.prepare(
                "INSERT INTO orders (empId, name, meal, qty) VALUES (?, ?, ?, ?)"
            );
            await stmt.bind(empId, name, meal, qty).run();

            return new Response(JSON.stringify({ status: "success" }), { status: 200, headers });
        }

        // 2. 處理 GET：從 D1 讀取所有訂單
        if (method === "GET") {
            const { results } = await env.DB.prepare(
                "SELECT * FROM orders ORDER BY created_at DESC"
            ).all();
            
            return new Response(JSON.stringify(results), { status: 200, headers });
        }
    } catch (err) {
        // 錯誤捕捉：若 D1 查詢失敗會進到這裡
        return new Response(JSON.stringify({ error: err.message }), { status: 500, headers });
    }

    return new Response("Method not allowed", { status: 405, headers });
}
