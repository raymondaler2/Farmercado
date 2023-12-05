import React from "react";
import NavBar from "./../components/NavBar.jsx";
import { useLocation } from "react-router-dom";
import { MessageList, Input, ChatList } from "react-chat-elements";
import "react-chat-elements/dist/main.css";
import { Grid, Paper } from "@mui/material";

const Orders = () => {
  const location = useLocation();
  const { productQuantities } = location.state || {};
  console.log(
    "%c Line:11 🍋 productQuantities",
    "color:#ea7e5c",
    productQuantities
  );

  // Sample messages for demonstration
  const messages = [
    {
      position: "left",
      type: "text",
      text: "Hello!",
      date: new Date(),
    },
    {
      position: "right",
      type: "text",
      text: "Hi there!",
      date: new Date(),
    },
    {
      position: "left",
      type: "text",
      text: "Hello!",
      date: new Date(),
    },
    {
      position: "right",
      type: "text",
      text: "Hi there!",
      date: new Date(),
    },
    {
      position: "left",
      type: "text",
      text: "Hello!",
      date: new Date(),
    },
    {
      position: "right",
      type: "text",
      text: "Hi there!",
      date: new Date(),
    },
    {
      position: "left",
      type: "text",
      text: "Hello!",
      date: new Date(),
    },
    {
      position: "right",
      type: "text",
      text: "Hi there!",
      date: new Date(),
    },
    {
      position: "left",
      type: "text",
      text: "Hello!",
      date: new Date(),
    },
    {
      position: "right",
      type: "text",
      text: "Hi there!",
      date: new Date(),
    },
    {
      position: "left",
      type: "text",
      text: "Hello!",
      date: new Date(),
    },
    {
      position: "right",
      type: "text",
      text: "Hi there!",
      date: new Date(),
    },
    {
      position: "left",
      type: "text",
      text: "Hello!",
      date: new Date(),
    },
    {
      position: "right",
      type: "text",
      text: "Hi there!",
      date: new Date(),
    },
    {
      position: "left",
      type: "text",
      text: "Hello!",
      date: new Date(),
    },
    {
      position: "right",
      type: "text",
      text: "Hi there!",
      date: new Date(),
    },
  ];

  const dataSource = [
    {
      avatar: "https://avatars.githubusercontent.com/u/80540635?v=4",
      alt: "kursat_avatar",
      title: "Kursat",
      subtitle: "Why don't we go to the No Way Home movie this weekend ?",
      date: new Date(),
      unread: 3,
    },
    {
      avatar: "https://avatars.githubusercontent.com/u/80540635?v=4",
      alt: "kursat_avatar",
      title: "Kursat",
      subtitle: "Why don't we go to the No Way Home movie this weekend ?",
      date: new Date(),
      unread: 3,
    },
    {
      avatar: "https://avatars.githubusercontent.com/u/80540635?v=4",
      alt: "kursat_avatar",
      title: "Kursat",
      subtitle: "Why don't we go to the No Way Home movie this weekend ?",
      date: new Date(),
      unread: 3,
    },
    {
      avatar: "https://avatars.githubusercontent.com/u/80540635?v=4",
      alt: "kursat_avatar",
      title: "Kursat",
      subtitle: "Why don't we go to the No Way Home movie this weekend ?",
      date: new Date(),
      unread: 3,
    },
    {
      avatar: "https://avatars.githubusercontent.com/u/80540635?v=4",
      alt: "kursat_avatar",
      title: "Kursat",
      subtitle: "Why don't we go to the No Way Home movie this weekend ?",
      date: new Date(),
      unread: 3,
    },
    {
      avatar: "https://avatars.githubusercontent.com/u/80540635?v=4",
      alt: "kursat_avatar",
      title: "Kursat",
      subtitle: "Why don't we go to the No Way Home movie this weekend ?",
      date: new Date(),
      unread: 3,
    },
    {
      avatar: "https://avatars.githubusercontent.com/u/80540635?v=4",
      alt: "kursat_avatar",
      title: "Kursat",
      subtitle: "Why don't we go to the No Way Home movie this weekend ?",
      date: new Date(),
      unread: 3,
    },
    {
      avatar: "https://avatars.githubusercontent.com/u/80540635?v=4",
      alt: "kursat_avatar",
      title: "Kursat",
      subtitle: "Why don't we go to the No Way Home movie this weekend ?",
      date: new Date(),
      unread: 3,
    },
    {
      avatar: "https://avatars.githubusercontent.com/u/80540635?v=4",
      alt: "kursat_avatar",
      title: "Kursat",
      subtitle: "Why don't we go to the No Way Home movie this weekend ?",
      date: new Date(),
      unread: 3,
    },
    {
      avatar: "https://avatars.githubusercontent.com/u/80540635?v=4",
      alt: "kursat_avatar",
      title: "Kursat",
      subtitle: "Why don't we go to the No Way Home movie this weekend ?",
      date: new Date(),
      unread: 3,
    },
    {
      avatar: "https://avatars.githubusercontent.com/u/80540635?v=4",
      alt: "kursat_avatar",
      title: "Kursat",
      subtitle: "Why don't we go to the No Way Home movie this weekend ?",
      date: new Date(),
      unread: 3,
    },
    {
      avatar: "https://avatars.githubusercontent.com/u/80540635?v=4",
      alt: "kursat_avatar",
      title: "Kursat",
      subtitle: "Why don't we go to the No Way Home movie this weekend ?",
      date: new Date(),
      unread: 3,
    },
    {
      avatar: "https://avatars.githubusercontent.com/u/80540635?v=4",
      alt: "kursat_avatar",
      title: "Kursat",
      subtitle: "Why don't we go to the No Way Home movie this weekend ?",
      date: new Date(),
      unread: 3,
    },
    {
      avatar: "https://avatars.githubusercontent.com/u/80540635?v=4",
      alt: "kursat_avatar",
      title: "Kursat",
      subtitle: "Why don't we go to the No Way Home movie this weekend ?",
      date: new Date(),
      unread: 3,
    },
  ];

  return (
    <div>
      <NavBar />
      <Grid container className="h-full bg-gray-100 mt-20 ">
        {/* ChatList on the left */}
        <Grid item xs={12}>
          <Paper className="p-4 h-full max-h-[40vh] overflow-y-auto">
            <ChatList className="chat-list" dataSource={dataSource} />
          </Paper>
        </Grid>

        {/* Chat window on the right */}
        <Grid item xs={12}>
          <Paper className="p-4 h-full max-h-[41.5vh] overflow-y-auto">
            {/* Chat components */}
            <MessageList
              className="message-list"
              lockable={true}
              toBottomHeight={"100%"}
              dataSource={messages}
            />
          </Paper>
          <Paper className="p-4 h-full max-h-[10vh] overflow-y-clip">
            <Input
              placeholder="Type here..."
              multiline={false}
              rightButtons={
                <button
                  onClick={() => console.log("send clicked")}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md"
                >
                  Send
                </button>
              }
            />
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default Orders;
