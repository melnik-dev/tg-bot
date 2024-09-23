    import {getAllPostsFields} from "./models/posts.js";
    import {getAllUsersFields} from "./models/user.js";
    import {checkPostDelivery, recordPostDelivery} from "./models/postDeliveries.js";
    import {getImageByPostId} from "./models/image.js";
    import path from "path";
    import {fileURLToPath} from "url";
    import {bot} from "./config.js";

    const __filename = fileURLToPath(import.meta.url)
    const __dirname = path.dirname(__filename)
    const rootDir = path.dirname(path.dirname(__dirname))
    const imagesDir = path.resolve(rootDir, 'images')

    async function sendDailyMessage(bot) {
        try {
            const users = await getAllUsersFields()
            const posts = await getAllPostsFields()

            for (const post of posts) {
                const image = await getImageByPostId(post.id)
                const imagePath = image ? path.join(imagesDir, image.image_url) : null
                for (const user of users) {
                    try {
                        if (!await checkPostDelivery(post.id, user.id)) {
                            await recordPostDelivery(post.id, user.id)
                            if(imagePath) {
                                await bot.sendPhoto(user.chat_id, imagePath, {
                                    caption: post.post_desc ? post.post_desc : '',
                                })
                            } else {
                                await bot.sendMessage(user.chat_id, post.post_desc)
                            }
                        }
                    } catch (e) {
                        console.error(`Ошибка при отправке поста ${post.id} пользователю ${user.id}:`, e)
                    }
                }
            }
        } catch (e) {
            console.error("Ошибка в sendDailyMessage:", e)
        }
    }

    async function test(bot) {
        const users = await getAllUsersFields()
        const posts = await getAllPostsFields()
        for (const user of users) {
            await bot.sendMessage(user.chat_id, posts[0].post_desc)
        }
    }
    test(bot)