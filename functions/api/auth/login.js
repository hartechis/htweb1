// functions/api/auth/login.js
export async function onRequestPost(context) {
    const { request, env } = context;

    // 統一回傳格式的輔助函式
    const jsonResponse = (data, status = 200) => {
        return new Response(JSON.stringify(data), {
            status,
            headers: { 
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*" 
            }
        });
    };

    try {
        // 1. 解析請求
        const body = await request.json();
        const { employee_id, password } = body;

        // 2. 資料庫查詢
        const user = await env.DB.prepare("SELECT * FROM employees WHERE employee_id = ?")
            .bind(employee_id)
            .first();

        // 3. 檢查帳號是否存在
        if (!user) {
            return jsonResponse({ error: "員工帳號不存在" }, 401);
        }

        // 4. 首次登入檢查
        if (Number(user.initial_password_set) === 0) {
            return jsonResponse({ status: "first_login", message: "請設定密碼" });
        }

        // 5. 密碼驗證邏輯
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const inputHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

        if (user.password_hash !== inputHash) {
            return jsonResponse({ error: "密碼錯誤" }, 401);
        }

        // 6. 登入成功：生成 Token 並寫入 sessions 資料庫
        const token = crypto.randomUUID();
        // 設定過期時間為 24 小時後
        const expiresAt = new Date(Date.now() + 86400000).toISOString(); 

        await env.DB.prepare("INSERT INTO sessions (token, employee_id, expires_at) VALUES (?, ?, ?)")
            .bind(token, employee_id, expiresAt)
            .run();

        return jsonResponse({ status: "success", token: token });

    } catch (err) {
        return jsonResponse({ 
            error: "伺服器內部錯誤", 
            details: err.message 
        }, 500);
    }
}

// 處理 CORS 預檢請求
export async function onRequestOptions() {
    return new Response(null, {
        status: 204,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type"
        }
    });
}
