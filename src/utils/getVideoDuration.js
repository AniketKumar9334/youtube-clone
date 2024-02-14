import { videoDuration } from "@numairawan/video-duration";

export const getVideoDuration = async (filePath) =>{
 
  try {
    const duration = await videoDuration(filePath);
    return duration.seconds
  } catch (error) {
    console.error(error);
  }
}
