import { cloudinary } from "../lib/cloudinary.js";
import Notification from "../models/notification.model.js";
import Post from "../models/post.model.js";

export const getFeedPosts = async (req, res) => {

  try {
    const posts = await Post.find({author : {$in : req.user.connections}})
    .populate("author","name userName profilePic")
    .populate("like","name userName profilePic")
    .populate("comments.author","name userName profilePic")
    .sort({createdAt : -1});
  
    res.status(200).json(posts);
    
  } catch (error) {
   console.log("error in get feed posts",error.message);
    res.status(500).send("Internal server error"); 
  }
}

export const createPost = async (req, res) => {
  try {
    const { content, image } = req.body;

    let newPost;
    if(image) {
      const result = await cloudinary.uploader.upload(image, {
        resource_type: "image",
        folder: "posts"
      })
      newPost = new Post({
        author: req.user._id,
        content,
        image: result.secure_url
      })
    } else {
      newPost = new Post({
        author: req.user._id,
        content
      })
    }
    await newPost.save();
    res.status(201).json(newPost);
    
  } catch (error) {
    console.log("error in create post",error.message);
    res.status(500).send("Internal server error");
  }
}

export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    if(!post) {
      return res.status(404).send("Post not found");
    }
    // check if the user is the author of the post
    if(post.author.toString() !== req.user._id) {
      return res.status(401).send("Unauthorized");
    }
    await Post.findByIdAndDelete(id);

    if(post.image) {
      await cloudinary.uploader.destroy(post.image.split("/").pop().split(".")[0]);
    }
    res.status(200).send("Post deleted");
    
  } catch (error) {
    console.log("error in delete post",error.message);
    res.status(500).send("Internal server error");
  }
}

export const getPostById = async (req,res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id)
    .populate("author","name userName profilePic")
    .populate("like","name userName profilePic")
    .populate("comments.author","name userName profilePic");
    if(!post) {
      return res.status(404).send("Post not found");
    }
    res.status(200).json(post);
  } catch (error) {
    console.log("error in get post by id",error.message);
    res.status(500).send("Internal server error");
  }
}

export const createComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const post = await Post.findByIdAndUpdate(id, {
      $push: {
        comments: {
          author: req.user._id,
          content
        }
      }
    },{
      new: true})
    .populate("author","name userName profilePic")

    // create a notification if comment owner is not the post author
    if(post.author.toString() !== req.user._id) {
      const notification = new Notification({
        recipient: post.author,
        type: "comment",
        relatedUser: req.user._id,
        relatedPost: post._id
      })
      await notification.save();
      // todo send email
    }


    res.status(201).json(post);
  } catch (error) {
    console.log("error in create comment",error.message);
    res.status(500).send("Internal server error");
  }
}