import User from "../schema/user.js";
import crudRepository from "./crudRepository.js";

const userRepository = {
  ...crudRepository(User),

  signUpUser: async (data) => {
    const newUser = new User(data);
    await newUser.save();
    return newUser;
  },
  getByEmail: async (email) => {
    const user = await User.findOne({ email });
    return user;
  },

  getById: async (id) => {
    return await User.findById(id).select("-password");
  },

  getUserByUsername: async (username) => {
    return await User.findOne({ username }).select("-password");
  },

  getUsersByAdminRole: async (role) => {
    if (!role) {
      return await User.find().select("-password");
    }
    return await User.find({ role }).select("-password");
  },

  getUsersByManagerRole: async (role) => {
    if (!role) {
      return await User.find({ role: "user" }).select("-password");
    }
    return await User.find({ role }).select("-password");
  },
};

export default userRepository;
