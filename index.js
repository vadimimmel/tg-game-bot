require('dotenv').config()
const TelegramApi = require('node-telegram-bot-api')

const { gameOptions, againOptions } = require('./options')
const { startGame } = require('./start-game')

const token = process.env.BOT_TOKEN

const bot = new TelegramApi(token, { polling: true })

const chats = {}

const start = () => {
  bot.setMyCommands([
    { command: '/start', description: 'Начальное приветсвие' },
    { command: '/info', description: 'Получение информации о пользователе' },
    { command: '/game', description: 'Запуск игры' },
  ])

  bot.on('message', async (msg) => {
    console.log(msg)
    const {
      text,
      from: {
        first_name: firstName,
        id,
        is_bot: isBot,
        last_name: lastName,
        username,
        language_code: lang,
      },
      chat: { id: chatId },
    } = msg

    if (text === '/start') {
      if (id === 1640145711) {
        await bot.sendMessage(chatId, `Рад тебя тут видеть, Супер-Заинька!`)
        return bot.sendSticker(
          chatId,
          'https://bestoftelegram.com/static/animated-stickers/img/TomToodles/TomToodles18.webp'
        )
      }

      return bot.sendMessage(chatId, `Приветствую тебя, ${firstName}!`)
    }

    if (text === '/info') {
      return bot.sendMessage(
        chatId,
        `Бот или человек: ${
          isBot ? 'Бот' : 'Человек'
        }\nИмя: ${firstName}\nФамилия: ${lastName}\nИмя пользователя: ${username}\nЯзык: ${lang}\nID: ${id}
      `
      )
    }

    if (text === '/game') {
      return startGame(chatId)
    }
  })

  bot.on('callback_query', (msg) => {
    console.log(msg)
    const {
      data,
      message: {
        chat: { id: chatId },
      },
    } = msg

    if (data === '/again') return startGame(chatId)

    if (chats[chatId] == data) {
      return bot.sendMessage(
        chatId,
        `Выбрана цифра ${data} и это правильный ответ! Прими мои поздравления \u{1F973}`,
        againOptions
      )
    } else {
      return bot.sendMessage(
        chatId,
        `Выбрана цифра ${data} и тайное осталось скрытым \u{1F60E}`,
        gameOptions
      )
    }
  })
}

start()
