import React, { useEffect, useState, useRef } from "react";
import NavBar from "./../components/NavBar.jsx";
import CryptoJS from "crypto-js";
import { useLocation } from "react-router-dom";
import { StreamChat } from "stream-chat";
import {
  Channel,
  ChannelHeader,
  ChannelList,
  Chat,
  LoadingIndicator,
  MessageInput,
  MessageList,
  Window,
} from "stream-chat-react";
import axios from "axios";
import "stream-chat-react/dist/css/index.css";
import default_avatar from "./../assets/default_avatar.jpg";
import { EmojiPicker } from "stream-chat-react/emojis";

const Orders = () => {
  const chatInitCalled = useRef(false);
  const [user, setUser] = useState(null);
  const [client, setClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const location = useLocation();
  const { productQuantities, storeUser, selectedMarker } = location.state || {};
  const token = localStorage.getItem("token") ?? "";
  const jwtSecret = import.meta.env.VITE_JWT_SECRET;
  const user_id = localStorage.getItem("decodedTokenId") ?? "";
  const user_type = localStorage.getItem("decodedTokenUserType") ?? "";
  const decryptedtoken = CryptoJS.AES.decrypt(token, jwtSecret).toString(
    CryptoJS.enc.Utf8
  );
  const decryptedUserId = CryptoJS.AES.decrypt(user_id, jwtSecret).toString(
    CryptoJS.enc.Utf8
  );
  const filters = {
    type: "messaging",
    members: { $in: [user?._id] },
  };
  const sort = {
    last_message_at: -1,
  };
  const decryptedUserType = CryptoJS.AES.decrypt(user_type, jwtSecret).toString(
    CryptoJS.enc.Utf8
  );

  const fetchUser = async () => {
    const result = await axios.get(
      `http://localhost:5000/api/user/${decryptedUserId}`
    );
    setUser(result.data);
  };

  const getUniqueID = () => {
    if (decryptedUserType === "buyer") {
      if (!storeUser) {
        return `${user.chats[0]}-${user._id}`;
      } else {
        return `${storeUser?._id}-${user._id}`;
      }
    } else {
      return `${user._id}-${user.chats[0]}`;
    }
  };

  const getMembers = () => {
    if (decryptedUserType === "buyer") {
      if (!storeUser) {
        return [user._id];
      } else {
        return [user._id, storeUser?._id];
      }
    } else {
      return [user._id];
    }
  };

  const chatInit = async () => {
    if (user.chats.length === 0) {
      return;
    }
    const chatClient = StreamChat.getInstance(
      import.meta.env.VITE_STREAM_API_KEY
    );

    const { username } = user ?? "";
    await chatClient.connectUser(
      {
        name: username,
        id: user._id,
        image: !!user?.profile_picture_file ? user?.profile_picture_file : null,
      },
      decryptedtoken
    );

    const channelUniqueID = getUniqueID();
    const channelMembers = getMembers();
    const channel = chatClient.channel("messaging", channelUniqueID, {
      name: selectedMarker?.store_name,
      image: !selectedMarker?.store_image_url
        ? default_avatar
        : selectedMarker?.store_image_url,
      members: channelMembers,
    });

    await channel.watch();

    if (!!productQuantities) {
      const formattedproductQuantities = Object.entries(productQuantities)
        .map(([key, value]) => `${key} - ${value}`)
        .join("\n");
      channel.sendMessage({
        text: `Hi I want to purchase:\n${formattedproductQuantities}`,
      });
    }
    setChannel(channel);
    setClient(chatClient);
  };

  useEffect(() => {
    if (!!user && (!channel || !client) && !chatInitCalled.current) {
      chatInitCalled.current = true;

      chatInit();

      if (client) {
        return () => client.disconnectUser();
      }
    }
  }, [user, channel, client]);

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <>
      <NavBar />
      <div className="mt-20">
        {!channel || !client ? (
          <LoadingIndicator />
        ) : (
          <Chat client={client} theme="messaging light">
            <ChannelList filters={filters} sort={sort} />
            <Channel channel={channel} EmojiPicker={EmojiPicker}>
              <Window>
                <ChannelHeader />
                <MessageList />
                <MessageInput />
              </Window>
            </Channel>
          </Chat>
        )}
      </div>
    </>
  );
};

export default Orders;
