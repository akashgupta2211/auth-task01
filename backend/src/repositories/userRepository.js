import User from '../schema/user.js';
import crudRepository from './crudRepository.js';

const userRepository = {
  ...crudRepository(User),


  signUpUser: async (data) => {
    const newUser = new User(data);
    await newUser.save();
    return newUser;
  }
  ,
  getByEmail: async (email) => {
    const user = await User.findOne({ email })
    return user;
  },



  getUsersByAdminRole: async (role) => {
    const users = await User.find({ role: { $in: ['manager', 'user', 'admin'] } }).select('-password');
    return users;
  },


  getUsersByManagerRole: async (role) => {
    const users = await User.find({ role: { $in: ['manager', 'user'] } }).select('-password');
    return users;
  },


  getUserByUsername: async (username) => {
    const user = await User.findOne({ username }).select('-password');
    return user;
  },
};

export default userRepository;
