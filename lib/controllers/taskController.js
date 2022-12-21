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
  })
  .get('/', Authenticate, async (req, res, next) => {
    try{
      const taskList = await Task.find({ userId: req.user._doc._id }).exec();

      res.status(200).json(taskList);
    }catch(e){
      next(e);
    }
  })
  .put('/:id', [Authenticate, TaskAuth], async (req, res, next) => {
    try{
      const { id } = req.params;

      const editedTask = await Task.findByIdAndUpdate(id, {
        $set: req.body
      }, { new: true });

      res.status(200).json(editedTask);
    }catch(e){
      next(e);
    }
  })
  .delete('/:id', [Authenticate, TaskAuth], async (req, res, next) => {
    try{
      const { id } = req.params;

      await Task.findByIdAndDelete(id);

      res.status(200).send();
    }catch(e){
      e.status = 500;
      next(e);
    }
  });
