//functions/api/auth/verify.js
function getCorsHeaders() {
    return { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "GET, OPTIONS", "Access-Control-Allow-Headers": "Content-Type, Authorization" };
}

export async function onRequestGet(context) {
    const { request, env } = context;
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    // 1. 先從 sessions 表找到對應的 employee_id
    const session = await env.DB.prepare("SELECT employee_id FROM sessions WHERE token = ? AND expires_at > ?")
        .bind(token, new Date().toISOString()).first();

    if (!session) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: getCorsHeaders() });
    }
    
    // 2. 從 employees 表撈取該員工的姓名
    const user = await env.DB.prepare("SELECT employee_id, name FROM employees WHERE employee_id = ?")
        .bind(session.employee_id)
        .first();

    // 3. 回傳 employee_id 與 name
    return new Response(JSON.stringify({ 
        employee_id: user.employee_id,
        name: user.name 
    }), { 
        status: 200, 
        headers: { ...getCorsHeaders(), "Content-Type": "application/json" } 
    });
}

export async function onRequestOptions() {
    return new Response(null, { status: 204, headers: getCorsHeaders() });
}
