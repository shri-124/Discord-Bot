function dateTime(msg) {
    const dateTimeObject = new Date()
    msg.reply(`The date is ${dateTimeObject.toDateString()} and the time is ${dateTimeObject.toTimeString()}`)
}

module.exports = dateTime