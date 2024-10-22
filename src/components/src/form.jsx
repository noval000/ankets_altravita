import React, { useState } from 'react';
import {PlusOutlined, UploadOutlined} from '@ant-design/icons';
import './form.css';
import {
    Button,
    DatePicker,
    Form,
    Input,
    message,
    Upload,
} from 'antd';

const { RangePicker } = DatePicker;
const { TextArea } = Input;
const normFile = (e) => {
    if (Array.isArray(e)) {
        return e;
    }
    return e?.fileList;
};

const onFinish = (AllSpecialization) => {

};
const onFinishFailed = (errorInfo) => {

};



const FormAnketa = () => {


    const [searchName, setSearchName] = useState(''); // Для поиска имени

    const handleSearchChange = (e) => {
        setSearchName(e.target.value); // Обновляем значение поиска
    };

    // Функция для поиска по имени
    const handleSearch = async () => {
        try {
            const response = await fetch(`http://localhost:5000/search?name=${searchName}`);
            if (response.ok) {
                const data = await response.json();

                // Заполняем поля формы данными из базы данных
                setFullName(data.full_name);
                setActivity(data.activity);
                console.log(data)
                // Разбиваем строки на массивы по запятой
                setAllSpecialization(data.specialization ? data.specialization.split(',') : []);
                setAllZabolev(data.zabolevanie ? data.zabolevanie.split(',') : []);
                setAllManipul(data.manipulatsiya ? data.manipulatsiya.split(',') : []);
                setAllInteres(data.interes ? data.interes.split(',') : []);
                setAllObrazovanie(data.obrazovanie ? data.obrazovanie.split(',') : []);
                setAllObrazovanieDop(data.dop_obrazovanie ? data.dop_obrazovanie.split(',') : []);
                setAllOpyt(data.opyt ? data.opyt.split(',') : []);
                setAllDost(data.dostizhenie ? data.dostizhenie.split(',') : []);
                setAllPubl(data.publikatsiya ? data.publikatsiya.split(',') : []);
            } else {
                message.error('Имя не найдено в базе данных');
            }
        } catch (error) {
            message.error('Ошибка при поиске данных');
        }
    };


    const [fullName, setFullName] = useState(''); // ФИО
    const [activity, setActivity] = useState(''); // О врачебной деятельности

    // Обработчик для изменения значений фио и врачебной деятельности
    const handleFullNameChange = (e) => {
        setFullName(e.target.value);
    };

    const handleActivityChange = (e) => {
        setActivity(e.target.value);
    };

    const [valueSpecialization, setValueSpecialization] = useState('') //  инпут для специализаций и проф навыков
    const [AllSpecialization, setAllSpecialization] = useState([]);

    const [valueZabolev, setValueZabolev] = useState('') //  инпут для заболеваний
    const [AllZabolev, setAllZabolev] = useState([]);

    const [valueManipul, setValueManipul] = useState('') //  инпут для манипуляций
    const [AllManipul, setAllManipul] = useState([]);

    const [valueInteres, setValueInteres] = useState('') //  инпут для интересов
    const [AllInteres, setAllInteres] = useState([]);

    const [valueObrazovanie, setValueObrazovanie] = useState('') //  инпут для образования
    const [AllObrazovanie, setAllObrazovanie] = useState([]);

    const [valueObrazovanieDop, setValueObrazovanieDop] = useState('') //  инпут для последипломного образования
    const [AllObrazovanieDop, setAllObrazovanieDop] = useState([]);

    const [valueOpyt, setValueOpyt] = useState('') //  инпут для опыта работы
    const [AllOpyt, setAllOpyt] = useState([]);

    const [valueDost, setValueDost] = useState('') //  инпут для достижений
    const [AllDost, setAllDost] = useState([]);

    const [valuePubl, setValuePubl] = useState('') //  инпут для публикаций
    const [AllPubl, setAllPubl] = useState([]);

    const [fileList, setFileList] = useState([]);

    // Функция для обработки изменения файлов
    const handleChange = ({ fileList }) => {
        setFileList(fileList); // Обновляем fileList в состоянии
    };

    const handleUpload = async () => {
        // Проверка наличия файлов перед началом загрузки
        if (fileList.length === 0) {
            return message.error('Выберите хотя бы один файл для загрузки');
        }

        // Создание нового экземпляра FormData
        const formData = new FormData();

        // Логирование данных перед добавлением в formData
        console.log('Добавляемые данные:', {
            fullName,
            activity,
            AllSpecialization,
            AllZabolev,
            AllManipul,
            AllInteres,
            AllObrazovanie,
            AllObrazovanieDop,
            AllOpyt,
            AllDost,
            AllPubl
        });

        // Добавление массивов в formData
        formData.append('fullName', fullName); // Добавляем ФИО
        formData.append('activity', activity); // Добавляем описание деятельности
        formData.append('AllSpecialization', JSON.stringify(AllSpecialization));
        formData.append('AllZabolev', JSON.stringify(AllZabolev));
        formData.append('AllManipul', JSON.stringify(AllManipul));
        formData.append('AllInteres', JSON.stringify(AllInteres));
        formData.append('AllObrazovanie', JSON.stringify(AllObrazovanie));
        formData.append('AllObrazovanieDop', JSON.stringify(AllObrazovanieDop));
        formData.append('AllOpyt', JSON.stringify(AllOpyt));
        formData.append('AllDost', JSON.stringify(AllDost));
        formData.append('AllPubl', JSON.stringify(AllPubl));



        // Добавление файлов в formData
        fileList.forEach((file, index) => {
            formData.append(`file${index + 1}`, file.originFileObj); // Используем уникальные ключи
        });

        // Логирование содержимого formData для отладки
        for (const pair of formData.entries()) {
            if (pair[1] instanceof File) {
                console.log(`${pair[0]}: ${pair[1].name}, size: ${pair[1].size}, type: ${pair[1].type}`);
            } else {
                console.log(`${pair[0]}: ${pair[1]}`);
            }
        }


        // Отправка данных на сервер
        try {
            const response = await fetch('http://localhost:5000/upload', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                message.success('Файлы успешно загружены');
                setFileList([]); // Очистка списка файлов после успешной загрузки
            } else {
                const errorText = await response.text();
                message.error(`Ошибка при загрузке файлов: ${errorText}`);
            }
        } catch (error) {
            message.error('Сбой сети при загрузке');
        }
    };




    // Функция для удаления специализации из списка
    const removeSpecialization = (index) => {
        const updatedSpecialization = AllSpecialization.filter((_, i) => i !== index);
        setAllSpecialization(updatedSpecialization);
    };

    // Функция для удаления заболеваний из списка
    const removeZabolev = (index) => {
        const updatedSpecialization = AllZabolev.filter((_, i) => i !== index);
        setAllZabolev(updatedSpecialization);
    };

    // Функция для удаления манипуляций из списка
    const removeInteres = (index) => {
        const updatedSpecialization = AllInteres.filter((_, i) => i !== index);
        setAllInteres(updatedSpecialization);
    };

    // Функция для удаления интересов из списка
    const removeObrazovanie = (index) => {
        const updatedSpecialization = AllObrazovanie.filter((_, i) => i !== index);
        setAllObrazovanie(updatedSpecialization);
    };

    // Функция для удаления образования из списка
    const removeManipul = (index) => {
        const updatedSpecialization = AllManipul.filter((_, i) => i !== index);
        setAllManipul(updatedSpecialization);
    };

    // Функция для удаления образования из списка
    const removeObrazovanieDop = (index) => {
        const updatedSpecialization = AllObrazovanieDop.filter((_, i) => i !== index);
        setAllObrazovanieDop(updatedSpecialization);
    };

    // Функция для удаления образования из списка
    const removeOpyt = (index) => {
        const updatedSpecialization = AllOpyt.filter((_, i) => i !== index);
        setAllOpyt(updatedSpecialization);
    };

    // Функция для удаления достижений из списка
    const removeDost = (index) => {
        const updatedSpecialization = AllDost.filter((_, i) => i !== index);
        setAllDost(updatedSpecialization);
    };

    // Функция для удаления публикаций из списка
    const removePubl = (index) => {
        const updatedSpecialization = AllPubl.filter((_, i) => i !== index);
        setAllPubl(updatedSpecialization);
    };



    return (
        <div className="form_anketa">
            <div className="search_btn">
                {/* Поле для поиска имени */}
                <Input
                    style={{ justifyContent: 'center' }}
                    placeholder="Введите имя для поиска"
                    value={searchName}
                    onChange={handleSearchChange}
                />
                <Button onClick={handleSearch}>Поиск</Button>
            </div>
            <div className="title_anketa">
                <p>Анкета врача</p>
            </div>
            <Form
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                layout="horizontal"
                style={{
                    maxWidth: '100%',
                }}
            >
                <Form.Item>
                    <Input
                        style={{
                            justifyContent:'center'
                        }}
                        value={fullName} // Привязываем к состоянию
                        onChange={handleFullNameChange} // Обработчик изменения
                        placeholder="ФИО полностью (обязательно)"/>
                </Form.Item>
                <Form.Item>
                    <Input
                        style={{
                            justifyContent:'center'
                        }}
                        value={activity} // Привязываем к состоянию
                        onChange={handleActivityChange} // Обработчик изменения
                        placeholder="Коротко о врачебной деятельности"/>
                    {/*<Select>*/}
                    {/*    <Select.Option value="demo">Demo</Select.Option>*/}
                    {/*</Select>*/}
                </Form.Item>
                <Form.Item>
                    <div style={{
                        display:'flex'
                    }}>
                        <Input
                            placeholder="Специализация и профессиональные навыки"
                            value={valueSpecialization}
                            onChange={(e) => setValueSpecialization(e.target.value)}
                        />
                        <Button
                            onClick={() => {
                                if (valueSpecialization.trim() !== '') {
                                    setAllSpecialization([...AllSpecialization, valueSpecialization]); // Добавляем новое значение в список
                                    setValueSpecialization(''); // Очищаем поле ввода после добавления
                                }
                            }}
                        >Добавить</Button>
                    </div>
                    {
                        AllSpecialization.map((el, index) => (
                            <ul>
                                <li
                                    key={index}
                                    style={{
                                    textAlign:'start'
                                }}>
                                    {el}
                                    <Button
                                        type="link"
                                        danger
                                        onClick={() => removeSpecialization(index)} // Удаляем элемент при нажатии
                                    >
                                        Удалить
                                    </Button>
                                </li>
                            </ul>
                        ))
                    }
                </Form.Item>
                <Form.Item>
                    <div style={{
                        display:'flex'
                    }}>
                        <Input
                            placeholder="Заболевания, которые лечите"
                            value={valueZabolev}
                            onChange={(e) => setValueZabolev(e.target.value)}
                        />
                        <Button
                            onClick={() => {
                                if (valueZabolev.trim() !== '') {
                                    setAllZabolev([...AllZabolev, valueZabolev]); // Добавляем новое значение в список
                                    setValueZabolev(''); // Очищаем поле ввода после добавления
                                }
                            }}
                        >Добавить</Button>
                    </div>
                    {
                        AllZabolev.map((el, index) => (
                            <ul>
                                <li
                                    key={index}
                                    style={{
                                        textAlign:'start'
                                    }}>
                                    {el}
                                    <Button
                                        type="link"
                                        danger
                                        onClick={() => removeZabolev(index)} // Удаляем элемент при нажатии
                                    >
                                        Удалить
                                    </Button>
                                </li>
                            </ul>
                        ))
                    }
                </Form.Item>
                <Form.Item>
                    <div style={{
                        display:'flex'
                    }}>
                        <Input
                            placeholder="Манипуляции, которые проводите"
                            value={valueManipul}
                            onChange={(e) => setValueManipul(e.target.value)}
                        />
                        <Button
                            onClick={() => {
                                if (valueManipul.trim() !== '') {
                                    setAllManipul([...AllManipul, valueManipul]); // Добавляем новое значение в список
                                    setValueManipul(''); // Очищаем поле ввода после добавления
                                }
                            }}
                        >Добавить</Button>
                    </div>
                    {
                        AllManipul.map((el, index) => (
                            <ul>
                                <li
                                    key={index}
                                    style={{
                                        textAlign:'start'
                                    }}>
                                    {el}
                                    <Button
                                        type="link"
                                        danger
                                        onClick={() => removeManipul(index)} // Удаляем элемент при нажатии
                                    >
                                        Удалить
                                    </Button>
                                </li>
                            </ul>
                        ))
                    }
                </Form.Item>
                <Form.Item>
                    <Input
                        style={{
                            justifyContent:'center'
                        }}
                        placeholder="Должность в клинике"/>
                </Form.Item>
                <Form.Item>
                    <div style={{
                        display:'flex'
                    }}>
                        <Input
                            style={{
                                justifyContent:'center'
                            }}
                            placeholder="Ученая степень"/>
                        <Input
                            style={{
                                justifyContent:'center'
                            }}
                            placeholder="Стаж работы"/>
                    </div>
                </Form.Item>
                <div className="osob_interes">
                    <p style={{
                        fontWeight: 'bold',
                        fontSize:'20px',
                        textAlign:'start'
                    }}>Область особых интересов</p>
                    <p style={{
                        textAlign:'start'
                    }}>Добавить отдельным пунктом интересы для карточки в общем списке врачей на сайте.</p>
                </div>
                <Form.Item>
                    <div style={{
                        display:'flex'
                    }}>
                        <Input
                            placeholder="Введите информацию"
                            value={valueInteres}
                            onChange={(e) => setValueInteres(e.target.value)}
                        />
                        <Button
                            onClick={() => {
                                if (valueInteres.trim() !== '') {
                                    setAllInteres([...AllInteres, valueInteres]); // Добавляем новое значение в список
                                    setValueInteres(''); // Очищаем поле ввода после добавления
                                }
                            }}
                        >Добавить</Button>
                    </div>
                    {
                        AllInteres.map((el, index) => (
                            <ul>
                                <li
                                    key={index}
                                    style={{
                                        textAlign:'start'
                                    }}>
                                    {el}
                                    <Button
                                        type="link"
                                        danger
                                        onClick={() => removeInteres(index)} // Удаляем элемент при нажатии
                                    >
                                        Удалить
                                    </Button>
                                </li>
                            </ul>
                        ))
                    }
                </Form.Item>
                <div className="osob_interes">
                    <p style={{
                        fontWeight: 'bold',
                        fontSize:'20px',
                        textAlign:'start'
                    }}>Образование</p>
                    <p style={{
                        textAlign:'start'
                    }}>Расписать по годам, например: 2001 — Российский национальный исследовательский медицинский университет им. Н.И. Пирогова, Москва. Лечебный факультет, Лечебное дело.</p>
                </div>
                <Form.Item>
                    <div style={{
                        display:'flex'
                    }}>
                        <Input
                            placeholder="Введите информацию"
                            value={valueObrazovanie}
                            onChange={(e) => setValueObrazovanie(e.target.value)}
                        />
                        <Button
                            onClick={() => {
                                if (valueObrazovanie.trim() !== '') {
                                    setAllObrazovanie([...AllObrazovanie, valueObrazovanie]); // Добавляем новое значение в список
                                    setValueObrazovanie(''); // Очищаем поле ввода после добавления
                                }
                            }}
                        >Добавить</Button>
                    </div>
                    {
                        AllObrazovanie.map((el, index) => (
                            <ul>
                                <li
                                    key={index}
                                    style={{
                                        textAlign:'start'
                                    }}>
                                    {el}
                                    <Button
                                        type="link"
                                        danger
                                        onClick={() => removeObrazovanie(index)} // Удаляем элемент при нажатии
                                    >
                                        Удалить
                                    </Button>
                                </li>
                            </ul>
                        ))
                    }
                </Form.Item>
                <div className="osob_interes">
                    <p style={{
                        fontWeight: 'bold',
                        fontSize:'20px',
                        textAlign:'start'
                    }}>Последипломное образование</p>
                    <p style={{
                        textAlign:'start'
                    }}>Расписать по годам, например: 2009 — Курсы первичного перепрофилирования по УЗ-диагностике. ФМБА, Врач УЗИ.</p>
                </div>
                <Form.Item>
                    <div style={{
                        display:'flex'
                    }}>
                        <Input
                            placeholder="Введите информацию"
                            value={valueObrazovanieDop}
                            onChange={(e) => setValueObrazovanieDop(e.target.value)}
                        />
                        <Button
                            onClick={() => {
                                if (valueObrazovanieDop.trim() !== '') {
                                    setAllObrazovanieDop([...AllObrazovanieDop, valueObrazovanieDop]); // Добавляем новое значение в список
                                    setValueObrazovanieDop(''); // Очищаем поле ввода после добавления
                                }
                            }}
                        >Добавить</Button>
                    </div>
                    {
                        AllObrazovanieDop.map((el, index) => (
                            <ul>
                                <li
                                    key={index}
                                    style={{
                                        textAlign:'start'
                                    }}>
                                    {el}
                                    <Button
                                        type="link"
                                        danger
                                        onClick={() => removeObrazovanieDop(index)} // Удаляем элемент при нажатии
                                    >
                                        Удалить
                                    </Button>
                                </li>
                            </ul>
                        ))
                    }
                </Form.Item>
                <div className="osob_interes">
                    <p style={{
                        fontWeight: 'bold',
                        fontSize:'20px',
                        textAlign:'start'
                    }}>Опыт работы</p>
                    <p style={{
                        textAlign:'start'
                    }}>Расписать по годам, например: 2015-2020 —  Главный врач ГБУЗ СК «Нефтекумская РБ»</p>
                </div>
                <Form.Item>
                    <div style={{
                        display:'flex'
                    }}>
                        <Input
                            placeholder="Введите информацию"
                            value={valueOpyt}
                            onChange={(e) => setValueOpyt(e.target.value)}
                        />
                        <Button
                            onClick={() => {
                                if (valueOpyt.trim() !== '') {
                                    setAllOpyt([...AllOpyt, valueOpyt]); // Добавляем новое значение в список
                                    setValueOpyt(''); // Очищаем поле ввода после добавления
                                }
                            }}
                        >Добавить</Button>
                    </div>
                    {
                        AllOpyt.map((el, index) => (
                            <ul>
                                <li
                                    key={index}
                                    style={{
                                        textAlign:'start'
                                    }}>
                                    {el}
                                    <Button
                                        type="link"
                                        danger
                                        onClick={() => removeOpyt(index)} // Удаляем элемент при нажатии
                                    >
                                        Удалить
                                    </Button>
                                </li>
                            </ul>
                        ))
                    }
                </Form.Item>
                <div className="osob_interes">
                    <p style={{
                        fontWeight: 'bold',
                        fontSize:'20px',
                        textAlign:'start'
                    }}>Профессиональное развитие и достижения</p>
                    <p style={{
                        textAlign:'start'
                    }}>Расписать по годам, в каких конференциях участвовали? в каких ассоциация врачей состоите? в каких мероприятиях участвовали?</p>
                </div>
                <Form.Item>
                    <div style={{
                        display:'flex'
                    }}>
                        <Input
                            placeholder="Введите информацию"
                            value={valueDost}
                            onChange={(e) => setValueDost(e.target.value)}
                        />
                        <Button
                            onClick={() => {
                                if (valueDost.trim() !== '') {
                                    setAllDost([...AllDost, valueDost]); // Добавляем новое значение в список
                                    setValueDost(''); // Очищаем поле ввода после добавления
                                }
                            }}
                        >Добавить</Button>
                    </div>
                    {
                        AllDost.map((el, index) => (
                            <ul>
                                <li
                                    key={index}
                                    style={{
                                        textAlign:'start'
                                    }}>
                                    {el}
                                    <Button
                                        type="link"
                                        danger
                                        onClick={() => removeDost(index)} // Удаляем элемент при нажатии
                                    >
                                        Удалить
                                    </Button>
                                </li>
                            </ul>
                        ))
                    }
                </Form.Item>
                <div className="osob_interes">
                    <p style={{
                        fontWeight: 'bold',
                        fontSize:'20px',
                        textAlign:'start'
                    }}>Список публикаций</p>
                </div>
                <Form.Item>
                    <div style={{
                        display:'flex'
                    }}>
                        <Input
                            placeholder="Введите информацию"
                            value={valuePubl}
                            onChange={(e) => setValuePubl(e.target.value)}
                        />
                        <Button
                            onClick={() => {
                                if (valuePubl.trim() !== '') {
                                    setAllPubl([...AllPubl, valuePubl]); // Добавляем новое значение в список
                                    setValuePubl(''); // Очищаем поле ввода после добавления
                                }
                            }}
                        >Добавить</Button>
                    </div>
                    {
                        AllPubl.map((el, index) => (
                            <ul>
                                <li
                                    key={index}
                                    style={{
                                        textAlign:'start'
                                    }}>
                                    {el}
                                    <Button
                                        type="link"
                                        danger
                                        onClick={() => removePubl(index)} // Удаляем элемент при нажатии
                                    >
                                        Удалить
                                    </Button>
                                </li>
                            </ul>
                        ))
                    }
                </Form.Item>
                <div className="osob_interes">
                    <p style={{
                        fontWeight: 'bold',
                        fontSize:'20px',
                        textAlign:'start'
                    }}>Сканы дипломов и сертификатов</p>
                    <p style={{
                        textAlign:'start'
                    }}>Прикрепить сканы, если есть. Или принести оригиналы в IT отдел для сканирования и обратиться к Новикову Алексею (204 кабинет)</p>
                </div>
                <Form.Item valuePropName="fileList" getValueFromEvent={normFile}>
                    <Upload
                        onChange={handleChange}
                        listType="picture-card"
                        fileList={fileList} // Привязываем fileList к состоянию
                    >
                        <button
                            style={{
                                border: 0,
                                background: 'none',
                            }}
                            type="button"
                        >
                            <PlusOutlined />
                            <div
                                style={{
                                    marginTop: 8,
                                }}
                            >
                                Загрузить
                            </div>
                        </button>
                    </Upload>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" onClick={handleUpload}>
                        Отправить
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};
export default FormAnketa;