// import { deleteblog, files, getBlogByCategory, getBlogById, getBlogByUser, getBlogs, newPost, updateblog } from '../controllers/posts';
// import { getuserByKinde, getuserBymail, getusers, newUser, putUser, removeUser } from '../controllers/auth';
import { loginUser, refreshToken, registerUser } from '../controllers/auth';
import express from 'express';
import authMiddleware from '../middleware';
import { validateEmail } from '../middleware/emailValidator';
import { forgotPassword, resetpassword } from '../controllers/passwordreset';
import { createProfileHandler } from '../controllers/createprofile';
// import { getCategory, postcategory, getCatgeoryById, updatecategory, deletecategoryById } from '../controllers/category';
// import { upload } from '../utils/upload';
// import { deletecommentById, getcommentById, getcomments, postcomment, updatecomment } from '../controllers/comment';
// import authenticateJWT from '../middleware';


const routes = express.Router();


// // auth user

// routes.get("/getusers", authenticateJWT, getusers)
routes.post("/registeruser", registerUser)
routes.post("/loginuser",loginUser)
routes.post("/refreshtoken",refreshToken)

// Reset password
routes.post("/forgot-password", validateEmail, forgotPassword)
routes.post("/reset-password", resetpassword)


routes.post("/createProfile", createProfileHandler);
// routes.get("/getuserbyemail", authenticateJWT, getuserBymail)
// routes.get("/getuserbykinde", authenticateJWT, getuserByKinde)
// routes.patch("/updateuser", authenticateJWT, putUser)
// routes.delete("/deleteuser", authenticateJWT, removeUser)


// // blogs

// routes.post("/createblog", authenticateJWT, upload.single('image'), newPost)
// routes.patch("/updateblog", authenticateJWT, updateblog)
// routes.get("/getblogs", authenticateJWT, getBlogs)
// routes.get("/getblog", authenticateJWT, getBlogById)
// routes.get("/getblogbycat", authenticateJWT, getBlogByCategory)
// routes.delete("/deleteblog", authenticateJWT, deleteblog)
// routes.get("/getBlogByuser", authenticateJWT, getBlogByUser)


// // category


// routes.post("/postcategory", authenticateJWT, postcategory)
// routes.get("/retrievecategories", authenticateJWT, getCategory)
// routes.patch("/updatecategory", authenticateJWT, updatecategory)
// routes.get("/retrievecategory", authenticateJWT, getCatgeoryById)
// routes.delete("/deletecategory", authenticateJWT, deletecategoryById)

// // comments
// routes.post("/postcomment", authenticateJWT, postcomment)
// routes.get("/retrievecomments", authenticateJWT, getcomments)
// routes.patch("/updatecomment", authenticateJWT, updatecomment)
// routes.get("/retrievecomment", authenticateJWT, getcommentById)
// routes.delete("/deletecomment", authenticateJWT, deletecommentById)


export default routes;
