import express from "express";
import { requireSignIn } from "../middlewares/authMiddleware.js";
import {
  createPostController,
  deletePostController,
  getAllPostController,
  getUserPosts,
  updatePostController,
} from "../controllers/postController.js";
import { singleUpload } from "../middlewares/multer.js";

const router = express.Router();

//create post
router.post("/create", requireSignIn, singleUpload, createPostController);

//get-all-post
router.get("/get-all-post", getAllPostController);

//get-user-post
router.get("/get-user-post", requireSignIn, getUserPosts);

//delete-post
router.delete('/delete-post/:id', requireSignIn, deletePostController )

//update-post
router.put('/update-post/:id', requireSignIn, updatePostController)


export default router;
