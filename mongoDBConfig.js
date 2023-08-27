const mongoose = require('mongoose') // Using mongoose to add Schema into MongoDB

const  objectSchema = new mongoose.Schema({
    name: String,
    joke: Array,
    quote: Array,
    fact: Array,
    responding: Boolean
})

const objectModel = mongoose.model('user', objectSchema)

async function retreiveAndDeleteDocuments(botObject) {
    try {
      if (!botObject) {
        throw new Error('botObject is undefined')
      }
      await mongoose.connect(process.env.DATABASE_URI, { useNewUrlParser: true, useUnifiedTopology: true })
      var documents = await objectModel.find({})
      console.log('Retrieved documents:', documents)
      botObject.botItems = documents
      console.log('bot array: ', botObject.botItems)
      documents = await objectModel.deleteMany({})
      console.log('Documents after deletion: ', documents)


      //mongoose.disconnect();
    } catch (err) {
      console.error('Error:', err);
    }
}

module.exports = {
    objectModel,
    retreiveAndDeleteDocuments
}