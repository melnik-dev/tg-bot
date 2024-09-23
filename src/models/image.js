    import {dbRun, dbGet, dbAll} from '../database.js'


    async function addImage(imageUrl, mediaGroupId, postId) {
        try {
            await dbRun(`INSERT INTO post_images (image_url, media_group_id, post_id) VALUES (?, ?, ?)`,
                [imageUrl, mediaGroupId, postId])
            console.log('Изображение добавлено')
        } catch (err) {
            console.error('Ошибка добавления изображения:', err.message)
        }
    }
    async function deleteImage(imageId) {
        try {
            await dbRun("DELETE FROM users WHERE post_images = ?", [imageId])
            console.log('Изображение удалено')
        } catch (err) {
            console.error('Ошибка удаления изображения:', err.message)
        }
    }
    async function getImageByMediaGroupId(mediaGroupId) {
        try {
            const row = await dbGet("SELECT * FROM post_images WHERE media_group_id = ?", [mediaGroupId])
            if (row) {
                console.log('Найденные изображения по "media_group_id":', row)
            } else {
                console.log('Изображения с "media_group_id" не найдено.')
            }
            return row
        } catch (err) {
            console.error('Ошибка при поиске "media_group_id" изображения:', err.message)
            throw err
        }
    }
    async function getImageByPostId(postId) {
        try {
            const row = await dbGet("SELECT * FROM post_images WHERE post_id = ?", [postId])
            if (row) {
                console.log('Найденные изображения по "post_id":', row)
            } else {
                console.log('Изображения с "post_id" не найдено.')
            }
            return row
        } catch (err) {
            console.error('Ошибка при поиске "post_id" изображения:', err.message)
            throw err
        }
    }
    async function getAllImagesFields() {
        try {
            const rows = await dbAll("SELECT * FROM post_images")
            if (rows.length === 0) {
                console.log('В базе фото не найдено.')
            } else {
                console.log('Фото в базе:')
                rows.forEach((row) => {
                    console.log(row)
                })
            }
            return rows
        } catch (err) {
            console.error('Ошибка получении фото:', err.message)
        }
    }
    async function dropImagesTable() {
        try {
            await dbRun(`DROP TABLE IF EXISTS post_images`)
            console.log('Таблица "post_images" успешно удалена.')
        } catch (err) {
            console.error('Ошибка удаления таблицы "post_images": ', err.message)
        }
    }

    export {addImage, deleteImage, getImageByMediaGroupId, getImageByPostId, getAllImagesFields, dropImagesTable}
