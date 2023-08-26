function findUser(username, botObject) {
    return botObject.botItems.find(userBot => userBot.name === username)
}

function addUser(username, botObject) {
    let userBot = {
        name: username,
        joke: [],
        quote: [],
        fact: [],
        responding: true
    }
    botObject.botItems.push(userBot)
}

module.exports = {
    findUser,
    addUser
}