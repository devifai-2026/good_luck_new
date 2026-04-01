import React, { useState } from "react";
import {
  getAllMatches,
  getAllMessagesByMatchesID,
  postCreateChatRoomByUserId,
} from "../services";
import { useSelector } from "react-redux";
import { RootState } from "../redux";
import { MessageType } from "../components/Chat/datingChatUI";

const useMatchMessageService = () => {
  const [matches, setMatches] = useState<any>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setloading] = useState<boolean>(false);

  const userId = useSelector(
    (state: RootState) => state.auth.userDetails?.userID
  );
  const createChatRoom = async (chatID: string) => {
    try {
      const response = await postCreateChatRoomByUserId({
        user2: chatID,
        user1: userId ?? "",
      });
      // (response?.data?.data);
    } catch (error) {
      console.error(error);
    }
  };

  const getAllMatchesByUserId = async () => {
    setloading(true);
    try {
      const response = await getAllMatches(userId ?? "");

      const formattedData = response?.data?.data?.map((item: any) =>
        formatMatchDataForList(item)
      );
      setMatches(formattedData);
    } catch (error) {
      console.error(error);
    } finally {
      setloading(false);
    }
  };

  const getMessagesByMatchId = async (matchId: string) => {
    setloading(true);
    try {
      const response = await getAllMessagesByMatchesID(matchId);
      const allMessages = response?.data?.data?.messages;
      setMessages(allMessages.map((item: any) => formatMessageForList(item)));
    } catch (error) {
      console.error(error);
    } finally {
      setloading(false);
    }
  };

  const formatMatchDataForList = (profileData: any) => {
    return {
      userId: profileData.otherUser?.userId ?? profileData?._id,
      userName: `${profileData.otherUser?.Fname ?? "-"} ${
        profileData?.otherUser?.Lname ?? "-"
      }`,

      profilePicture: profileData?.otherUser?.photos,
      matchId: profileData?.matchId,
      lastMessage: profileData?.lastMessage?.message,
      lastmessageTimeStamp: profileData?.lastMessage?.timestamp,
    };
  };

  const formatMessageForList = (messageData: any) => {
    return {
      id: messageData?._id ?? messageData?.timestamp,
      message: messageData?.message,
      isOwnMessage: messageData?.senderId === userId,
      timestamp: messageData?.timestamp,
    };
  };

  const getTimeValueByISO = (input: number | string): string => {
    const now = Date.now();
    const inputTime =
      typeof input === "string" ? new Date(input).getTime() : input;

    if (isNaN(inputTime)) {
      throw new Error("Invalid date or timestamp provided.");
    }

    const difference = now - inputTime;
    const seconds = Math.floor(difference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);

    if (seconds < 60 && seconds > 0) {
      return `${seconds} second${seconds !== 1 ? "s" : ""} ago`;
    } else if (minutes < 60) {
      return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
    } else if (hours < 24) {
      return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
    } else if (days < 7) {
      return `${days} day${days !== 1 ? "s" : ""} ago`;
    } else if (weeks < 4) {
      return `${weeks} week${weeks !== 1 ? "s" : ""} ago`;
    } else {
      const date = new Date(inputTime);
      return date.toLocaleString(); // Formats to local date and time
    }
  };
  return {
    loading,
    matches,
    messages,
    setMessages,
    createChatRoom,
    getAllMatchesByUserId,
    getMessagesByMatchId,
    formatMessageForList,
    getTimeValueByISO,
  };
};

export default useMatchMessageService;
