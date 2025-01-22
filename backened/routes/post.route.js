import express from "express";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import upload from "../middlewares/multer.js";
import { addComment, addNewPost, bookMarkedPosts, deletePost, disLikePost, getAllCommentsOfPost, getAllPosts, getUserPost, likePost } from "../controllers/post.controller.js";
const router=express.Router();
router.route("/addpost").post(isAuthenticated,upload.single('image'),addNewPost);
router.route("/all").get(isAuthenticated,getAllPosts);
router.route("/like/:id").get(isAuthenticated,likePost);
router.route("/userpost/all").get(isAuthenticated,getUserPost);
router.route("/dislike/:id").get(isAuthenticated,disLikePost);
router.route("/:id/comment").post(isAuthenticated,addComment);
router.route("/:id/comment/all").get(isAuthenticated,getAllCommentsOfPost);
router.route("/delete/:id").delete(isAuthenticated,deletePost);
router.route("/:id/bookmark").get(isAuthenticated,bookMarkedPosts);
export default router;