const mongoose = require('mongoose')

async function connectDB () {
  try {
    const db = await mongoose.connect("mongodb://localhost:27017/crud-notes", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log('DB connected', db.connection.name)  
  } catch (error) {
      console.log(error)
  }
}

module.exports = connectDB