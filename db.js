const mongoose = require('mongoose');
const BASE_URL = process.env.BASE_URL;


const connectToMongo = async () => {
    try {
      const conn = await mongoose.connect('mongodb://localhost:27017/mynotebook', {
        useNewUrlParser: true,
      });
      console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
      console.error(error.message);
      process.exit(1);
    }
  }

module.exports = connectToMongo;