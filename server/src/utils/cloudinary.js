import {v2 as cloudinary} from "cloudinary"
import fs from "fs"
import AWS from 'aws-sdk';




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

AWS.config.update({
    region: "ap-south-1",
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  });
  
  const s3 = new AWS.S3();
  
 export const uploadVideoToS3 = async (filePath, bucketName, key) => {
    const fileStream = fs.createReadStream(filePath);
  
    const params = {
      Bucket: bucketName,
      Key: key,
      Body: fileStream,
      ContentType: 'video/mp4',
    };
  
    return s3.upload(params).promise();
  };


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