// functions/api/auth/initial password.js
async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function onRequestPost(context) {
    const { env, request } = context;
    const { employee_id } = await request.json();

    // 強制重設為 1111
    const newPassword = "a11111"; 
    const hashed = await hashPassword(newPassword);

    const result = await env.DB.prepare("UPDATE employees SET password_hash = ? WHERE employee_id = ?")
        .bind(hashed, employee_id)
        .run();

    if (result.success) {
        return new Response(JSON.stringify({ status: "success", message: `工號 ${employee_id} 密碼已重設` }), { status: 200 });
    } else {
        return new Response(JSON.stringify({ error: "重設失敗" }), { status: 500 });
    }
}
