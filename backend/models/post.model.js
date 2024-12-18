import mongoose from "mongoose";

const postSchema = mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  content: {
    type: String,
  },
  image: {
    type: String
  },
  like:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    content: {
      type: String}
  }]
  
},{timestamps: true});

const Post = mongoose.model("Post", postSchema);

export default Post;