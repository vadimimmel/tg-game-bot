module.exports = {
  startGame: (chatId) => {
    chats[chatId] = Math.floor(Math.random() * 10)
    return bot.sendMessage(
      chatId,
      'Сейчас я загадаю цифру от 0 до 9, а ты попробуй её отгадать \u{1F60E}',
      gameOptions
    )
  },
}
