const authenthicate_token = require("./../middleware/authenthicate_token.jsx");
const express = require("express");

const {
  add_user,
  get_all_user,
  get_user_by_id,
  update_user,
  delete_user,
} = require("./../controllers/user");

const router = express.Router();

router.post("/", add_user);
router.get("/", get_all_user);
router.get("/:id", get_user_by_id);
router.put("/:id", update_user);
router.delete("/:id", delete_user);

module.exports = router;
