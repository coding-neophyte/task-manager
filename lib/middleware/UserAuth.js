const User = require('../models/User');

module.exports = async (req, res, next) => {
  try{
    if(req.method === 'PUT'){
      const user = await User.findById(req.params.id);
      if(req.user._doc._id !== user.id){
        throw new Error('Not authorized to complete this action');
      }
    }
    next();
  }catch(e){
    e.status = 403;
    next(e);
  }


};
