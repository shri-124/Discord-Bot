function removeObjects(msg, userBot, botObject) {
    // To remove all objects in array
    if (botObject.numType === 1) {
        botObject.botItems = []
        msg.reply('All jokes, quotes, and facts removed')
    }
    //remove all jokes only
    else if (botObject.numType === 2) {
        userBot.joke = []
        msg.reply('All jokes removed')
    }
    // remove all quotes
    else if (botObject.numType === 3) {
        userBot.quote =[]
        msg.reply('All quotes removed')
    }
    // remove all facts
    else if (botObject.numType === 4) {
        userBot.fact = []
        msg.reply('All facts removed')
    }
    // remove the last joke
    else if (botObject.numType === 5) {
        userBot.joke.pop()
        msg.reply('Last joke removed')
    }
    // remove the last quote
    else if (botObject.numType === 6) {
        userBot.quote.pop()
        msg.reply('Last quote removed')
    }
    // remove the last fact
    else if (botObject.numType === 7) {
        userBot.fact.pop()
        msg.reply('Last fact removed')
    }
}

module.exports = removeObjects