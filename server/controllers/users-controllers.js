const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");
const User = require("../models/user");

const getUsers = async (req, res, next) => {
  // res.json({ users: DUMMY_USERS });
  let users;
  try {
    users = await User.find({}, "-password");
  } catch (err) {
    return next(new HttpError("Fetching User failed Please try again", 500));
  }
  res.json({ users: users.map((user) => user.toObject({ getters: true })) });
  // Does not return password in response (Conecpt known as protection)
};
const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data", 422)
    );
  }
  const { name, email, password } = req.body;
  //const hasUser = DUMMY_USERS.find((u) => u.email === email);
  // if (hasUser) {
  //   throw new HttpError("Could not create user, email already exists", 422);
  // }
  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError("Signing up failed try again later", 500);
    return next(error);
  }
  if (existingUser) {
    const error = new HttpError(
      "User exists already, please login instead",
      422
    );
    return next(error);
  }

  // const createdUser = {
  //   id: uuidv4(),
  //   name,
  //   email,
  //   password,
  // };

  const createdUser = new User({
    name,
    email,
    image: req.file.path,
    password,
    places: [],
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError("Signup failed, please try again", 500);
    return next(error);
  }
  //DUMMY_USERS.push(createdUser);
  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};
const login = async (req, res, next) => {
  const { email, password } = req.body;

  // const identifiedUser = DUMMY_USERS.find((u) => u.email === email);
  // if (!identifiedUser || identifiedUser.password !== password) {
  //   throw new HttpError(
  //     "Could not identify user, credentials seem to be wrong",
  //     401
  //   );
  // }

  let existingUser;

  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "Logging in failed, please try again later.",
      500
    );
    return next(error);
  }

  if (!existingUser || existingUser.password !== password) {
    const error = new HttpError(
      "Invalid credentials, could not log you in.",
      401
    );
    return next(error);
  }

  res.json({
    message: "Logged in!",
    user: existingUser.toObject({ getters: true }),
  });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
