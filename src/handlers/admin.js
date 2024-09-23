    import {
    getAllUsersFields, getUserByUserId, updateUser,
} from '../models/user.js'
    import {
    getAllPostsFields, dropPostsTable, addPost, updatePost, deletePost, getPostByPostId
    } from '../models/posts.js'
    import {
    getAllImagesFields, dropImagesTable, getImageByPostId, addImage
} from '../models/image.js'
    import { fileURLToPath } from 'url';
    import path from 'path';
    import {handleFile} from "./file.js";
    import {recordPostDelivery} from "../models/postDeliveries.js";

    const __filename = fileURLToPath(import.meta.url)
    const __dirname = path.dirname(__filename)
    const rootDir = path.dirname(path.dirname(__dirname))
    const imagesDir = path.resolve(rootDir, 'images')
    async function handleAdminMessage(bot, msg) {
        const chatId = msg.chat.id
        const msgText = msg.text
        const desc = msg.caption
        try {
            if (msgText === '/start') {
                return bot.sendMessage(msg.chat.id, `Привет Админ! Отправьте пост, и я разошлю его всем или сохраню для отложенной публикации.`)
                // await dropPostsTable()
                // await dropImagesTable()
            }
            if (msgText === '/info') {
                // console.log('getAllPostsFields')
                // await getAllPostsFields()
                // console.log('getAllPostsImagesFields')
                // await getAllImagesFields()
                return bot.sendMessage(msg.chat.id, `Для создания публикации пришлите пост с картинкой или без`)
            }
            await handleCreatePost(bot, msg)
        } catch (err) {
            console.error('Ошибка при обработке сообщений админа:', err)
        }
    }
    async function handleCreatePost(bot, msg) {
        console.log(msg)
        try {
            const lastId = await addPost(msg.caption || msg.text || null)
            if (msg.photo && msg.photo.length) {
                const uniqueFileName = await handleFile(bot, msg)
                await addImage(uniqueFileName, null, lastId)
                //отправляем последний пост админу
                const image = await getImageByPostId(lastId)
                const imagePath = path.join(imagesDir, image.image_url)
                await bot.sendPhoto(msg.chat.id, imagePath, {
                    caption: msg.caption,
                    // parse_mode: 'Markdown' // разметка Markdown в подписи
                    reply_markup: JSON.stringify({
                        inline_keyboard: [
                            [{text: 'Сохранить для отложенной публикации', callback_data: 'save-post'},],
                            [
                                {text: 'Сохранить пост и отправить', callback_data: 'save-send-post'},
                                {text: 'Отправить пост не сохраняя', callback_data: 'send-post'},
                            ],
                        ]
                    })
                })
            } else {
                //отправляем последний пост админу
                return bot.sendMessage(msg.chat.id, msg.text, {
                    reply_markup: JSON.stringify({
                        inline_keyboard: [
                            [{text: 'Сохранить для отложенной публикации', callback_data: 'save-post'},],
                            [
                                {text: 'Сохранить пост и отправить', callback_data: 'save-send-post'},
                                {text: 'Отправить пост не сохраняя', callback_data: 'send-post'},
                            ],
                        ]
                    })
                })
            }
        } catch (err) {
            console.error('Ошибка при создании поста админом:', err)
        }
    }
    async function handleAdminQuery(bot, qMsg) {
        const data = qMsg.data
        const chatId = qMsg.message.chat.id
        const messageId = qMsg.message.message_id
        const posts = await getAllPostsFields()
        const lastPost = posts[posts.length - 1]
        try {
            switch (data) {
                case 'save-post':
                    await bot.sendMessage(chatId, 'Пост сохранен без публикации')
                    break
                case 'save-send-post':
                    await sendPost(bot, lastPost, true)
                    await bot.sendMessage(chatId, 'Пост сохранен и опубликован')
                    break
                case 'send-post':
                    await sendPost(bot, lastPost, false)
                    await deletePost(lastPost.id)
                    await bot.sendMessage(chatId, 'Пост опубликован без сохраненя')
                    break
            }
            await bot.editMessageReplyMarkup({ inline_keyboard: [] }, {
                chat_id: chatId,
                message_id: messageId
            })

        } catch (err) {
            console.error('Ошибка обработки callback_query админа:', err)
        }
    }
    async function sendPost(bot, lastPost, record) {
        const image = await getImageByPostId(lastPost.id)
        const imagePath = image ? path.join(imagesDir, image.image_url) : null
        const users = await getAllUsersFields()
        for (const user of users) {
            try {
                if (record) await recordPostDelivery(lastPost.id,user.id)
                if(imagePath) {
                    await bot.sendPhoto(user.chat_id, imagePath, {
                        caption: lastPost.post_desc ? lastPost.post_desc : '',
                    })
                } else {
                    await bot.sendMessage(user.chat_id, lastPost.post_desc)
                }
            } catch (e) {
                console.error(`Ошибка при отправке поста ${lastPost.id} пользователю ${user.id}:`, e)
            }
        }
    }

    export { handleAdminMessage, handleCreatePost, handleAdminQuery }
