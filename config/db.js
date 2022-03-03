const mongoose = require('mongoose')

//Mongo connection
const connectDB = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })

    console.log(`MongoDB conectado! ${connect.connection.host}`)
  } catch (err) {
    console.log(err)
    process.exit()
  }
}

module.exports = connectDB
