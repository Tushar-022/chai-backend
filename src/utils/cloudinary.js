import {v2 as cloudinary} from "cloudinary"
import fs from "fs"


//import {v2 as cloudinary} from 'cloudinary';
          
cloudinary.config({ 
  cloud_name: 'dl4wswqai', 
  api_key: '699654545317714', 
  api_secret: '9-ZiIJRAKraufQ0Q6PEk97C5ZRw' 
});

// cloudinary.config({ 
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
//   api_key: process.env.CLOUDINARY_API_KEY, 
//   api_secret: process.env.CLOUDINARY_API_SECRET 
// });

const uploadOnCloudinary = async (localFilePath) => {
    try {
        console.log(localFilePath);
        if (!localFilePath) return null
        //upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })

        
       // console.log(response);
        // file has been uploaded successfull
       // console.log("file is uploaded on cloudinary ", response.url);

         fs.unlinkSync(localFilePath)
        return response;

    } catch (error) {
       // fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload operation got failed
        return null;
    }
}



export {uploadOnCloudinary}