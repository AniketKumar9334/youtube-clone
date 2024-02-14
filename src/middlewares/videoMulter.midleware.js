import multer from "multer";
import {v1 as uuid1} from 'uuid'

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let splitFileName = file.originalname.split(".");
    let extName = splitFileName[splitFileName.length - 1]
    if(extName === 'mp4'){
      cb(null, "./uploads/videos");
    }else{

      cb(null, "./uploads/thumbnail");
    }
  },
  filename: function (req, file, cb) {
    let splitFileName = file.originalname.split(".");
    let extName = splitFileName[splitFileName.length - 1];
    const fileName = uuid1() + "." + extName;
    cb(null, fileName);
  },
});

export const upload = multer({
  storage,
});
