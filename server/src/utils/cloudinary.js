import {v2 as cloudinary} from "cloudinary"
import fs from "fs"




const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null
        //upload the file on cloudinary
   
        const response = await cloudinary.uploader.upload(localFilePath, {
            folder: "profile",
             resource_type: 'auto'
        })
        // file has been uploaded successfull
        //console.log("file is uploaded on cloudinary ", response.url);
      
        fs.unlinkSync(localFilePath)
        return response;  

    } catch (error) {
        fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload operation got failed
        // console.log(error)
        return null;
    }
}


const deleteOnCloudinary = async (publicId) => {
    try {
        if (!publicId) return null
        //upload the file on cloudinary
        const response = await cloudinary.uploader.destroy(publicId)
        // file has been uploaded successfull
        //console.log("file is uploaded on cloudinary ", response.url);
      
        return response;  

    } catch (error) {
       // remove the locally saved temporary file as the upload operation got failed
        return null;
    }
}




export {uploadOnCloudinary, deleteOnCloudinary, }