    import { fileURLToPath } from 'url';
    import path from 'path';
    import fs from 'fs/promises';

    const __filename = fileURLToPath(import.meta.url)
    const __dirname = path.dirname(__filename)
    const rootDir = path.dirname(path.dirname(__dirname))

    async function fileExists(filePath) {
        try {
            await fs.access(filePath)
            console.log('Файл существует')
            return true
        } catch {
            console.log('Файл не существует')
            return false
        }
    }
    async function handleFile(bot, msg) {
        if (!msg.photo) return
        try {
            const imagesDir = path.resolve(rootDir, 'images') // директория images
            await fs.mkdir(imagesDir, { recursive: true })

            const fileId = msg.photo[msg.photo.length - 1].file_id
            const file = await bot.getFile(fileId)
            const filePath = file.file_path


            const fileExtension = path.extname(filePath) // расширение файла
            const localFilePath = path.resolve(imagesDir, path.basename(filePath)) // путь к файлу с именем

            await bot.downloadFile(fileId, imagesDir)

            const exists = await fileExists(localFilePath)
            if (exists) {
                const uniqueFileName = `${Date.now()}_${Math.floor(Math.random() * 10000)}${fileExtension}`
                const newLocalFilePath  = path.join(imagesDir, uniqueFileName)
                await fs.rename(localFilePath, newLocalFilePath) // Переименовываем файл
                return uniqueFileName
            }
        } catch (err) {
            console.error('Ошибка обработки файла:', err)
        }
    }

    export {handleFile}