-- 1. 初始化資料表結構
DROP TABLE IF EXISTS employees;

CREATE TABLE employees (
    employee_id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    dept_id TEXT,
    dept_name TEXT,
    shift_code TEXT,
    manager_name TEXT,
    manager_email TEXT,
    password_hash TEXT,
    initial_password_set BOOLEAN DEFAULT 0,
    role TEXT DEFAULT 'staff'
);

-- 2. 匯入員工初始資料
INSERT INTO employees (employee_id, name, dept_id, dept_name, shift_code, manager_name, manager_email) VALUES
('23901', '蔡耀毅', 'H110', '管理部', 'D01', '陳堂評', 'tom-chen@hota.com.tw'),
('23902', '許益源', 'H152', '加工課', 'D01', '陳正評', 'mc-06@hota.com.tw'),
('23903', '林福龍', 'H150', '廠務部', 'D01', '蔡耀毅', 'jams-tsai@hota.com.tw'),
('23904', '趙宮志', 'H130', '研發部', 'D01', '蔡耀毅', 'jams-tsai@hota.com.tw'),
('23905', '劉益宏', 'H153', '組立課', 'D02', '陳正評', 'mc-06@hota.com.tw'),
('23906', '陳正評', 'H150', '廠務部', 'D01', '蔡耀毅', 'jams-tsai@hota.com.tw'),
('23907', '黃智偉', 'H152', '加工課', 'D01', '陳正評', 'mc-06@hota.com.tw'),
('23908', '陳彥丞', 'H153', '組立課', 'D02', '陳正評', 'mc-06@hota.com.tw'),
('23909', '蔡宗訓', 'H153', '組立課', 'D01', '趙宮志', 'alex-chao@hota.com.tw'),
('23910', '蕭丞鴻', 'H152', '加工課', 'D01', '陳正評', 'mc-06@hota.com.tw'),
('23911', '林靜雯', 'H151', '生管課', 'D01', '陳正評', 'mc-06@hota.com.tw'),
('23912', '張式棟', 'H122', '售服課', 'D01', '蔡耀毅', 'jams-tsai@hota.com.tw'),
('23913', '錡榆芳', 'H131', '設計課', 'D01', '趙宮志,葉思辰', 'alex-chao@hota.com.tw,mc-14@hota.com.tw'),
('23914', '李易峻', 'H122', '售服課', 'D01', '蔡耀毅', 'jams-tsai@hota.com.tw'),
('23915', '陳正義', 'H114', '採購課', 'D01', '陳正評', 'mc-06@hota.com.tw'),
('23916', '卓震諠', 'H153', '組立課', 'D02', '陳正評', 'mc-06@hota.com.tw'),
('23917', '劉會媛', 'H114', '採購課', 'D01', '陳正評', 'mc-06@hota.com.tw'),
('23918', '張登源', 'H153', '組立課', 'D02', '陳正評', 'mc-06@hota.com.tw'),
('23920', '余昭憲', 'H131', '設計課', 'D01', '趙宮志,葉思辰', 'alex-chao@hota.com.tw,mc-14@hota.com.tw'),
('23923', '陳明山', 'H141', '機電課', 'D01', '張瑋志', 'alan-chang@hota.com.tw'),
('23924', '葉致吾', 'H153', '組立課', 'D02', '陳正評', 'mc-06@hota.com.tw'),
('23928', '葉思辰', 'H131', '設計課', 'D01', '趙宮志', 'alex-chao@hota.com.tw'),
('23930', '洪君緯', 'H142', '自動化課', 'D02', '張瑋志', 'alan-chang@hota.com.tw'),
('23931', '紀雅鳳', 'H111', '管理課', 'D01', '蔡耀毅', 'jams-tsai@hota.com.tw'),
('23934', '蔡欣悅', 'H131', '設計課', 'D01', '趙宮志,葉思辰', 'alex-chao@hota.com.tw,mc-14@hota.com.tw'),
('23937', '陳佩葦', 'H121', '業務課', 'D01', '蔡耀毅', 'jams-tsai@hota.com.tw'),
('24901', '張竣硯', 'H122', '售服課', 'D01', '蔡耀毅', 'jams-tsai@hota.com.tw'),
('24902', '陳石生', 'H141', '機電課', 'D01', '張瑋志', 'alan-chang@hota.com.tw'),
('25902', '張瑋志', 'H140', '電機部', 'D01', '蔡耀毅', 'jams-tsai@hota.com.tw'),
('25903', '馬韓德', 'H121', '業務課', 'D01', '蔡耀毅', 'jams-tsai@hota.com.tw'),
('26901', '朱清獻', 'H132', '品管課', 'D01', '趙宮志,葉思辰', 'alex-chao@hota.com.tw,mc-14@hota.com.tw'),
('26902', '廖家榮', 'H142', '自動化課', 'D02', '張瑋志', 'alan-chang@hota.com.tw');

-- 3. 建立 Session 資料表
CREATE TABLE IF NOT EXISTS sessions (
    token TEXT PRIMARY KEY,
    employee_id TEXT,
    expires_at TEXT
);
