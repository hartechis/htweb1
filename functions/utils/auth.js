// functions/utils/auth.js

/**
 * 共用驗證函數
 * @param {Request} request 
 * @param {Object} env 包含 DB 等繫結
 * @returns {Object|null} 驗證通過回傳使用者資料，失敗回傳 null
 */
export async function verifyToken(request, env) {
    const authHeader = request.headers.get("Authorization");
    
    // 檢查是否有 Token
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return null;
    }

    const token = authHeader.split(" ")[1];

    try {
        // 假設您的驗證邏輯是去資料庫檢查 Token 是否合法
        // 請根據您的實際驗證邏輯調整（例如 JWT 解析或 DB 比對）
        const user = await env.DB.prepare(
            "SELECT * FROM users WHERE token = ?"
        ).bind(token).first();

        return user || null;
    } catch (error) {
        console.error("Token 驗證過程發生錯誤:", error);
        return null;
    }
}
