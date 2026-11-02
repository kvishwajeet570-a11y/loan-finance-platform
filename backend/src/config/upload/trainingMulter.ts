import multer from "multer";
import path from "path";
import fs from "fs";
import crypto from "crypto";
const uploadDir = path.join(process.cwd(), "uploads", "training");
fs.mkdirSync(uploadDir, { recursive: true });
const fileTypes = ["video/mp4","video/webm","video/quicktime","application/pdf","application/vnd.openxmlformats-officedocument.presentationml.presentation","application/vnd.openxmlformats-officedocument.wordprocessingml.document","application/msword","application/vnd.ms-powerpoint"];
const posterTypes = ["image/jpeg","image/png","image/webp"];
const storage = multer.diskStorage({
 destination: (_req,_file,cb) => cb(null,uploadDir),
 filename: (_req,file,cb) => cb(null,`${Date.now()}-${crypto.randomBytes(8).toString("hex")}${path.extname(file.originalname).toLowerCase()}`),
});
export default multer({
 storage, limits:{fileSize:200*1024*1024,files:2,fields:12},
 fileFilter:(_req,file,cb)=>{
  const ok=file.fieldname==="poster" ? posterTypes.includes(file.mimetype) : file.fieldname==="file" && fileTypes.includes(file.mimetype);
  if(!ok) return cb(new Error(file.fieldname==="poster" ? "Poster must be JPG, PNG, or WEBP." : "Select a supported video or document."));
  cb(null,true);
 }
});
