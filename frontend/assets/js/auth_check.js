/frontend/assets/js/auth_check.js
 * 權限驗證模組
 * 負責在頁面載入時檢查 LocalStorage 的 Token 是否有效
 */
(function() {
    async function checkAuth() {
        const token = localStorage.getItem('auth_token');

        // 1. 如果根本沒有 Token，直接踢回登入頁
        if (!token) {
            window.location.replace('/index.html');
            return;
        }

        try {
            // 2. 呼叫後端 verify API 進行驗證
            const response = await fetch('/api/auth/verify', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            // 3. 如果後端回傳 401 Unauthorized，代表 Token 無效或已過期
            if (response.status === 401) {
                console.warn("驗證失敗，Token 已過期或無效。");
                localStorage.removeItem('auth_token');
                window.location.replace('/index.html');
            } else if (response.ok) {
                // 4. 驗證成功，可以在這裡將使用者名稱放入畫面上
                const data = await response.json();
                const nameDisplay = document.getElementById('empIdDisplay');
                if (nameDisplay) {
                    nameDisplay.textContent = data.name;
                }
            }
        } catch (error) {
            console.error("驗證連線發生錯誤:", error);
            // 發生網路錯誤時，保守起見也清除登入狀態
            window.location.replace('/index.html');
        }
    }

    // 頁面一載入就執行檢查
    checkAuth();
})();
