    import {dbRun, dbGet, dbAll} from '../database.js'


    async function addUser(userId, chatId, userName, userNick, userPhone) {
        try {
            await dbRun(`INSERT INTO users (user_id, chat_id, name, nick, phone) VALUES (?, ?, ?, ?, ?)`,
                [String(userId), String(chatId), userName, userNick, userPhone])
            console.log('Пользователь добавлен')
        } catch (err) {
            console.error('Ошибка добавления пользователя:', err.message)
        }
    }
    async function updateUser(userId, chatId, userName, userNick, userPhone, regStage) {
        try {
            const result = await dbRun(`UPDATE users SET chat_id = ?, name = ?, nick = ?, phone = ?, reg_stage = ? WHERE user_id = ?`,
                [chatId, userName, userNick, userPhone, regStage, userId])
            console.log('Пользователь изменен')
            return result
        } catch (err) {
            console.error('Ошибка изменения пользователя:', err.message)
        }
    }
    async function deleteUser(userId) {
        try {
            await dbRun("DELETE FROM users WHERE user_id = ?", [userId])
            console.log('Пользователь удален')
        } catch (err) {
            console.error('Ошибка удаления пользователя:', err.message)
        }
    }
    async function getUserByUserId(userId) {
        try {
            const row = await dbGet("SELECT * FROM users WHERE user_id = ?", [userId])
            if (row) {
                console.log('Найденный пользователь:', row)
            } else {
                console.log('Пользователь не найден.')
            }
            return row
        } catch (err) {
            console.error('Ошибка при поиске пользователя:', err.message)
            throw err
        }
    }
    async function getAllUsersFields() {
        try {
            const rows = await dbAll("SELECT * FROM users")
            if (rows.length === 0) {
                console.log('В базе пользователей не найдено.')
            } else {
                console.log('Пользователи в базе:')
                rows.forEach((row) => {
                    console.log(row)
                })
            }
            return rows
        } catch (err) {
            console.error('Ошибка получении пользователей:', err.message)
        }
    }
    async function dropUsersTable() {
        try {
            await dbRun(`DROP TABLE IF EXISTS users`)
            console.log('Таблица "users" успешно удалена.')
        } catch (err) {
            console.error('Ошибка удаления таблицы "users":', err.message)
        }
    }


    export { getAllUsersFields, getUserByUserId, addUser, dropUsersTable, deleteUser, updateUser }
