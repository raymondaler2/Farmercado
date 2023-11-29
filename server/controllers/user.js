const User = require("../models/user");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      username: user.username,
      email: user.email,
      user_type: user.user_type,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "168h",
    }
  );
};

const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    console.error("Token Verification Error:", error.message);
    throw new Error("Invalid token");
  }
};

const decode_token = asyncHandler(async (req, res) => {
  const { token } = req.body;

  try {
    if (!token) {
      return res.status(401).json({ error: "Token not provided" });
    }

    const decodedToken = verifyToken(token);
    res.status(200).json(decodedToken);
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      res.status(401).json({ error: "Invalid token" });
    } else if (error.name === "TokenExpiredError") {
      res.status(401).json({ error: "Token has expired" });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
      console.error("Token Verification Error:", error.message);
    }
  }
});

const user_login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const token = generateToken(user);

    res.status(200).json({
      id: user._id,
      username: user.username,
      email: user.email,
      user_type: user.user_type,
      token,
    });
  } catch (error) {
    console.error("Login Error:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

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
    const { profile_picture, ...userData } = req.body;

    if (profile_picture) {
      userData.profile_picture = profile_picture;
    }

    const user = await User.findByIdAndUpdate(id, userData, { new: true });

    if (!user) {
      return res
        .status(404)
        .json({ error: `Update User ERROR: User with ID ${id} not found` });
    }

    res.status(200).json(user);
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
  user_login,
  add_user,
  get_all_user,
  get_user_by_id,
  update_user,
  delete_user,
  decode_token,
};
