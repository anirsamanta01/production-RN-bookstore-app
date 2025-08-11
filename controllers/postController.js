import Post from "../models/postModel.js";
import { getDataUri } from "../utils/imageFeatures.js";
import cloudinary from "cloudinary";

//create post
export const createPostController = async (req, res) => {
  try {
    const { title, caption } = req.body;
    if (!title || !caption) {
      return res
        .status(400)
        .send({ success: false, message: "Please fill in all fields" });
    }
    // Image check
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image is required",
      });
    }

    // Convert file to data URI
    const fileUri = getDataUri(req.file);

    // Upload to Cloudinary
    const cloudResponse = await cloudinary.v2.uploader.upload(fileUri.content, {
      folder: "posts",
    });

    // Create post
    const post = await Post.create({
      title,
      caption,
      image: {
        public_id: cloudResponse.public_id,
        url: cloudResponse.secure_url,
      },
      postedBy: req.auth._id,
    });
    return res
      .status(201)
      .send({ success: true, message: "Post created successfully", post });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error creating post",
      error,
    });
  }
};

//get-all-post
export const getAllPostController = async (req, res) => {
  try {
    const posts = await Post.find().populate("postedBy", "_id name").sort({
      createdAt: -1,
    });
    return res
      .status(200)
      .send({ success: true, message: "All posts...", posts });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error getting post",
      error,
    });
  }
};

//get user posts

export const getUserPosts = async (req, res) => {
  try {
    const userPosts = await Post.find({ postedBy: req.auth._id });
    res.status(200).send({
      success: true,
      message: "User posts...",
      userPosts,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error getting post",
      error,
    });
  }
};

//delete-post
export const deletePostController = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }

    // Delete image from Cloudinary
    if (post.image?.public_id) {
      await cloudinary.v2.uploader.destroy(post.image.public_id);
    }

    await post.deleteOne();

    res.status(200).send({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error getting in delete post",
      error,
    });
  }
};

//update-post
export const updatePostController = async (req, res) => {
  try {
    const { title, caption } = req.body;
    const post = await Post.findById({ _id: req.params.id });
    if (!(title || caption)) {
      return res.status(500).send({
        success: false,
        message: "Please provide title and caption",
      });
    }
    const updatedPost = await Post.findByIdAndUpdate(
      { _id: req.params.id },
      { title: title || post?.title, caption: caption || post?.caption },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "Post updated successfully",
      updatedPost,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error getting in update post",
      error,
    });
  }
};
