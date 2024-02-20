import multer from "multer";
import {v1 as uuid1} from 'uuid'
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./uploads/profile")
    },
    filename: function (req, file, cb) {
      let splitFileName = file.originalname.split('.')
      let extName = splitFileName[splitFileName.length - 1]
      const fileName = uuid1() + '.' + extName;
      cb(null, fileName)
    }
  })
  
export const upload = multer({ 
    storage, 
})