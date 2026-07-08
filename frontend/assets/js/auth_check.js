<script>
    async function checkEntry() {
        const token = localStorage.getItem('auth_token');
        if (!token) return; // 沒有 Token，留在登入頁面

        // 有 Token，去後端驗證 8 小時效期
        try {
            const response = await fetch('/api/auth/verify', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (response.ok) {
                // Token 有效且在 8 小時內，自動跳轉到 Dashboard
                window.location.replace('/dashboard/dashboard.html');
            } else {
                // Token 已過期，清除它，讓使用者留在登入頁重新登入
                localStorage.removeItem('auth_token');
            }
        } catch (e) {
            console.error("驗證服務連線失敗");
        }
    }
    checkEntry();
</script>
