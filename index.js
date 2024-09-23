    import {bot} from './src/config.js'
    import {handleUser, handleUserQuery} from './src/handlers/user.js'
    import {handleAdminMessage, handleAdminQuery} from "./src/handlers/admin.js";
    import {getAllTable} from './src/database.js'



    const adminUserId = '1492162349'

    async function setCommands(bot, isAdmin) {
        const userCommands = [
            { command: '/start', description: 'Регистрация' },
            { command: '/edit', description: 'Изменить данные' },
            { command: '/info', description: 'Инфо' },
        ]

        const adminCommands = [
            { command: '/start', description: 'Старт' },
            { command: '/info', description: 'Инфо' }
        ]

        const commands = isAdmin ? adminCommands : userCommands

        try {
            await bot.setMyCommands(commands)
            console.log('Команды бота установлены')
        } catch (err) {
            console.error('Ошибка при установке команд бота:', err)
        }
    }

    const start = () => {
        bot.on('text', async msg => {
            console.log(msg)
            try {
                const userId = msg.from.id
                const isAdmin = userId.toString() === adminUserId

                await setCommands(bot, isAdmin)

                if (isAdmin) {
                    await handleAdminMessage(bot, msg)
                } else {
                    await handleUser(bot, msg)
                }
            } catch (err) {
                console.error('Ошибка обработки сообщения:', err)
            }
        })

        bot.on('callback_query', async msg => {
            try {
                const userId = msg.from.id
                const isAdmin = userId.toString() === adminUserId
                if (isAdmin) {
                    await handleAdminQuery(bot, msg)
                } else {
                    await handleUserQuery(bot, msg)
                }
            } catch (err) {
                console.error('Ошибка обработки callback_query:', err)
            }
        })
        bot.on('photo', async msg => {
            console.log('photo msg', msg)
            try {
                const userId = msg.from.id
                const isAdmin = userId.toString() === adminUserId
                if (isAdmin) {
                    await handleAdminMessage(bot, msg)
                }
            } catch (err) {
                console.error('Ошибка обработки photo:', err)
            }
        })
    }
    start()
    console.log('Bot is running...')
