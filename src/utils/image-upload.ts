import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: import.meta.env.CLOUDINARY_CLOUD_NAME,
    api_key: import.meta.env.CLOUDINARY_API_KEY,
    api_secret: import.meta.env.CLOUDINARY_API_SECRET,
});

export class ImageUpload {
    static async upload(file: File) {

        const buffer = await file.arrayBuffer();
        const base64Image = Buffer.from(buffer).toString('base64');
        const imageType = file.type.split('/')[1]; // Get the image type (e.g., 'jpeg', 'png')


        const resp = await cloudinary.uploader.upload(
            `data:image/${imageType};base64,${base64Image}`,
        );

        console.log(resp);

        return resp.secure_url; // Return the URL of the uploaded image
    }

    static async delete(image: string) {
        try {
            const imageName = image.split("/").pop() ?? "";
            const imageId = imageName.split(".")[0]; // Extract the image ID from the URL

            const resp = await cloudinary.uploader.destroy(imageId);
            console.log("Image uploaded: ", resp);
            return true;

        } catch (error) {
            console.log(error);
            return false;
        }
    }
}