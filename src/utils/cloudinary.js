import {v2 as cloudinary} from 'cloudinary';
import fs from "fs"







    // Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET 
    });


    const uploadOnCloudinary=async(localfilepath)=>{
        try {
            if(!localfilepath)return null
            //upload the file on cloudinary
           const response=await cloudinary.uploader.upload(localfilepath,{
                resource_type: "auto"
            })
            //file has been uploaded successfully
           // console.log("file has been uploaded on Cloudinary",response.url);
            fs.unlinkSync(localfilepath)
           return response;
        }catch (error) {
            console.error("Cloudinary upload error:", error); // Add this line
            fs.unlinkSync(localfilepath);
            return null;
        }


    }
    export {uploadOnCloudinary};