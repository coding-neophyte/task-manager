const Mongoose = require('mongoose');


const UserSchema = new Mongoose.Schema({

}, { timestamps: true });


module.exports = Mongoose.model('User', UserSchema);
