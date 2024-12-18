import User from "../models/user.model.js";
import { cloudinary } from "../lib/cloudinary.js";
export const suggestedUsers = async (req, res) => {
  try {
    const currentUser=req.user;

    // find users which are not connections and current user itself
  
    const suggestedUsers= await User.find({
      _id: {
        $ne: currentUser._id,
        $nin: currentUser.connections
      }
    })
    .select("name userName profilePic headline")
    .limit(3);
  
    res.status(200).json(suggestedUsers);
    
  } catch (error) {
    console.log("error in suggested users",error.message);
    res.status(500).send("Internal server error");
  }

}

export const getPublicProfile = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ userName: username }).select("-password"); 
    if(!user) {
      return res.status(404).send("User not found");
    }
    res.status(200).json(user);
    
  } catch (error) {
    console.log("error in get public profile",error.message);
    res.status(500).send("Internal server error");
  }
}

export const updateProfile = async (req, res) => {
  try {
    const allowedFields = [
      "name",
      "headline",
      "profilePic",
      "bannerImage",
      "location",
      "about",
      "skills",
      "experience",
      "education"
    ]
    let updatedProfile = {};

    for(const field of allowedFields) {
      if(req.body[field]) {
        updatedProfile[field] = req.body[field];
      }
    }

    if(req.body.profilePic) {
      const result = await cloudinary.uploader.upload(req.body.profilePic, {
        resource_type: "image",
        folder: "profile-pics"
      })
      updatedProfile.profilePic = result.secure_url;
    }
    if(req.body.bannerImage) {
      const result = await cloudinary.uploader.upload(req.body.bannerImage, {
        resource_type: "image",
        folder: "bannner-pics"
      })
      updatedProfile.bannerImage = result.secure_url;
    }

    const user = await User.findByIdAndUpdate(req.user._id, updatedProfile, { new: true });
    res.status(200).json(user);
    
  } catch (error) {
    console.log("error in update profile",error.message);
    res.status(500).send("Internal server error");
    
  }
}