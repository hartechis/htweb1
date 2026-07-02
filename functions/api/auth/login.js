// functions/api/auth/login.js
export const onRequestPost = async ({ request, env }) => {
  try {
    const input = await request.json();
    const { employee_id } = input;
    
    // 請確認 env.DB 是否在 Cloudflare Dashboard 的 Pages 專案設定中正確綁定
    const db = env.DB; 

    const result = await db
      .prepare("SELECT name FROM employees WHERE employee_id = ?")
      .bind(employee_id)
      .first();

    if (result) {
      return new Response(JSON.stringify({ success: true, name: result.name }), {
        headers: { "Content-Type": "application/json" }
      });
    } else {
      return new Response(JSON.stringify({ success: false, message: "查無此工號" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }
  } catch (e) {
    return new Response(JSON.stringify({ success: false, message: e.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
