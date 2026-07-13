// frontend/assets/js/auth_check.js 權限驗證模組
// 負責在頁面載入時檢查 LocalStorage 的 Token 是否有效並防止畫面閃爍

(function() {
    async function checkAuth() {
        const token = localStorage.getItem('auth_token');

        // 1. 檢查 Token 是否存在
        if (!token) {
            window.location.replace('/index.html');
            return;
        }

        try {
            // 2. 呼叫後端 API 驗證 Token 有效性
            const response = await fetch('/api/auth/verify', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            // 3. 處理驗證結果
            if (response.status === 401) {
                console.warn("Token 過期或無效，執行登出。");
                localStorage.clear();
                window.location.replace('/index.html');
                return;
            }

            if (response.ok) {
                const data = await response.json();
                
                // 儲存最新的員工資料到 localStorage
                localStorage.setItem('empId', data.employee_id);
                localStorage.setItem('empName', data.name);

                // --- 自動更新 UI ---
                
                // A. 更新 Header 中的顯示名稱
                const nameDisplay = document.getElementById('empIdDisplay');
                if (nameDisplay) {
                    nameDisplay.textContent = `${data.employee_id}${data.name}`;
                }

                // B. 自動填入表單欄位 (若頁面存在這些 input)
                const empInput = document.getElementById('formEmpId');
                const nameInput = document.getElementById('formEmpName');
                
                if (empInput) empInput.value = data.employee_id;
                if (nameInput) nameInput.value = data.name;

                // --- 最後顯示畫面 ---
                document.body.style.visibility = 'visible';
            } else {
                window.location.replace('/index.html');
            }
        } catch (error) {
            console.error("驗證連線失敗:", error);
            window.location.replace('/index.html');
        }
    }

    // 確保 DOM 載入後執行
    document.addEventListener("DOMContentLoaded", checkAuth);
})();
