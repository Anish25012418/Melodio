import {User} from "../models/userModel.js";
import {Message} from "../models/messageModel.js";

const getAllUsers = async (req, res, next) => {
  try {
    const { userId } = await req.auth();
    const users = await User.find({clerkId: {$ne: userId}});
    res.status(200).json(users);
  }catch(error) {
    console.error("Error in getAllUsers",error);
    next(error)
  }
}

const getMessages = async (req, res, next) => {
  try {
    const { userId: myId } = await req.auth()
    const {userId} = req.params;

    const {messages} = await Message.find({
      $or: [
        {senderId: userId, receiverId: myId},
        {senderId: myId, receiverId: userId},
      ]
    }).sort({createdAt: 1});
    res.status(200).json(messages);
  }catch(error) {
    console.error("Error in getMessages",error);
    next(error)
  }
}

export {getAllUsers, getMessages}