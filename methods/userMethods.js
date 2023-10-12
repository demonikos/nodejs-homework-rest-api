const User = require("../models/user");

// const listUsers = async () => {
//     const data = await User.find();
//     return data;
//   };

const findUser = async (body) => {
  const data = await User.findOne(body);
  return data;
};

const addUser = async (body) => {
  const data = await User.create({
    email: body.email,
    password: body.password,
    subscription: body.subscription,
    avatarURL: body.avatarURL,
  });
  return data;
};

const updateUser = async (userID, body) => {
  const data = await User.findByIdAndUpdate(userID, body, { new: true });
  return data;
};

module.exports = {
  // listUsers,
  findUser,
  addUser,
  updateUser,
};
