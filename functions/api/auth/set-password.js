async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}

function getCorsHeaders() {
    return { 
        "Access-Control-Allow-Origin": "*", 
        "Access-Control-Allow-Methods": "POST, OPTIONS", 
        "Access-Control-Allow-Headers": "Content-Type" 
    };
}

export async function onRequestPost(context) {
    const { request, env } = context;
    try {
        const { employee_id, new_password, old_password, mode } = await request.json();

        // 檢查密碼是否為 6 位數字
        if (!/^\d{6}$/.test(new_password)) {
            return new Response(JSON.stringify({ error: "密碼必須為6位數字" }), { status: 400, headers: getCorsHeaders() });
        }

        if (mode === 'reset') {
            const user = await env.DB.prepare("SELECT password_hash FROM employees WHERE employee_id = ?")
                .bind(employee_id).first();
            
            if (!user) return new Response(JSON.stringify({ error: "查無此工號" }), { status: 404, headers: getCorsHeaders() });

            const oldHashed = await hashPassword(old_password || "");
            if (user.password_hash !== oldHashed) {
                return new Response(JSON.stringify({ error: "舊密碼錯誤" }), { status: 401, headers: getCorsHeaders() });
            }
        }

        const newHashed = await hashPassword(new_password);
        await env.DB.prepare("UPDATE employees SET password_hash = ?, initial_password_set = 1 WHERE employee_id = ?")
            .bind(newHashed, employee_id).run();
        
        return new Response(JSON.stringify({ status: "success" }), { status: 200, headers: getCorsHeaders() });

    } catch (err) {
        return new Response(JSON.stringify({ error: "伺服器錯誤", details: err.message }), { status: 500, headers: getCorsHeaders() });
    }
}

export async function onRequestOptions() {
    return new Response(null, { status: 204, headers: getCorsHeaders() });
}
