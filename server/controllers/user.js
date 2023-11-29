const User = require("../models/user");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const add_user = asyncHandler(async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(200).json(user);
  } catch (error) {
    if (error instanceof Error && error.code === 11000) {
      if (error.keyPattern.email) {
        return res.status(400).json({ error: "Email Address already exists" });
      } else if (error.keyPattern.username) {
        return res.status(400).json({ error: "Username already exists" });
      }
    }

    console.error("Error:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const get_all_user = asyncHandler(async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Get All User ERROR" });
    console.error("Get All User ERROR:", error.message);
  }
});

const get_user_by_id = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Get User by Id ERROR" });
    console.error("Get User by Id ERROR:", error.message);
  }
});

const update_user = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(id, req.body);
    if (!user) {
      res
        .status(404)
        .json({ error: `Update User ERROR: User with ID ${id} not found` });
    }
    const updatedUser = await User.findById(id);
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: "Update User ERROR" });
    console.error("Update User ERROR:", error.message);
  }
});

const delete_user = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      res
        .status(404)
        .json({ error: `Delete User ERROR: User with ID ${id} not found` });
    }
    res.status(200).json(`User: ${id} deleted`);
  } catch (error) {
    res.status(500).json({ error: "Delete User ERROR" });
  }
});

module.exports = {
  add_user,
  get_all_user,
  get_user_by_id,
  update_user,
  delete_user,
};
