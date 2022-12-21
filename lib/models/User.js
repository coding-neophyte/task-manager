const Mongoose = require('mongoose');


const UserSchema = new Mongoose.Schema({

  name: { type: String, require: true, trim: true },
  username: { type: String, required: true, trim: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6, trim: true }

}, { timestamps: true });


module.exports = Mongoose.model('User', UserSchema);
