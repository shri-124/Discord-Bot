function list(msg, userBot, typeStr) {
    var str = ""
    if (typeStr === 'joke') {
        userBot.joke.forEach((element) => {
            str += element + ", "
        })
    }
    else if (typeStr === 'quote') {
        userBot.quote.forEach((element) => {
            str += element + ", "
        })
    }
    else if (typeStr === 'fact') {
        userBot.fact.forEach((element) => {
            str += element + ", "
        })
    }
    str = str.slice(0, str.length- 2)
    if (!str) {
        msg.reply(`There are no ${typeStr}s you have added`)
    }
    else {
        msg.reply(str)
    }
}


function addToArray(msg, userBot, botObject) {
    if (botObject.numType === -1) {
        msg.reply('You need me to have a joke, quote, or fact said to you')
    }
    if (botObject.numType === 1) {
        userBot.joke.push(botObject.typeOfRes)
        msg.reply('Added joke to the list successfully')

    }
    else if (botObject.numType === 2) {
        userBot.quote.push(botObject.typeOfRes)
        msg.reply('Added quote to the list successfully')
    }
    else if (botObject.numType === 3) {
        userBot.fact.push(botObject.typeOfRes)
        msg.reply('Added fact to the list successfully')
    }
}

module.exports = {
    list,
    addToArray
}