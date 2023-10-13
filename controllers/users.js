const { nanoid } = require("nanoid");
const Joi = require("joi");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs/promises");
const path = require("path");
const gravatar = require("gravatar");

const avatarDir = path.join(__dirname, "../", "public", "avatars");

require("dotenv").config();
const { SECRET_KEY } = process.env;

const usersActions = require("../methods/userMethods");
const HttpError = require("../helpers/HttpError");
const sendEmail = require("../helpers/sendEmail");
const User = require("../models/user");
const Jimp = require("jimp");

const RegisterSchema = Joi.object({
  email: Joi.string().email().required().trim(),
  password: Joi.string().min(6).max(18).required().trim(),
  subscription: Joi.string().trim(),
});

const LoginSchema = Joi.object({
  email: Joi.string().email().required().trim(),
  password: Joi.string().trim(),
});

// const getAllUsers = async (req, res, next) => {
//   try {
//     const getAll = await usersActions.listUsers();
//     res.json({
//       status: "success",
//       code: 200,
//       data: {
//         getAll,
//       },
//     });
//   } catch (error) {
//     next(error);
//   }
// };

const registerUser = async (req, res, next) => {
  try {
    const { email, password, subscription } = req.body;

    const { error } = RegisterSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }

    const data = await usersActions.findUser({ email });
    if (data) {
      throw HttpError(409, "Email in use");
    }

    if (!email || !password) {
      throw HttpError(400, "missing required name field");
    } else {
      const hashPassword = await bcryptjs.hash(password, 10);
      const avatarURL = gravatar.url(email);
      const verificationToken = nanoid();
      const user = {
        id: nanoid(),
        email: email,
        password: hashPassword,
        subscription: subscription,
        avatarURL,
        verificationToken: verificationToken
      };

      const reg = await usersActions.addUser(user);

      await sendEmail(email, verificationToken);

      res.json({
        status: "created",
        code: 201,
        data: {
          reg,
        },
      });
    }
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const { error } = LoginSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }

    const user = await usersActions.findUser({ email });
    const comparePassword = await bcryptjs.compare(password, user.password);

    if (!user || !comparePassword) {
      throw HttpError(401, "Email or password is wrong");
    } else {
      const payload = {
        id: user.id,
      };
      const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "48h" });
      await User.findByIdAndUpdate(user._id, { token });

      res.json({
        token: token,
        user: {
          email: email,
          password: password,
          subscription: user.subscription,
          avatarURL: user.avatarURL,
        },
      });
    }
  } catch (error) {
    next(error);
  }
};

const currentUser = async (req, res, next) => {
  const { email, subscription, avatarURL } = req.user;
  res.json({
    email,
    subscription,
    avatarURL,
  });
};

const logoutUser = async (req, res, next) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });

  res.json({
    status: "no content",
    code: 204,
    data: "Logout success",
  });
};

const updateUserSubscription = async (req, res, next) => {
  try {
    const list = ["starter", "pro", "business"];
    const { _id } = req.user;
    const check = list.includes(req.body.subscription);

    if (
      Object.keys(req.body).length === 0 ||
      Object.keys(req.body).length > 1
    ) {
      throw HttpError(400, "missing required fields");
    } else if (
      Object.keys(req.body).filter((elem) => elem !== "subscription") &&
      check === false
    ) {
      throw HttpError(400, "missing field subscription");
    } else {
      const user = await usersActions.updateUser(_id, req.body);
      if (JSON.stringify(user) === "[]") {
        throw HttpError(404, "Not found");
      } else {
        res.json({
          status: "success",
          code: 200,
          data: {
            user,
          },
        });
      }
    }
  } catch (error) {
    next(error);
  }
};

const updateUserAvatar = async (req, res, next) => {
  try {
    const { _id } = req.user;
    if (req.file === undefined) {
      throw HttpError(400, "bad request");
    } else {
      const { path: tempUpload, originalname } = req.file;
      await Jimp.read(tempUpload)
        .then((image) => image.resize(250, 250))
        .then((image) => image.write(tempUpload));
      const imageName = `${_id}-${originalname}`;
      const newImage = path.join(avatarDir, imageName);
      await fs.rename(tempUpload, newImage);
      const avatarURL = path.join("avatars", imageName);
      await usersActions.updateUser(_id, { newImage });

      res.json({
        status: "success",
        code: 200,
        data: {
          avatarURL,
        },
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  // getAllUsers,
  registerUser,
  loginUser,
  currentUser,
  logoutUser,
  updateUserSubscription,
  updateUserAvatar,
};
