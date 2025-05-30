import {User} from "../models/userModel.js";

const getAllUsers = async (req, res, next) => {
  try {
    const currentUserId = req.auth.userId;
    const users = User.find({clerkId: {$ne: currentUserId}});
    res.status(200).json(users);
  }catch(error) {
    console.error("Error in getAllUsers",error);
    next(error)
  }
}

export {getAllUsers}