const TelegramBot = require('node-telegram-bot-api');
const config = require('./config');
const { handleStartCommand } = require('./handlers/user');
const { handleAdminMessage } = require('./handlers/admin');

const bot = new TelegramBot(config.token, { polling: true });

bot.onText(/\/start/, (msg) => {
    handleStartCommand(bot, msg);
});

bot.onText(/\/admin (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;

    // Replace with your admin user ID
    const adminUserId = 'your_admin_user_id_here';

    if (userId.toString() === adminUserId) {
        const messageText = match[1];
        handleAdminMessage(bot, msg, messageText);
    } else {
        bot.sendMessage(chatId, 'You are not authorized to use this command.');
    }
});

console.log('Bot is running...');
