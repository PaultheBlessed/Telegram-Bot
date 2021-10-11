const TelegramApi = require('node-telegram-bot-api')

const { gameOptions, againOptions } = require('./options')
const token = '2080969120:AAH-Ka0Cul5Lp3xbOj3D1NxzzJJz1WdbAwY';

const bot = new TelegramApi(token, { polling: true })

const chats = {};



const startGame = async (chatId) => {
    await bot.sendMessage(chatId, "Сейчас я загадаю цифру от 0 до 9, а ты попробуй её угадать");
    const randomNumber = Math.floor(Math.random() * 10);
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, "Отгадывай", gameOptions);
}

const start = () => {
    bot.setMyCommands([
        { command: '/start', description: 'Старт' },
        { command: '/info', description: 'Получить информацию о пользователе' },
        { command: '/game', description: 'Игра: угадай цифру' },
    ])

    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;

        if (text === '/start') {
            await bot.sendMessage(chatId, 'Добро пожаловать!');
            return bot.sendSticker(chatId, 'https://cdn.tlgrm.app/stickers/4a4/f28/4a4f2880-e005-3f8f-ab47-2bb189e7d263/192/8.webp');
        };
        if (text === "/info") {
            return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name} ${msg.from.last_name}`);
        };
        if (text === "/game") {
            return startGame(chatId);
        }
        return bot.sendMessage(chatId, 'Сформулируй вопрос правильно, попробуй ещё раз.')
    })

    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if (data === '/again') {
            return startGame(chatId)
        }
        if (data == chats[chatId]) {
            return bot.sendMessage(chatId, `Поздравляю, ты отгадал цифру ${chats[chatId]}`, againOptions)
        } else {
            return bot.sendMessage(chatId, `Увы, Вы проиграли. Загаданная цифра - ${chats[chatId]}`, againOptions)
        }
    })
}

start()
// 1. В терминале: npm init -y, создаётся package.json .
// 2. Создаю .js и объявляю переменную с нужным токеном (const token = "2080969120:AAH-Ka0Cul5Lp3xbOj3D1NxzzJJz1WdbAwY").
// 3. Устанавливаю пакет: npm i node-telegram-bot-api nodemon (node-...-api для взаимодействия с api, nodemon перезагружает сервер при каждом изменении в коде).         
// 4. Импортирую установленный пакет: node-telegram-bot-api (const telegramApi = require("..").
// 5. Проверяю в package.json зависимости поставились.
// 6. Создаю скрипты (для режима разработки - с помощью nodemon запускается index.js).
// 7. Создаю скрипты (для продакшена - с помощью node.js выполняется index.js).


