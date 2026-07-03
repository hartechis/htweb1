// 輔助函式：將密碼進行 SHA-256 哈希處理
async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}

// 輔助函式：取得 CORS 標頭
function getCorsHeaders() {
    return { 
        "Access-Control-Allow-Origin": "*", 
        "Access-Control-Allow-Methods": "POST, OPTIONS", 
        "Access-Control-Allow-Headers": "Content-Type, Authorization" 
    };
}

export async function onRequestPost(context) {
    const { request, env } = context;
    
    try {
        const body = await request.json();
        const { employee_id, new_password, old_password, mode } = body;

        // 1. 基礎參數驗證
        if (!employee_id || !new_password) {
            return new Response(JSON.stringify({ error: "參數缺失: 必須提供工號與新密碼" }), { 
                status: 400, headers: { ...getCorsHeaders(), "Content-Type": "application/json" } 
            });
        }

        // 2. 模式邏輯處理
        if (mode === 'reset') {
            // 重設模式：需驗證工號是否存在以及舊密碼是否正確
            const user = await env.DB.prepare("SELECT password_hash FROM employees WHERE employee_id = ?")
                .bind(employee_id)
                .first();
            
            if (!user) {
                return new Response(JSON.stringify({ error: "查無此員工帳號" }), { 
                    status: 404, headers: { ...getCorsHeaders(), "Content-Type": "application/json" } 
                });
            }

            const oldHashed = await hashPassword(old_password || "");
            if (user.password_hash !== oldHashed) {
                return new Response(JSON.stringify({ error: "舊密碼錯誤" }), { 
                    status: 401, headers: { ...getCorsHeaders(), "Content-Type": "application/json" } 
                });
            }
        }

        // 3. 更新密碼與設定標記
        const newHashed = await hashPassword(new_password);
        
        await env.DB.prepare("UPDATE employees SET password_hash = ?, initial_password_set = 1 WHERE employee_id = ?")
            .bind(newHashed, employee_id)
            .run();
        
        return new Response(JSON.stringify({ status: "success" }), { 
            status: 200, headers: { ...getCorsHeaders(), "Content-Type": "application/json" } 
        });

    } catch (err) {
        return new Response(JSON.stringify({ 
            error: "伺服器內部錯誤", 
            details: err.message 
        }), { 
            status: 500, headers: { ...getCorsHeaders(), "Content-Type": "application/json" } 
        });
    }
}

// 處理 CORS 預檢請求
export async function onRequestOptions() {
    return new Response(null, { status: 204, headers: getCorsHeaders() });
}
