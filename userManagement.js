function findUser(username, botObject) {
    console.log('function 1')
    return botObject.botItems.find(userBot => userBot.name === username)
}

function addUser(username, botObject) {
    console.log('function 2')
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