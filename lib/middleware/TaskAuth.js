const Task = require('../models/Task');


module.exports = async (req, res, next) => {
  try{
    if(req.method === 'PUT' || req.method === 'DELETE'){
      const userTask = await Task.findById(req.params.id);
      console.log(userTask);
      if(req.user._doc._id !== userTask.userId){
        throw new Error('Not authorized to complete this action');
      }
    }
    next();
  }catch(e){
    e.status = 403;
    next(e);
  }
};
