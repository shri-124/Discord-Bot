const request = require('request')


function apiResponses(msg, typeStr, botObject) {
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
                botObject.typeOfRes = json[0].joke
                msg.reply(json[0].joke)
            }
            else if (typeStr === 'facts') {
                botObject.typeOfRes = json[0].fact
                msg.reply(json[0].fact)
            }
            else if (typeStr === 'quotes') {
                botObject.typeOfRes = json[0].quote + ' - ' + json[0].author
                msg.reply(json[0].quote + ' - ' + json[0].author)
            }
        }
    });
}

module.exports = apiResponses