const TelegramBot = require('node-telegram-bot-api');
const { createClient } = require('@supabase/supabase-js');
const express = require('express');

const app = express();
app.get('/', (req, res) => res.send('Bot is Alive!'));

// جلب البيانات من بيئة التشغيل الآمنة
const token = process.env.TELEGRAM_TOKEN;
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const myChatId = Number(process.env.MY_CHAT_ID);

const bot = new TelegramBot(token, { polling: true });
const supabase = createClient(supabaseUrl, supabaseKey);

console.log("البوت جاهز ويعمل...");

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    if (chatId !== myChatId || !text) return;

    let type = '';
    let content = '';

    if (text.startsWith('/اقتباس')) { type = 'quote'; content = text.replace('/اقتباس', '').trim(); }
    else if (text.startsWith('/حكمة')) { type = 'wisdom'; content = text.replace('/حكمة', '').trim(); }
    else if (text.startsWith('/كتاب')) { type = 'book'; content = text.replace('/كتاب', '').trim(); }
    else if (text.startsWith('/قول')) { type = 'saying'; content = text.replace('/قول', '').trim(); }

    if (type !== '') {
        if (!content) { bot.sendMessage(chatId, '⚠️ اكتب النص بعد الأمر.'); return; }

        const { error } = await supabase.from('posts').insert([{ content: content, type: type }]);
        if (!error) bot.sendMessage(chatId, `✅ تم النشر في قسم (${type})!`);
        else bot.sendMessage(chatId, '❌ حدث خطأ في قاعدة البيانات.');
    }
});

// تصدير التطبيق ليتوافق مع Vercel
module.exports = app;
