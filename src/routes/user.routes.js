import { Router } from "express";
import {upload} from '../middlewares/multer.middleware.js'
import {registerUser} from "../controllers/user.controller.js";
import { loginUser } from "../controllers/user.controller.js";
import { logoutUser } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router=Router();

// middleware is like jaane se phle milkar jaana so register krne se phle file upload bhi krvaani hai 
//apnko user se so upload middleware  use krlete hai
router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        }, 
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser
    )

    router.route("/login").post(loginUser);
    // isme next() pass kr rahe hai iska mtlb ek route se dusre route pr ja rhe hai and agr vo logoutUser pr pahuch gya means uske 
    // request field mai user hoga 
    router.route("/logout").post(verifyJWT,logoutUser);


export default router;