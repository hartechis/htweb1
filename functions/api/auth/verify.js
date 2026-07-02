// functions/api/auth/verify.js

// 內嵌 getCorsHeaders
function getCorsHeaders() {
    return { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "GET, OPTIONS", "Access-Control-Allow-Headers": "Content-Type, Authorization" };
}

export async function onRequestGet(context) {
    const { request, env } = context;
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    const session = await env.DB.prepare("SELECT employee_id FROM sessions WHERE token = ? AND expires_at > ?")
        .bind(token, new Date().toISOString()).first();

    if (!session) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: getCorsHeaders() });
    
    return new Response(JSON.stringify({ employee_id: session.employee_id }), { status: 200, headers: { ...getCorsHeaders(), "Content-Type": "application/json" } });
}
