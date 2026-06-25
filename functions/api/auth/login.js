// functions/api/auth/login.js

async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}

export async function onRequestPost(context) {
    const { request, env } = context;

    try {
        const { employee_id, password } = await request.json();

        // 查詢員工
        const user = await env.DB.prepare("SELECT * FROM employees WHERE employee_id = ?")
            .bind(employee_id)
            .first();

        if (!user) {
            return new Response(JSON.stringify({ error: "員工帳號不存在" }), { 
                status: 401,
                headers: { "Content-Type": "application/json" } 
            });
        }

        // 檢查是否為首次登入
        if (!user.initial_password_set) {
            return new Response(JSON.stringify({ status: "first_login", message: "請設定密碼" }), { 
                status: 200,
                headers: { "Content-Type": "application/json" } 
            });
        }

        // 驗證密碼
        const inputHash = await hashPassword(password);
        if (user.password_hash !== inputHash) {
            return new Response(JSON.stringify({ error: "密碼錯誤" }), { 
                status: 401,
                headers: { "Content-Type": "application/json" } 
            });
        }

        // 生成 Token
        const token = crypto.randomUUID();
        await env.DB.prepare("INSERT INTO sessions (token, employee_id, expires_at) VALUES (?, ?, ?)")
            .bind(token, employee_id, new Date(Date.now() + 86400000).toISOString())
            .run();

        return new Response(JSON.stringify({ token }), { 
            status: 200,
            headers: { "Content-Type": "application/json" } 
        });

    } catch (err) {
        return new Response(JSON.stringify({ error: "伺服器錯誤: " + err.message }), { 
            status: 500,
            headers: { "Content-Type": "application/json" } 
        });
    }
}
