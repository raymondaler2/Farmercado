const express = require("express");
const {
  sendMessage,
  getMessagesBetweenUsers,
} = require("./../controllers/message");

const router = express.Router();

router.post("/messages", sendMessage);
router.get("/messages/:senderId/:receiverId", getMessagesBetweenUsers);

module.exports = router;
