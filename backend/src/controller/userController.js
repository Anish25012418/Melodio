import {User} from "../models/userModel.js";

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

export {getAllUsers}