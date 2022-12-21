const Mongoose = require('mongoose');


const TaskSchema = new Mongoose.Schema({

  title: { type: String, required: true },
  description: { type: String, require: true },
  completed: { type: Boolean, default: false, required: true,  },
  userId: { type: String, required: true }


}, { timestamps: true });


module.exports = Mongoose.model('Task', TaskSchema);
