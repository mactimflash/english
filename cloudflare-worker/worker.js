/**
 * English Discipline Worker (KV + Telegram)
 *
 * Deploy via Cloudflare Dashboard (no wrangler).
 *
 * Required bindings / env:
 * - KV binding name: KV
 * - Env vars:
 *   TELEGRAM_BOT_TOKEN = ...
 *   ADMIN_CHAT_ID = ...
 *   ALLOWED_ORIGIN = https://mactimflash.github.io   (or your GitHub Pages domain)
 *
 * Endpoints:
 * - POST /study  { uid, reason?, ts? }  -> store last activity
 * - POST /tg/webhook  Telegram webhook
 *
 * Cron:
 * - check every 30 minutes -> if user inactive too long -> warn admin
 */
export default {
  async fetch(req, env, ctx) {
    const url = new URL(req.url);

    const origin = env.ALLOWED_ORIGIN || "*";
    const cors = {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400",
      "Vary": "Origin"
    };

    if (req.method === "OPTIONS") {
      return new Response("", { status: 204, headers: cors });
    }

    // Website tracking
    if (url.pathname === "/study" && req.method === "POST") {
      const body = await req.json().catch(() => ({}));
      const uid = String(body.uid || "anonymous").slice(0, 80);
      const reason = String(body.reason || "study").slice(0, 40);
      const ts = Number(body.ts || Date.now());

      await env.KV.put(`last:${uid}`, String(ts));
      await env.KV.put(`last_reason:${uid}`, reason);

      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { "content-type": "application/json; charset=utf-8", ...cors }
      });
    }

    // Telegram webhook
    if (url.pathname === "/tg/webhook" && req.method === "POST") {
      const update = await req.json().catch(() => null);
      if (update) ctx.waitUntil(handleTelegram(update, env));
      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { "content-type": "application/json; charset=utf-8", ...cors }
      });
    }

    return new Response(JSON.stringify({ ok: false, error: "not_found" }), {
      status: 404,
      headers: { "content-type": "application/json; charset=utf-8", ...cors }
    });
  },

  // Cron (set in Dashboard → Triggers → Cron)
  async scheduled(event, env, ctx) {
    ctx.waitUntil(runDisciplineCheck(env));
  }
};

async function tgSend(env, chatId, text) {
  const url = `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text })
  });
  return res.json();
}

async function handleTelegram(update, env) {
  const msg = update.message;
  if (!msg?.chat?.id || !msg.text) return;

  const chatId = msg.chat.id;
  const text = msg.text.trim();

  if (text === "/start") {
    const reply =
      `✅ English Discipline bot\n\n` +
      `Website tracking đang bật.\n` +
      `Mỗi khi học/quiz/flashcard, website sẽ ping Worker.\n\n` +
      `Gõ /status để xem trạng thái học viên.\n` +
      `Gõ /help để xem lệnh.`;
    await tgSend(env, chatId, reply);
    return;
  }

  if (text === "/help") {
    await tgSend(env, chatId,
      "Lệnh:\n" +
      "/status - xem last activity\n" +
      "/ping - test bot\n"
    );
    return;
  }

  if (text === "/ping") {
    await tgSend(env, chatId, "pong ✅");
    return;
  }

  if (text === "/status") {
    // MVP: 1 học viên (student1). Bạn có thể đổi theo UID bạn dùng ở website.
    const uid = "student1";
    const last = await env.KV.get(`last:${uid}`);
    const reason = await env.KV.get(`last_reason:${uid}`);

    if (!last) {
      await tgSend(env, chatId, `⚠️ Chưa có activity cho uid=${uid}.`);
      return;
    }

    const lastMs = Number(last);
    const mins = Math.floor((Date.now() - lastMs) / 60000);
    await tgSend(env, chatId, `uid=${uid}\nlast=${new Date(lastMs).toLocaleString()}\n${mins} phút trước\nreason=${reason || "-"}`);
    return;
  }
}

async function runDisciplineCheck(env) {
  // MVP: 1 học viên
  const uid = "student1";
  const last = await env.KV.get(`last:${uid}`);
  const reason = await env.KV.get(`last_reason:${uid}`);

  const admin = env.ADMIN_CHAT_ID;
  if (!admin) return;

  // If never studied
  if (!last) {
    await tgSend(env, admin, `⚠️ [Discipline] uid=${uid} chưa có activity nào.`);
    return;
  }

  const lastMs = Number(last);
  const diffMs = Date.now() - lastMs;

  // Thresholds
  const warn6h = 6 * 60 * 60 * 1000;
  const warn12h = 12 * 60 * 60 * 1000;
  const warn24h = 24 * 60 * 60 * 1000;

  let level = "";
  if (diffMs >= warn24h) level = "🔥 CẢNH BÁO NẶNG (24h)";
  else if (diffMs >= warn12h) level = "🚨 Cảnh báo (12h)";
  else if (diffMs >= warn6h) level = "⚠️ Nhắc học (6h)";
  else return; // ok

  const mins = Math.floor(diffMs / 60000);
  await tgSend(env, admin, `${level}\nuid=${uid}\nlast=${new Date(lastMs).toLocaleString()}\n${mins} phút trước\nreason=${reason || "-"}`);
}
