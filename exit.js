const { objectModel } = require('./mongoDBConfig.js')

function onOffline(botObject) {
    process.on('SIGINT', () => {
        console.log(`About to exit with code:`);
        objectModel.insertMany(botObject.botItems)
            .then(() =>{
                console.log('objects inserted correctly')
                process.exit(0)
            })
            .catch((error) => {
                console.log('Objects could not be inserted', error)
                process.exit(0)
            })
    });
}

module.exports = onOffline