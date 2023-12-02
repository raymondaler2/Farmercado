const User = require("../models/user");
const Store = require("../models/store");
const Product = require("../models/product");
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
    const { profile_picture, password, ...userData } = req.body;

    if (profile_picture) {
      userData.profile_picture = profile_picture;
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      userData.password = hashedPassword;
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

const add_store_to_user = asyncHandler(async (req, res) => {
  try {
    const { userId, storeInfo, productsInfo } = req.body;
    const newStore = new Store(storeInfo);

    const products = productsInfo.map((product) => new Product(product));
    newStore.products = products;

    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ error: `User with ID ${userId} not found` });
    }

    user.stores.push(newStore);

    await user.save();

    res.status(200).json(user);
  } catch (error) {
    console.error("Add Store to User ERROR:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const update_store_of_user = asyncHandler(async (req, res) => {
  try {
    const {
      userId,
      storeId,
      store_name,
      store_description,
      store_contact_number,
      store_status,
      store_location,
      store_image,
      products,
    } = req.body;

    if (!userId || !storeId) {
      return res.status(400).json({ error: "Invalid request data" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ error: `User with ID ${userId} not found` });
    }

    const storeIndex = user.stores.findIndex(
      (store) => store._id.toString() === storeId
    );

    if (storeIndex === -1) {
      return res.status(404).json({
        error: `Store with ID ${storeId} not found in user's account`,
      });
    }

    const store = user.stores[storeIndex];

    if (store_name) store.store_name = store_name;
    if (store_description) store.store_description = store_description;
    if (store_contact_number) store.store_contact_number = store_contact_number;
    if (store_status) store.store_status = store_status;
    if (store_location) store.store_location = store_location;
    if (store_image) store.store_image = store_image;

    if (products && Array.isArray(products)) {
      products.forEach((productInfo) => {
        const existingProductIndex = store.products.findIndex(
          (existingProduct) =>
            existingProduct._id.toString() === productInfo._id
        );

        if (existingProductIndex !== -1) {
          store.products[existingProductIndex] = {
            ...store.products[existingProductIndex],
            ...productInfo,
          };
        } else {
          store.products.push(new Product(productInfo));
        }
      });
    }

    await user.save();

    res.status(200).json(user);
  } catch (error) {
    console.error("Update Store of User ERROR:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const get_user_stores = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: `User with ID ${id} not found` });
    }

    res.status(200).json(user.stores);
  } catch (error) {
    console.error("Get User Stores ERROR:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const get_store = asyncHandler(async (req, res) => {
  try {
    const { userId, storeId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ error: `User with ID ${userId} not found` });
    }

    const store = user.stores.find((store) => store._id.toString() === storeId);

    if (!store) {
      return res.status(404).json({
        error: `Store with ID ${storeId} not found in user's account`,
      });
    }

    res.status(200).json(store);
  } catch (error) {
    console.error("Get Store ERROR:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const delete_store = asyncHandler(async (req, res) => {
  try {
    const { userId, storeId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ error: `User with ID ${userId} not found` });
    }

    const storeIndex = user.stores.findIndex(
      (store) => store._id.toString() === storeId
    );

    if (storeIndex === -1) {
      return res.status(404).json({
        error: `Store with ID ${storeId} not found in user's account`,
      });
    }

    user.stores.splice(storeIndex, 1);

    await user.save();

    res.status(200).json(user);
  } catch (error) {
    console.error("Delete Store ERROR:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = {
  delete_store,
  get_store,
  get_user_stores,
  update_store_of_user,
  add_store_to_user,
  user_login,
  add_user,
  get_all_user,
  get_user_by_id,
  update_user,
  delete_user,
  decode_token,
};
