const app = require('./lib/app');
const pool = require('./lib/utils/pool');
const Mongoose = require('mongoose');

require('dotenv').config();

const API_URL = process.env.API_URL || 'http://localhost';
const PORT = process.env.PORT || 7890;

Mongoose.set('strictQuery', true);

Mongoose.connect(`mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.mq2yh.mongodb.net/taks-manager?retryWrites=true&w=majority`)
  .then(() => console.log('database connected'))
  .catch((err) => console.log(err));

app.listen(PORT, () => {
  console.log(`🚀  Server started on ${API_URL}:${PORT}`);
});

process.on('exit', () => {
  console.log('👋  Goodbye!');
  pool.end();
});
