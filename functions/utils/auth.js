// functions/utils/auth.js
export async function checkAuth(request, env) {
    const token = request.headers.get("Authorization");
    
    // 這裡寫您的驗證邏輯
    if (!token || token !== "正確的TOKEN") {
        return { authorized: false, user: null };
    }
    
    // 如果驗證通過，回傳使用者資料
    return { authorized: true, user: "admin" };
}
