export default async function handler(req, res) {
if (req.method !== 'POST') {
return res.status(405).json({ ok: false });
}

try {
const { name, contact, type, message, date } = req.body || {};

const token = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;

if (!token || !chatId) {
return res.status(500).json({ ok: false });
}

const text =
`🔔 <b>Новая заявка ORATOR</b>\n\n` +
`👤 <b>Имя:</b> ${escapeHtml(name)}\n` +
`📱 <b>Контакт:</b> ${escapeHtml(contact)}\n` +
`🎯 <b>Тип:</b> ${escapeHtml(type)}\n` +
`💬 <b>Сообщение:</b> ${escapeHtml(message)}\n` +
`🕐 <b>Дата:</b> ${escapeHtml(date)}`;

const response = await fetch(
`https://api.telegram.org/bot${token}/sendMessage`,
{
method: 'POST',
headers: {
'Content-Type': 'application/json'
},
body: JSON.stringify({
chat_id: chatId,
text: text,
parse_mode: 'HTML'
})
}
);

const result = await response.json();

if (!response.ok || !result.ok) {
return res.status(500).json({ ok: false });
}

return res.status(200).json({ ok: true });

} catch (error) {
return res.status(500).json({ ok: false });
}
}

function escapeHtml(value) {
return String(value || '')
.replace(/&/g, '&amp;')
.replace(/</g, '&lt;')
.replace(/>/g, '&gt;')
.replace(/"/g, '&quot;')
.replace(/'/g, '&#039;');
}
