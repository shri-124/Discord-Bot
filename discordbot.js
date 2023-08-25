require('dotenv').config() // Initialize dotenv
const request = require('request') // To access api-ninjas
const mongoose = require('mongoose') // Using mongoose to add Schema into MongoDB
const { Client, GatewayIntentBits, Message } = require('discord.js') // To access discord library
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent/*, GatewayIntentBits.GuildMembers*/] })// Discord.js versions ^14.13 require us to explicitly define client intents

// Global variables
var typeOfRes = ""
var numType = -1
let botItems = []


const  objectSchema = new mongoose.Schema({
    name: String,
    joke: Array,
    quote: Array,
    fact: Array,
    responding: Boolean
})

const objectModel = mongoose.model('user', objectSchema)
async function retreiveAndDeleteDocuments() {
    try {
      await mongoose.connect(process.env.DATABASE_URI, { useNewUrlParser: true, useUnifiedTopology: true })
      //const YourModel = mongoose.model('user', objectSchema);
      //var documents = await YourModel.find({});
      var documents = await objectModel.find({})
      console.log('Retrieved documents:', documents)
      botItems = documents
      console.log('bot array: ', botItems)
      //documents = await YourModel.deleteMany({})
      documents = await objectModel.deleteMany({})
      console.log('Documents after deletion: ', documents)


      //mongoose.disconnect();
    } catch (err) {
      console.error('Error:', err);
    }
}


function findUser(username) {
    return botItems.find(userBot => userBot.name === username)
}

function addUser(username) {
    let userBot = {
        name: username,
        joke: [],
        quote: [],
        fact: [],
        responding: true
    }
    botItems.push(userBot)
}

function dateTime(msg) {
    const dateTimeObject = new Date()
    msg.reply(`The date is ${dateTimeObject.toDateString()} and the time is ${dateTimeObject.toTimeString()}`)
}

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
    msg.reply(str)
}

function addToArray(msg, userBot, numType, typeOfRes) {
    if (numType === -1) {
        msg.reply('You need me to have a joke, quote, or fact said to you')
    }
    if (numType === 1) {
        userBot.joke.push(typeOfRes)
        msg.reply('Added joke to the list successfully')

    }
    else if (numType === 2) {
        userBot.quote.push(typeOfRes)
        msg.reply('Added quote to the list successfully')
    }
    else if (numType === 3) {
        userBot.fact.push(typeOfRes)
        msg.reply('Added fact to the list successfully')
    }
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
                typeOfRes = json[0].joke
                msg.reply(json[0].joke)
            }
            else if (typeStr === 'facts') {
                typeOfRes = json[0].fact
                msg.reply(json[0].fact)
            }
            else if (typeStr === 'quotes') {
                typeOfRes = json[0].quote + ' - ' + json[0].author
                msg.reply(json[0].quote + ' - ' + json[0].author)
            }
        }
    });
}

function clientApp() {
    client.on('ready', () => {
        console.log(`Logged in as ${client.user.tag}!`)
        retreiveAndDeleteDocuments()
    })


    client.on('messageCreate', async msg => {
        let userBot = findUser(msg.author.username)
        if (!userBot) {
            addUser(msg.author.username)
            userBot = findUser(msg.author.username)
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
                numType = 1
                apiResponses(msg, 'jokes')
            }
            else if (msg.content.toLowerCase() === 'fact') {
                numType = 3
                apiResponses(msg, 'facts')
            }
            else if (msg.content === 'quote') {
                numType = 2
                apiResponses(msg, 'quotes')
            }
            else if (msg.content.toLowerCase() === 'jokes') {
               list(msg, userBot, 'joke')
            }
            else if (msg.content.toLowerCase() === 'quotes') {
                list(msg, userBot, 'quote')
            }
            else if (msg.content.toLowerCase() === 'facts') {
                list(msg, userBot, 'fact')
            }
            else if (msg.content.toLowerCase() === 'add') {
                addToArray(msg, userBot, numType, typeOfRes)
            }
        }
    })

    // Log in our bot
    client.login(process.env.DISCORD_BOT_TOKEN);

}



clientApp()
process.on('SIGINT', () => {
    console.log(`About to exit with code:`);
    objectModel.insertMany(botItems)
        .then(() =>{
            console.log('objects inserted correctly')
            process.exit(0)
        })
        .catch((error) => {
            console.log('Objects could not be inserted', error)
            process.exit(0)
        })
});




