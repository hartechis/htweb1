// functions/api/auth/verify.js
import { verifyToken } from '../../utils/auth.js';

function getCorsHeaders() {
    return { 
        "Access-Control-Allow-Origin": "*", 
        "Access-Control-Allow-Methods": "GET, OPTIONS", 
        "Access-Control-Allow-Headers": "Content-Type, Authorization" 
    };
}

export async function onRequestGet(context) {
    // 呼叫共用驗證邏輯
    const user = await verifyToken(context.request, context.env);

    if (!user) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { 
            status: 401, 
            headers: getCorsHeaders() 
        });
    }

    // 回傳結果 (保持原有的 JSON 結構，不會影響前端！)
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
