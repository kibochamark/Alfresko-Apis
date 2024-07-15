// import { deleteblog, files, getBlogByCategory, getBlogById, getBlogByUser, getBlogs, newPost, updateblog } from '../controllers/posts';
// import { getuserByKinde, getuserBymail, getusers, newUser, putUser, removeUser } from '../controllers/auth';
import { loginUser, logoutUser, refreshToken, registerUser, testlogout } from '../controllers/auth';
import express from 'express';
import authMiddleware from '../middleware';
import { validateEmail } from '../middleware/emailValidator';
import { forgotPassword, resetpassword } from '../controllers/passwordreset';
import checkTokenBlacklist from '../middleware/blacklist';
import { createProfileHandler, updateProfileHandler, deleteProfileHandler, getUsersWithProfilesHandler, getUserWithProfileHandler, deleteUserHandler } from '../controllers/profile';
import { createRole, deleteRole, getRole, getRoles, updateRole } from '../controllers/roles';
import { assignpermissiontorole, createPermission, deletePermission, getPermission, updatePermission } from '../controllers/permissions';
// import { getCategory, postcategory, getCatgeoryById, updatecategory, deletecategoryById } from '../controllers/category';
// import { upload } from '../utils/upload';
// import { deletecommentById, getcommentById, getcomments, postcomment, updatecomment } from '../controllers/comment';
// import authenticateJWT from '../middleware';


const routes = express.Router();


// // auth user

// routes.get("/getusers", authenticateJWT, getusers)
routes.post("/registeruser",validateEmail, registerUser)
routes.post("/loginuser",validateEmail,loginUser)
routes.post("/refreshtoken",refreshToken)
routes.get("/testlogout", checkTokenBlacklist, authMiddleware, testlogout)
routes.post("/logout",  authMiddleware, logoutUser)

// Reset password
routes.post("/forgot-password", validateEmail, forgotPassword)
routes.post("/reset-password", resetpassword)

// profile
routes.post("/createprofile", checkTokenBlacklist, authMiddleware, createProfileHandler)
routes.put("/updateProfile", checkTokenBlacklist, authMiddleware, updateProfileHandler)
routes.get("/getUsersWithProfiles", checkTokenBlacklist, authMiddleware, getUsersWithProfilesHandler)
routes.get("/getUserWithProfile/:id", checkTokenBlacklist, authMiddleware, getUserWithProfileHandler)
routes.delete("/deleteUser/:id",checkTokenBlacklist, authMiddleware, deleteUserHandler);
routes.delete("/deleteProfile", checkTokenBlacklist, authMiddleware, deleteProfileHandler);

// role
routes.get("/getrole", checkTokenBlacklist, authMiddleware, getRole)
routes.get("/getroles", checkTokenBlacklist, authMiddleware, getRoles)
routes.delete("/deleterole", checkTokenBlacklist, authMiddleware, deleteRole)
routes.patch("/updaterole", checkTokenBlacklist, authMiddleware, updateRole)

routes.post("/createrole", checkTokenBlacklist, authMiddleware, createRole);

// permission
routes.get("/getpermission", checkTokenBlacklist, authMiddleware, getPermission)
routes.get("/roles/:roleId/permissions", checkTokenBlacklist, authMiddleware,assignpermissiontorole)
// routes.get("/getpermissions", checkTokenBlacklist, authMiddleware, getPer)
routes.delete("/deletepermission", checkTokenBlacklist, authMiddleware, deletePermission)
routes.patch("/updatepermission", checkTokenBlacklist, authMiddleware, updatePermission)
routes.post("/createpermission", checkTokenBlacklist, authMiddleware, createPermission);



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
