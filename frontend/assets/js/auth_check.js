// /frontend/assets/js/auth_check.js 權限驗證模組
// 負責在頁面載入時檢查 LocalStorage 的 Token 是否有效並防止畫面閃爍

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
                localStorage.removeItem('empId');
                localStorage.removeItem('empName');
                window.location.replace('/index.html');
            } else if (response.ok) {
                // 4. 驗證成功
                const data = await response.json();
                
                // 更新使用者名稱顯示
                const nameDisplay = document.getElementById('empIdDisplay');
                if (nameDisplay) {
                    nameDisplay.textContent = data.name;
                }

                // --- 關鍵修改：驗證成功才顯示 Dashboard 內容 ---
                document.body.style.visibility = 'visible';
            } else {
                // 其他非 200/401 的狀態，保守起見導回
                window.location.replace('/index.html');
            }
        } catch (error) {
            console.error("驗證連線發生錯誤:", error);
            // 發生網路錯誤時，若已在 Dashboard 則嘗試重新整理，否則回登入頁
            window.location.replace('/index.html');
        }
    }

    // 確保 DOM 結構已載入後才執行驗證，防止 document.body 為 null
    document.addEventListener("DOMContentLoaded", checkAuth);
})();
