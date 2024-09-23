    import {
    addUser,
    getAllUsersFields,
    getUserByUserId,
    updateUser,
    } from '../models/user.js'

    const answers = {
        askName: 'Введите ваше имя:',
        askPhone: 'Введите ваш номер телефона:',
        confirmation(name, phone) {
            return `Ваше имя: ${name}\nВаш телефон: ${phone}`
        },
        completed: `Спасибо за регистрацию!\nВ ближайшее время мы пришлем вам новые статьи.`
    }
    async function sendTypingMessage(bot, chatId, msg, option = null) {
        try {
            await  bot.sendChatAction(chatId, 'typing')
            setTimeout(()=>{
                if (option) {
                    bot.sendMessage(chatId, msg, option)
                } else bot.sendMessage(chatId, msg)

            }, 1000)
        } catch (err) {
            console.error('Ошибка при отправке действия - "печатает..." в чате:', err)
        }
    }

    async function checkUserStage(bot, userId, chatId, userNick, msgText) {
        try {
            const user = await getUserByUserId(userId)
            if (user) {
                switch (user.reg_stage) {
                    case 'askName':
                        await updateUser(userId, chatId, '', userNick, '', 'askPhone')
                        await sendTypingMessage(bot, chatId, answers.askName)
                        break
                    case 'askPhone':
                        let newName = msgText
                        await updateUser(userId, chatId, newName, userNick, '', 'preConfirmation')
                        await sendTypingMessage(bot, chatId, answers.askPhone)
                        break
                    case 'preConfirmation':
                        let newPhone = msgText
                        await updateUser(userId, chatId, user.name, userNick, newPhone, 'confirmation')
                        await checkUserStage(bot, userId, chatId, userNick, '')
                        break
                    case 'confirmation':
                        await updateUser(userId, chatId, user.name, userNick, user.phone, 'confirmation')
                        const option = {
                            reply_markup: JSON.stringify({
                                inline_keyboard: [
                                    [
                                        {text: 'Да', callback_data: 'confirm'},
                                        {text: 'Изменить', callback_data: 'edit'},
                                    ],
                                ]
                            })
                        }
                        await sendTypingMessage(bot, chatId, answers.confirmation(user.name, user.phone), option)
                        break
                    case 'completed':
                        await sendTypingMessage(bot, chatId, answers.completed)
                        break
                }
            } else {
                await addUser(userId, chatId, '', userNick, '')
                await checkUserStage(bot, userId, chatId, userNick, '')
            }
        } catch (err) {
            console.error('Ошибка проверки этапов регистрации:', err)
        }
    }
    async function handleUser(bot, msg) {
        const userId = msg.from.id
        const chatId = msg.chat.id
        const userNick = msg.from.username
        const msgText = msg.text
        if (!msgText) return
        try {
            switch (msgText) {
                case '/start':
                    await checkUserStage(bot, userId, chatId, userNick, msgText)
                    await getAllUsersFields()
                    break
                case '/edit':
                    await updateUser(userId, chatId, '', userNick, '', 'askName')
                    await checkUserStage(bot, userId, chatId, userNick, '')
                    break
                case '/info':
                    const info =
                    '/start - регистрация\n' +
                    '/edit - изменение данных\n' +
                    '/info - информация о командах'
                    await sendTypingMessage(bot, chatId, info)
                    break
                default:
                    await checkUserStage(bot, userId, chatId, userNick, msgText)
                    break
            }
        } catch (err) {
            console.error('Ошибка обработки команд пользователя:', err)
        }
    }
    async function handleUserQuery(bot, qMsg) {
        const data = qMsg.data
        const chatId = qMsg.message.chat.id
        const userId = qMsg.from.id
        const messageId = qMsg.message.message_id
        try {
            const user = await getUserByUserId(userId)
            switch (data) {
                case 'confirm':
                    await updateUser(userId, chatId, user.name, user.nick, user.phone, 'completed')
                    break
                case 'edit':
                    await updateUser(userId, chatId, '', user.nick, '', 'askName')
                    break
            }
            await bot.editMessageReplyMarkup({ inline_keyboard: [] }, {
                chat_id: chatId,
                message_id: messageId
            })
            await checkUserStage(bot, userId, chatId, user.nick, '')
        } catch (err) {
            console.error('Ошибка обработки callback_query пользователя:', err)
        }
    }

    export { handleUser, handleUserQuery }

