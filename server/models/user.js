const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Store = require("./store");

const userSchema = mongoose.Schema({
  first_name: {
    type: String,
    required: [true, "Please enter First Name"],
  },
  last_name: {
    type: String,
    required: [true, "Please enter Last Name"],
  },
  username: {
    type: String,
    required: [true, "Please enter Username"],
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Please enter Email"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please enter Password"],
  },
  user_type: {
    type: String,
    required: [true, "Please enter User Type"],
  },
  profile_picture: {
    type: String,
  },
  profile_ratings: {
    type: Number,
  },
  stores: {
    type: [Store.schema],
  },
  chats: {
    type: [String],
  },
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    return next(error);
  }
});

const User = mongoose.model("User", userSchema);
module.exports = User;
