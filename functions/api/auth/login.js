
// functions/api/auth/login.js

export async function onRequest(context) {
  const { request } = context;
  
  // 記錄請求的方法 (GET 或 POST)
  const method = request.method;
  
  // 簡單回傳訊息，讓我們知道伺服器收到了請求
  return new Response(JSON.stringify({
    status: "success",
    message: "登入 API 測試成功！",
    receivedMethod: method,
    url: request.url
  }), {
    headers: { "Content-Type": "application/json" }
  });
}
