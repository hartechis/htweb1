async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}

function getCorsHeaders() {
    return { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type, Authorization" };
}

export async function onRequestPost(context) {
    const { request, env } = context;
    
    try {
        const body = await request.json();
        const { employee_id, new_password, old_password, mode } = body;

        // 檢查必要參數
        if (!employee_id || !new_password) {
            return new Response(JSON.stringify({ error: "參數缺失" }), { status: 400, headers: getCorsHeaders() });
        }

        // 1. 如果是重設密碼模式，必須驗證舊密碼
        if (mode === 'reset') {
            const user = await env.DB.prepare("SELECT password_hash FROM employees WHERE employee_id = ?")
                .bind(employee_id)
                .first();
            
            if (!user) {
                return new Response(JSON.stringify({ error: "查無此員工帳號" }), { status: 404, headers: getCorsHeaders() });
            }

            const oldHashed = await hashPassword(old_password);
            if (user.password_hash !== oldHashed) {
                return new Response(JSON.stringify({ error: "舊密碼錯誤" }), { status: 401, headers: getCorsHeaders() });
            }
        }

        // 2. 進行密碼更新
        const newHashed = await hashPassword(new_password);
        
        await env.DB.prepare("UPDATE employees SET password_hash = ?, initial_password_set = 1 WHERE employee_id = ?")
            .bind(newHashed, employee_id)
            .run();
        
        return new Response(JSON.stringify({ status: "success" }), { 
            status: 200, headers: { ...getCorsHeaders(), "Content-Type": "application/json" } 
        });

    } catch (err) {
        // 重要：回傳 err.message，這樣您在前端 msgBox 就能看到具體錯誤
        return new Response(JSON.stringify({ 
            error: "伺服器內部錯誤", 
            details: err.message // 這裡會顯示具體程式錯誤
        }), { 
            status: 500, headers: { ...getCorsHeaders(), "Content-Type": "application/json" } 
        });
    }
}

export async function onRequestOptions() {
    return new Response(null, { status: 204, headers: getCorsHeaders() });
}
