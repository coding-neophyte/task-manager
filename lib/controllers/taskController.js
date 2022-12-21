const express = require('express');
const Authenticate = require('../middleware/Authenticate');
const TaskAuth = require('../middleware/TaskAuth');
const router = express.Router();
const Task = require('../models/Task');

module.exports = router.post('/', Authenticate, async(req, res, next) => {
  try{
    const task = new Task({
      title: req.body.title,
      description: req.body.description,
      userId: req.user._doc._id
    });
    await task.save();

    res.status(200).json(task);
  }catch(e){
    e.status = 500;
    next(e);
  }
})
  .get('/:id', Authenticate, async (req, res, next) => {
    try {
      const { id } = req.params;

      const singleTask = await Task.findById(id);
      console.log(singleTask);

      res.status(200).json(singleTask);
    }catch(e){
      next(e);
    }
  });
