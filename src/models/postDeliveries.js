    import {dbRun, dbGet} from '../database.js'

    async function checkPostDelivery(postId, userId) {
        try {
            const row = await dbGet("SELECT * FROM post_deliveries WHERE post_id = ? AND user_id = ?", [postId, userId])
            if (row) {
                console.log('Запись найдена:', row)
            } else {
                console.log('Запись не найдена.')
            }
            return !!row
        } catch (err) {
            console.error('Ошибка при поиске записи:', err.message)
            throw err
        }
    }
    async function recordPostDelivery(postId, userId) {
        try {
            await dbRun("INSERT INTO post_deliveries (post_id, user_id) VALUES (?, ?)",[postId, userId])
            console.log(`Запись с id  поста: ${postId} и id пользователя: ${userId} успешно выполнена.`)
        } catch (err) {
            console.error('Ошибка записи о доставке поста:', err.message)
        }
    }

    export { checkPostDelivery, recordPostDelivery}