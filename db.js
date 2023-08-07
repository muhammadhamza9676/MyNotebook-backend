const mongoose = require('mongoose');
require('dotenv').config();
const BASE_URL = process.env.BASE_URL;
const connectionOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  writeConcern: {
    w: 'majority' // Valid write concern mode
  }
};


const connectToMongo = async () => {
    try {
      const conn = await mongoose.connect(`${BASE_URL}`, connectionOptions);
      console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
      console.error(error.message);
      process.exit(1);
    }
  }

module.exports = connectToMongo;
