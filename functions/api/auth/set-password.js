// functions/api/auth/set-password.js

// 內嵌 hashPassword 與 getCorsHeaders
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
    const { employee_id, new_password } = await request.json();
    const hashed = await hashPassword(new_password);
    
    await env.DB.prepare("UPDATE employees SET password_hash = ?, initial_password_set = 1 WHERE employee_id = ?")
        .bind(hashed, employee_id).run();
        
    return new Response(JSON.stringify({ status: "success" }), { status: 200, headers: { ...getCorsHeaders(), "Content-Type": "application/json" } });
}
