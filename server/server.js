const express = require('express');
const mysql = require('mysql2');
const multer = require('multer');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs'); // Для работы с файловой системой
const path = require('path'); // Для работы с путями

const app = express();

// Подключение к базе данных MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'lager00AS',
    database: 'ankets'
});

// Подключение к базе данных
db.connect((err) => {
    if (err) {
        console.error('Ошибка подключения к базе данных:', err);
    } else {
        console.log('Успешное подключение к базе данных MySQL');
    }
});

// Настройка CORS
app.use(cors());

// Настройка body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Настройка хранилища для multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage });

// Функция для сохранения массива данных в таблицу
const insertArrayToDB = (tableName, columnName, dataArray, foreignKeyId, foreignKeyColumnName) => {
    return new Promise((resolve, reject) => {
        if (dataArray.length === 0) {
            return resolve(); // Если массив пуст, пропускаем
        }

        const values = dataArray.map(value => [value, foreignKeyId]);
        const sql = `INSERT INTO ${tableName} (${columnName}, ${foreignKeyColumnName}) VALUES ?`;

        db.query(sql, [values], (err, result) => {
            if (err) {
                console.error(`Ошибка при сохранении в таблицу ${tableName}:`, err);
                return reject(err);
            }
            resolve(result);
        });
    });
};

app.get('/search', (req, res) => {
    const name = req.query.name; // Получаем имя из параметра запроса

    if (!name) {
        return res.status(400).json({ message: 'Имя для поиска не указано' });
    }

    // SQL-запрос для поиска записи по имени
    const sql = `
        SELECT 
            full_name, 
            activity, 
            specialization, 
            zabolevanie, 
            manipulatsiya, 
            interes, 
            obrazovanie, 
            dop_obrazovanie, 
            opyt, 
            dostizhenie, 
            publikatsiya 
        FROM combined_records 
        WHERE full_name = ?
    `;

    db.query(sql, [name], (err, result) => {
        if (err) {
            console.error('Ошибка при поиске в базе данных:', err);
            return res.status(500).json({ message: 'Ошибка при поиске в базе данных' });
        }

        if (result.length === 0) {
            return res.status(404).json({ message: 'Имя не найдено' });
        }

        // Возвращаем данные первой найденной записи
        res.status(200).json(result[0]);
    });
});



app.post('/upload', upload.any(), async (req, res) => {
    console.log('Все полученные поля:', req.body);
    console.log('Все полученные файлы:', req.files);

    try {
        // Декодирование массивов из запроса
        const full_name = req.body.fullName || '';
        const activity = req.body.activity || '';
        const specializations = JSON.parse(req.body.AllSpecialization || '[]');
        const zabolevanie = JSON.parse(req.body.AllZabolev || '[]');
        const manipulatsiya = JSON.parse(req.body.AllManipul || '[]');
        const interes = JSON.parse(req.body.AllInteres || '[]');
        const obrazovanie = JSON.parse(req.body.AllObrazovanie || '[]');
        const dopObrazovanie = JSON.parse(req.body.AllObrazovanieDop || '[]');
        const opyt = JSON.parse(req.body.AllOpyt || '[]');
        const dostizhenie = JSON.parse(req.body.AllDost || '[]');
        const publikatsiya = JSON.parse(req.body.AllPubl || '[]');

        // Генерация уникального идентификатора для пользователя
        const userId = Date.now();


        // Создаем папку на основе ФИО пользователя
        const sanitizedFullName = full_name.replace(/\s+/g, '_'); // Заменяем пробелы на подчеркивания
        const userFolder = path.join('uploads', sanitizedFullName);

        // Проверяем, существует ли уже папка, если нет — создаем
        if (!fs.existsSync(userFolder)) {
            fs.mkdirSync(userFolder, { recursive: true }); // Создаем директорию рекурсивно
        }


        // Создание HTML-содержимого
        const htmlContent = `
            <!DOCTYPE html>
            <html lang="ru">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Анкета пользователя ${userId}</title>
            </head>
            <body>
                
                <h2 class="tableOfContents">Специализация и профессиональные навыки врача</h2>
                <div class="bg_white">
                    <ul>
                        ${specializations.map(spec => `<li>${spec};</li>`).join('')}
                    </ul>
                </div>

                <h2 class="tableOfContents">Заболевания, которые лечит врач</h2>
                <div class="bg_white">
                    <ul>
                        ${zabolevanie.map(zab => `<li>${zab};</li>`).join('')}
                    </ul>
                </div>
                
                
                <h2 class="tableOfContents">Манипуляции, которые проводит врач</h2>
                <div class="bg_white">
                    <ul>
                        ${manipulatsiya.map(man => `<li>${man};</li>`).join('')}
                    </ul>
                </div>


                <h2 class="tableOfContents">Манипуляции, которые проводит врач</h2>
                <h2>Интересы</h2>
                <ul>
                    ${interes.map(inter => `<li>${inter};</li>`).join('')}
                </ul>


                <h2 class="tableOfContents">Образование и профессиональная переподготовка</h2>
                
                <div class="bg_white">
                    <ul>
                        ${obrazovanie.map(obr => `<li>${obr};</li>`).join('')}
                    </ul>
                    
                    <p><span class="bold">Дополнительное образование</span></p>
                    <ul>
                        ${dopObrazovanie.map(dop => `<li>${dop};</li>`).join('')}
                    </ul>
                    
                    
                </div>
                
                

                <h2 class="tableOfContents">Опыт работы</h2>

                <div class="bg_white">
                
                    <ul>
                        ${opyt.map(op => `<li>${op};</li>`).join('')}
                    </ul>
                
                </div>
                
                
                <h2 class="tableOfContents">Профессиональное развитие и достижения</h2>

                <div class="bg_white">
                
                    <ul>
                        ${dostizhenie.map(dost => `<li>${dost};</li>`).join('')}
                    </ul>
                
                </div>
                

                <h2 class="tableOfContents">Публикации</h2>
                
                <div class="bg_white">
                
                    <ul>
                        ${publikatsiya.map(publ => `<li>${publ};</li>`).join('')}
                    </ul>
                
                </div>

                
            </body>
            </html>
        `;

        // Путь к сохранению HTML-файла
        const filePath = path.join(userFolder, `${full_name}.html`);



        // Формирование данных для вставки
        const filesData = req.files.map(file => {
            const newFilePath = path.join(userFolder, file.filename); // Новый путь для файла
            fs.renameSync(file.path, newFilePath); // Перемещаем файл в новую папку

            return [
                file.filename,
                file.path,
                userId,
                full_name,
                activity,
                specializations.join(', '),
                zabolevanie.join(', '),
                manipulatsiya.join(', '),
                interes.join(', '),
                obrazovanie.join(', '),
                dopObrazovanie.join(', '),
                opyt.join(', '),
                dostizhenie.join(', '),
                publikatsiya.join(', ')
            ]
        });

        const sqlFiles = `
            INSERT INTO combined_records (
                filename, filepath, user_id, full_name, activity,
                specialization, zabolevanie, manipulatsiya, interes, 
                obrazovanie, dop_obrazovanie, opyt, dostizhenie, publikatsiya
            ) VALUES ?
        `;

        // Сохранение HTML-файла
        fs.writeFile(filePath, htmlContent, (err) => {
            if (err) {
                console.error('Ошибка при сохранении HTML-файла:', err);
                return res.status(500).json({ message: 'Ошибка при сохранении HTML-файла' });
            }

            console.log('HTML-файл успешно сохранен:', filePath);

            // Вставка данных в базу данных после успешного сохранения HTML
            db.query(sqlFiles, [filesData], (err, result) => {
                if (err) {
                    console.error('Ошибка при сохранении данных в таблицу combined_records:', err);
                    return res.status(500).json({ message: 'Ошибка при сохранении данных в базу данных' });
                }

                console.log('Данные успешно сохранены в таблицу combined_records:', result);
                console.log('Найденные данные:', result[0]); // Логирование найденных данных
                // Отправляем успешный ответ после сохранения файлов и данных
                res.status(200).json({ message: 'Файлы и данные успешно сохранены в базе данных и HTML-файл создан' });
            });
        });
    } catch (err) {
        console.error('Ошибка при обработке данных:', err);
        res.status(500).json({ message: 'Ошибка при обработке данных' });
    }
});



// Запуск сервера
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});
