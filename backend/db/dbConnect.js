const { createClient } = require('redis');
const mongoose = require('mongoose');

const connectMongoDb = async () => {
  await mongoose.connect(process.env.MONGO_URI)
      .then(conn => {
          console.log(`MONGO DATABASE CONNECTED, Port: ${conn.connection.port}, host: ${conn.connection.host}`);
      })
      .catch (err => {
        cnsole.log("FATAL, CONNECTION TO MONGO DATABSE FAILED!!! \n ", err);
        process.exit(1);
      });
}


const connectRedis = async () => {
  const client = createClient({
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_SECRET,
    socket: {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
    }
  });
  
  client.on('error', err => console.log('Redis Client Error:', err));
  
  try {
    await client.connect();
    console.log('REDIS SUCCESSFULLY CONNECTED!!!');
  } catch (err) {
    console.error('FATAL, CONNECTION TO REDIS FAILED \n', err);
  }
}  


connectMongoDb();
connectRedis();
