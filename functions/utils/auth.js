// functions/utils/auth.js
export async function verifyToken(request, env) {
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) return null;

    // 1. 驗證 Token 是否存在且未過期
    const session = await env.DB.prepare(
        "SELECT employee_id FROM sessions WHERE token = ? AND expires_at > ?"
    ).bind(token, new Date().toISOString()).first();

    if (!session) return null;

    // 2. 獲取使用者姓名
    const user = await env.DB.prepare(
        "SELECT employee_id, name FROM employees WHERE employee_id = ?"
    ).bind(session.employee_id).first();

    return user; // 回傳包含 employee_id 和 name 的物件
}
