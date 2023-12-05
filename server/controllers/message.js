const Message = require("../models/message");
const User = require("../models/user");

const sendMessage = async (req, res) => {
  try {
    const { senderId, receiverId, content } = req.body;

    const sender = await User.findById(senderId);
    const receiver = await User.findById(receiverId);

    if (!sender || !receiver) {
      return res.status(404).json({ error: "User not found" });
    }

    const newMessage = new Message({
      sender: senderId,
      receiver: receiverId,
      content,
    });

    await newMessage.save();

    await User.findByIdAndUpdate(senderId, {
      $push: { chats: { user: receiverId, messages: newMessage._id } },
    });
    await User.findByIdAndUpdate(receiverId, {
      $push: { chats: { user: senderId, messages: newMessage._id } },
    });

    res.status(201).json(newMessage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getMessagesBetweenUsers = async (req, res) => {
  try {
    const { senderId, receiverId } = req.params;

    const messages = await Message.find({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId },
      ],
    });

    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  sendMessage,
  getMessagesBetweenUsers,
};
