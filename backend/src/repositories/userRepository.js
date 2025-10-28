import User from "../schema/user.js";
import crudRepository from "./crudRepository.js";

const userRepository = {
  ...crudRepository(User),
  getUserByUsername: async (username) => {
    const user = await User.findOne({ username }).select("-password");
    return user;
  },

  signUpUser: async (data) => {
    const newUser = new User(data);
    await newUser.save();
    return newUser;
  },
  getByEmail: async (email) => {
    const user = await User.findOne({ email });
    return user;
  },
};

export default userRepository;
