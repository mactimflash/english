# English Sprint (GitHub Pages) + Telegram Discipline (Cloudflare Worker)

Repo này là website học tiếng Anh (static) + tracking “kỷ luật” qua Telegram.

## 1) Website (GitHub Pages)
- Deploy repo này lên GitHub Pages như bình thường.
- Website sẽ gọi Cloudflare Worker endpoint `POST /study` để ghi nhận hoạt động học.

### Cấu hình tracking ngay trên web
Vào **⚙️ Cài đặt**:
- **Worker URL**: `https://<your-worker>.workers.dev`
- **UID**: ví dụ `student1`

Website sẽ tự ping khi:
- page load (1 lần)
- flashcard (Remember/Again)
- quiz (answer/skip)
- save writing
- mark done
- daily plan

> Ping có throttle 60 giây để tránh spam.

---

## 2) Cloudflare Worker (KHÔNG dùng wrangler, làm qua Dashboard)
File worker mẫu nằm ở: `cloudflare-worker/worker.js`

### 2.1 Tạo KV
Cloudflare Dashboard → **Workers & Pages → KV** → Create Namespace, ví dụ: `english_tracker`

### 2.2 Tạo Worker
Cloudflare Dashboard → **Workers & Pages → Create Worker**  
Đặt tên ví dụ: `english-discipline` → Deploy.

### 2.3 Bind KV
Worker → **Settings → Variables → KV bindings**  
Add binding:
- **Name**: `KV`
- **Namespace**: `english_tracker`

### 2.4 Add Environment Variables
Worker → **Settings → Variables → Environment variables**
- `TELEGRAM_BOT_TOKEN` = token bot của bạn
- `ADMIN_CHAT_ID` = chat id admin (group/private)
- `ALLOWED_ORIGIN` = domain GitHub Pages của bạn, ví dụ:
  - `https://mactimflash.github.io`

> Nếu để `ALLOWED_ORIGIN="*"` thì dễ test, nhưng không khuyến nghị lâu dài.

### 2.5 Paste code
Worker → **Edit code** → paste toàn bộ nội dung trong `cloudflare-worker/worker.js` → Deploy.

---

## 3) Telegram webhook
Sau khi deploy Worker, set webhook cho bot:

Thay `<BOT_TOKEN>` và `<WORKER_URL>`:
```bash
curl -s "https://api.telegram.org/bot<BOT_TOKEN>/setWebhook?url=<WORKER_URL>/tg/webhook"
```

Ví dụ:
```bash
curl -s "https://api.telegram.org/bot123:ABC/setWebhook?url=https://english-discipline.example.workers.dev/tg/webhook"
```

Test:
- Chat bot: `/start`
- Chat bot: `/status`

---

## 4) Cron Discipline
Worker → **Triggers → Cron**:
- `*/30 * * * *`  (mỗi 30 phút)

Worker sẽ nhắc admin nếu uid `student1` không học:
- 6h: nhắc nhẹ
- 12h: cảnh báo
- 24h: cảnh báo nặng

> Muốn nhiều học viên: mở rộng KV keys theo uid và thêm command `/status <uid>`.

---

## Troubleshooting
### Lỗi CORS trên browser
Nếu thấy lỗi kiểu:
`blocked by CORS policy: No 'Access-Control-Allow-Origin'`
→ chắc chắn `ALLOWED_ORIGIN` đúng domain GitHub Pages, và Worker trả header CORS (code đã có).

### Worker Logs
Cloudflare Dashboard → Worker → **Logs** để kiểm tra request `/study`.
