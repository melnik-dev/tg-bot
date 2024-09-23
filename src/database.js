    import sqlite3 from 'sqlite3'
    import {databasePath} from './config.js'

    sqlite3.verbose()
    const db = new sqlite3.Database(databasePath, (err)=>{
        if (err) {
            console.error(err.message)
        }
        console.log('База подключена.')

        // Добавление нового поля regStage с значением по умолчанию 'askName'
        // db.run(`ALTER TABLE users ADD COLUMN regStage TEXT DEFAULT 'askName'`, (err) => {
        //     if (err) {
        //         console.error('Ошибка при добавлении нового поля:', err.message)
        //     } else {
        //         console.log('Новое поле "regStage" добавлено.')
        //     }
        // })
    })

    // Обертка SQLite в промисы
    function dbRun(sql, params = []) {
        return new Promise((resolve, reject) => {
            db.run(sql, params, function (err) {
                if (err) {
                    reject(err)
                } else {
                    resolve(this)
                }
            })
        })
    }
    function dbGet(sql, params = []) {
        return new Promise((resolve, reject) => {
            db.get(sql, params, (err, row) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(row)
                }
            })
        })
    }
    function dbAll(sql, params = []) {
        return new Promise((resolve, reject) => {
            db.all(sql, params, (err, rows) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(rows)
                }
            })
        })
    }

    // Создание таблицы users
    db.serialize(() => {
        db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT UNIQUE,
        chat_id TEXT UNIQUE,
        name TEXT,
        nick TEXT,
        phone TEXT,
        reg_stage TEXT DEFAULT 'askName'
      )`, (err)=> {
            if (err) {
                console.error(err.message)
            } else {
                console.log('Таблица "users" готова.')
            }
        })

    // Создание таблицы posts
    db.run(`CREATE TABLE IF NOT EXISTS posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        post_desc TEXT,
        created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
        if (err) {
            console.error(err.message)
        } else {
            console.log('Таблица "posts" готова.')
        }
    })
    // Создание таблицы post_images
    db.run(`CREATE TABLE IF NOT EXISTS post_images (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            image_url TEXT,
            media_group_id TEXT,
            post_id INTEGER,
            FOREIGN KEY (post_id) REFERENCES posts (id) ON DELETE CASCADE
        )`, (err)=>{
        if (err) {
            console.error(err.message)
        } else {
            console.log('Таблица "post_images" готова.')
        }
    })
    // Создание таблицы post_deliveries
    db.run(`CREATE TABLE IF NOT EXISTS post_deliveries (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            delivered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            user_id INTEGER,
            post_id INTEGER,
            FOREIGN KEY (user_id) REFERENCES users(id),
            FOREIGN KEY (post_id) REFERENCES posts(id)
        )`, (err) => {
        if (err) {
            console.error(err.message)
        } else {
            console.log('Таблица "post_deliveries" готова.')
        }
    })
    })
    async function getAllTable() {
        try {
            const tables = await dbAll("SELECT name FROM sqlite_master WHERE type='table'")
            if (tables.length === 0) {
                console.log('Таблиц не найдено.')
            } else {
                console.log('Таблицы в базе:')
                tables.forEach((table) => {
                    console.log(table.name)
                })
            }
        } catch (err) {
            console.error('Ошибка запроса:', err.message)
        }
    }
    export {db, dbRun, dbGet, dbAll, getAllTable}

