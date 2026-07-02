export async function onRequestPost(context) {
  try {
    // 透過 context.env.DB 存取你定義的綁定
    const { DB } = context.env;
    const { employee_id } = await context.request.json();

    // 執行 SQL 查詢
    const result = await DB.prepare("SELECT * FROM employees WHERE employee_id = ?")
      .bind(employee_id)
      .first();

    if (result) {
      return new Response(JSON.stringify({ status: "success", data: result }), {
        headers: { "Content-Type": "application/json" },
      });
    } else {
      return new Response(JSON.stringify({ status: "error", message: "找不到員工" }), { status: 404 });
    }
  } catch (e) {
    return new Response(e.message, { status: 500 });
  }
}
