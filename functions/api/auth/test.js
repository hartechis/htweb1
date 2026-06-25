
// functions/api/auth/test.js

export async function onRequestGet(context) {
    return new Response(JSON.stringify({ 
        message: "API 運作正常！",
        timestamp: new Date().toISOString(),
        path: "/api/auth/test"
    }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
    });
}
