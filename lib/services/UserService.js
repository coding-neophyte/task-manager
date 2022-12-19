const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');


module.exports = class UserService {
  static async signup({ name, username, email, password }){
    const existingEmail = await User.findOne({ email });
    const existingUsername = await User.findOne({ username });

    if(existingEmail) throw new Error('Email already Exists');
    if(existingUsername) throw new Error('Username has already been taken');


    const hashedPassword = await bcrypt.hash(password, Number(process.env.SALT_ROUNDS));

    const user = new User({
      name,
      username,
      email,
      password: hashedPassword
    }).save();

    const savedUser = await user.save();

    return savedUser;
  }


  static async signin({ email, password = '' }){
    try{
      const existingUser = await User.findOne({ email });

      if(!existingUser) throw new Error('Invalid Email');

      if(!bcrypt.compareSync(password, existingUser.password)) throw new Error('Invalid Password');

      const token = jwt.sign({ ...existingUser }, process.env.JWT_SECRET, {
        expiresIn: '1 day'
      });

      return token;
    }catch(e){
      e.status = 401;
      throw(e);
    }
  }
};
