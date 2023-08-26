require('dotenv').config() // Initialize dotenv
const request = require('request') // To access api-ninjas
const mongoose = require('mongoose') // Using mongoose to add Schema into MongoDB
const dateTime = require('./date.js')
const { findUser, addUser } = require('./userManagement.js')
const { list, addToArray } = require('./usersArrays.js')
const apiResponses = require('./quoteAPI.js')
const { objectModel, retreiveAndDeleteDocuments } = require('./mongoDBConfig.js')
const onOffline = require('./exit.js')
const { Client, GatewayIntentBits, Message } = require('discord.js') // To access discord library
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent/*, GatewayIntentBits.GuildMembers*/] })// Discord.js versions ^14.13 require us to explicitly define client intents

// Global bot object
var botObject = {
    typeOfRes: "",
    numType: -1,
    botItems: []
}


retreiveAndDeleteDocuments(botObject)
function clientApp() {
    client.on('ready', () => {
        console.log(`Logged in as ${client.user.tag}!`)
        retreiveAndDeleteDocuments()
    })


    client.on('messageCreate', async msg => {
        let userBot = findUser(msg.author.username, botObject)
        if (!userBot) {
            addUser(msg.author.username, botObject)
            userBot = findUser(msg.author.username, botObject)
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
                botObject.numType = 1
                apiResponses(msg, 'jokes', botObject)
            }
            else if (msg.content.toLowerCase() === 'fact') {
                botObject.numType = 3
                apiResponses(msg, 'facts', botObject)
            }
            else if (msg.content === 'quote') {
                botObject.numType = 2
                apiResponses(msg, 'quotes', botObject)
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
                addToArray(msg, userBot, botObject)
            }
        }
    })

    // Log in our bot
    client.login(process.env.DISCORD_BOT_TOKEN);
}



clientApp()
onOffline(botObject)




