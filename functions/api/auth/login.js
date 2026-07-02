// functions/api/auth/login1.js

export async function onRequestPost(context) {
  // 1. 取得 Cloudflare Pages 環境綁定的 DB
  const { DB } = context.env;

  try {
    // 2. 解析前端傳來的 JSON 資料
    const { employee_id } = await context.request.json();

    if (!employee_id) {
      return new Response(JSON.stringify({ error: "請輸入工號" }), { status: 400 });
    }

    // 3. 執行 SQL 查詢 (使用預處理語句防止 SQL 注入)
    const stmt = DB.prepare("SELECT * FROM employees WHERE employee_id = ?");
    const user = await stmt.bind(employee_id).first();

    // 4. 回傳驗證結果
    if (user) {
      return new Response(JSON.stringify({ success: true, name: user.name }), {
        headers: { "Content-Type": "application/json" },
      });
    } else {
      return new Response(JSON.stringify({ success: false, message: "工號不存在" }), { status: 401 });
    }
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
