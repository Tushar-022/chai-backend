import { Router } from "express";
import {upload} from '../middlewares/multer.middleware.js'
import {registerUser} from "../controllers/user.controller.js";

const router=Router();

// middleware is like jaane se phle milkar jaana so register krne se phle file upload bhi krvaani hai 
//apnko user se so upload middleware  use krlete hai
router.route('/register').post(

    upload.fields(// it accepts an array of fileds to inject in it
        {
            name:avatar,
            maxCount:1

        },
        {
            name:CoverImage ,
            maxCount:1
        }
    ),

    registerUser
    );

export default router;