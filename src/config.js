    import TelegramBot from "node-telegram-bot-api";
    import dotenv from "dotenv"
    dotenv.config()

    const token = process.env.TOKEN
    const bot = new TelegramBot(token, {polling: true})
    const databasePath = './data/database.sqlite'

    export {bot, token, databasePath}