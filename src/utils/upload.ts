import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

// Cloudinary configuration
cloudinary.config({
    cloud_name: 'dsp3koxbb',
    api_key: '712128876688431',
    api_secret: 'uBHazNFklotm0DLSNbS_0AdgAJ4'
});

// Create a storage engine to save the files in Cloudinary
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params:async (req, file) => {
        // async code using `req` and `file`
        // ...
        return {
          folder: 'uploads',
          public_id: 'posts',
        };
      },
});
   
export const upload = multer({ storage: storage });
