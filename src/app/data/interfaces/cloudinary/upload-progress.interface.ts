import { CloudinaryUploadResponse } from "./cloudinary-upload-responce.interface";


export interface UploadProgress {
  progress: number;
  response?: CloudinaryUploadResponse;
}