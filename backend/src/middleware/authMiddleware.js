import {clerkClient} from "@clerk/express";

const protectedRoute = async (req, res, next) => {
  const {userId} = await req.auth();
  if(!userId){
    return res.status(401).json({message: "Unauthorized - you must be logged in"});
  }

  next();
}

const requireAdmin = async (req, res, next) => {
  const {userId} = await req.auth();
  try {
    const currentUser = await clerkClient.users.getUser(userId);
    const isAdmin = process.env.ADMIN_EMAIL === currentUser.primaryEmailAddress?.emailAddress;

    if(!isAdmin){
      return res.status(403).json({message: "Unauthorized - you must be an admin"});
    }

    next();
  }catch (error) {
    console.error(error);
    next(error)
  }
}

export {protectedRoute, requireAdmin};

