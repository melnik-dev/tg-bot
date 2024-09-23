    import {dbRun, dbGet, dbAll} from '../database.js';

    async function addPost(postDesc) {
        try {
            const  statement =  await dbRun(`INSERT INTO posts (post_desc) VALUES (?)`,
                [postDesc])
            console.log('Пост добавлен')
            return statement.lastID
        } catch (err) {
            console.error('Ошибка добавления поста:', err.message)
        }
    }
    async function updatePost(postId, postDesc) {
        try {
            const result = await dbRun(`UPDATE posts SET post_desc = ? WHERE id = ?`,
                [postDesc, postId])
            console.log('Пост изменен')
            return result
        } catch (err) {
            console.error('Ошибка изменения поста:', err.message)
        }
    }
    async function deletePost(postId) {
        try {
            await dbRun("DELETE FROM posts WHERE id = ?", [postId])
            console.log('Пост удален')
        } catch (err) {
            console.error('Ошибка удаления поста:', err.message)
        }
    }
    async function getPostByPostId(postId) {
        try {
            const row = await dbGet("SELECT * FROM posts WHERE id = ?", [postId])
            if (row) {
                console.log('Найденный пост:', row)
            } else {
                console.log('Пост не найден.')
            }
            return row
        } catch (err) {
            console.error('Ошибка при поиске поста:', err.message)
            throw err
        }
    }
    async function getAllPostsFields() {
        try {
            const rows = await dbAll("SELECT * FROM posts")
            if (rows.length === 0) {
                console.log('В базе постов не найдено.')
            } else {
                console.log('Посты в базе:')
                rows.forEach((row) => {
                    console.log(row)
                })
            }
            return rows
        } catch (err) {
            console.error('Ошибка получении постов:', err.message)
        }
    }
    async function dropPostsTable() {
        try {
            await dbRun(`DROP TABLE IF EXISTS posts`)
            console.log('Таблица "posts" успешно удалена.')
        } catch (err) {
            console.error('Ошибка удаления таблицы "posts": ', err.message)
        }
    }

    export {addPost, updatePost, deletePost, getPostByPostId, getAllPostsFields, dropPostsTable}