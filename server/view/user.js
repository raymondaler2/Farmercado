const express = require("express");

const {
  add_user,
  get_all_user,
  get_user_by_id,
  update_user,
  delete_user,
  user_login,
  decode_token,
  add_store_to_user,
  update_store_of_user,
  get_user_stores,
  get_store,
  delete_store,
  get_all_stores,
  get_user_by_storeid,
  buyer_chat,
  change_password,
} = require("./../controllers/user");

const router = express.Router();
router.put("/change_password", change_password);
router.put("/buyer_chat/:buyerId/:sellerId", buyer_chat);
router.get("/stores_user/:storeId", get_user_by_storeid);
router.get("/stores", get_all_stores);
router.delete("/:userId/stores/:storeId", delete_store);
router.get("/:userId/stores/:storeId", get_store);
router.get("/:id/stores", get_user_stores);
router.put("/update_store_of_user", update_store_of_user);
router.post("/add_store_to_user", add_store_to_user);
router.post("/decode_token", decode_token);
router.post("/login", user_login);
router.post("/", add_user);
router.get("/", get_all_user);
router.get("/:id", get_user_by_id);
router.put("/:id", update_user);
router.delete("/:id", delete_user);

module.exports = router;
