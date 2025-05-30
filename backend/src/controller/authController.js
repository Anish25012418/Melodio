import {User} from "../models/userModel.js";

const authCallback = async (req, res, next) => {
  try {
    const { id, firstName, lastName, imageUrl } = req.body;

    //check if user exists
    const user = await User.findOne({clerkId: id});

    if (!user) {
      //signup
      await User.create({
        clerkId: id,
        fullName: `${firstName} ${lastName}`,
        imageUrl
      })
    }
    res.status(200).json({message: "User created"});
  } catch (error){
    console.log("Error in auth callback", error);
    next(error)
  }
}

export {authCallback};