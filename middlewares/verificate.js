const HttpError = require("../helpers/HttpError");
const User = require("../models/user");

const verification = async (req, res, next) => {
  const verificationToken = req.params.verificationToken;

  try {
    const user = await User.findOne({ verificationToken });

    console.log(user);

    if (!user) {
      next(HttpError(404, "User not found"));
    } else {
      await User.findOneAndUpdate(
        { verificationToken },
        {
          verificationToken: null,
          verify: true,
        }
      );
      res.json({
        status: "success",
        code: 200,
        message: "Verification successull",
      });
    }
  } catch (error) {
    next(HttpError(404, "Bad request"));
  }
};

module.exports = verification;
