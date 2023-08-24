// Initialize dotenv
require('dotenv').config()
const request = require('request') // To access api-ninjas

// Using mongoose to add Schema into MongoDB
const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// Discord.js versions ^14.13 require us to explicitly define client intents
const { Client, GatewayIntentBits, Message } = require('discord.js') // To access discord library
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers] })

const  objectSchema = new mongoose.Schema({
    name: String,
    list: Array,
    responding: Boolean
})

const objectModel = mongoose.model('user', objectSchema)
function findUser(username) {
    return botItems.find(userBot => userBot.name === username)
}

function addUser(username) {
    let userBot = {
        name: username,
        list: ['one fish two fish', '789'],
        responding: true
    }
    botItems.push(userBot)
}

function dateTime(msg) {
    const dateTimeObject = new Date()
    msg.reply(`The date is ${dateTimeObject.toDateString()} and the time is ${dateTimeObject.toTimeString()}`)
}

function list(msg, userBot) {
    var str = ""
    userBot.list.forEach((element) => {
        str += element + ", "
    })
    str = str.slice(0, str.length- 2)
    msg.reply(str)
}

function apiResponses(msg, typeStr) {
    var limit = 1
    request.get({
        url: `https://api.api-ninjas.com/v1/${typeStr}?limit=` + limit,
        headers: {
            'X-Api-Key': process.env.API_NINJAS_TOKEN
        },
    }, function(error, response, body) {
        if(error) return console.error('Request failed:', error)
        else if(response.statusCode != 200) return console.error('Error:', response.statusCode, body.toString('utf8'))
        else {
            var json = JSON.parse(body)
            if (typeStr === 'jokes') {
                msg.reply(json[0].joke)
            }
            else if (typeStr === 'facts') {
                msg.reply(json[0].fact)
            }
            else if (typeStr === 'quotes') {
                msg.reply(json[0].quote + ' - ' + json[0].author)
            }
        }
    });
}

// for each user have their own list of botItems
// if a new person joins the server it will add them to the array
//make bot disable or enable
let botItems = [
    {
        name: 'Shr_24',
        list: ['one fish two fish', '789'],
        responding: true
    }
]


client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`)
})

client.on('messageCreate', async msg => {
    let userBot = findUser(msg.author.username)
    if (!userBot) {
        addUser(msg.author.username)
        userBot = findUser(msg.author.username)
        objectModel.insertMany(botItems)
            .then(() => {
                console.log('Object inserted successfully')
            })
            .catch((error) => {
                console.log('Error inserting objects: ', error)
            })
    }

    if (msg.content.startsWith('responding')) {
        value = msg.content.split('responding ')[1]
        if (value.toLowerCase() === 'true') {
            userBot.responding = true
            msg.reply(`bot is open to taking responses for ${msg.author.username}`)
        }
        else if (value.toLowerCase() === 'false') {
            userBot.responding = false
            msg.reply(`${client.user} will no longer be responding`)
        }
    }

    if (userBot.responding) {
        if (msg.content.toLowerCase() === 'hello') {
            msg.reply(`Hello ${msg.author.username}, how are you doing?`)
        }
        else if (msg.content.toLowerCase() === 'time') {
            dateTime(msg)
         }
        else if (msg.content.toLowerCase() === 'joke') {
            apiResponses(msg, 'jokes')
        }
        else if (msg.content.toLowerCase() === 'fact') {
            apiResponses(msg, 'facts')
        }
        else if (msg.content === 'quote') {
            apiResponses(msg, 'quotes')
        }
        else if (msg.content.toLowerCase() === 'list') {
           list(msg, userBot)
        }
    }
})


// Log in our bot
client.login(process.env.DISCORD_BOT_TOKEN);


