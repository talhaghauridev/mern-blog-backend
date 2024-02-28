import { AuthenticationError } from "apollo-server-express";
import { v2, UploadApiResponse } from "cloudinary";

const uploadCloudinary = async (
  file: string,
  folder: string
): Promise<UploadApiResponse> => {
  try {
    const response = await v2.uploader.upload(file, {
      folder,
      resource_type: "auto",
    });

    return response;
  } catch (error) {
    throw new AuthenticationError(error as string);
  }
};

const removeCloudinary = async (public_id: string): Promise<void> => {
  try {
    await v2.uploader.destroy(public_id);
  } catch (error) {
    throw new AuthenticationError(error as string);
  }
};

export { uploadCloudinary, removeCloudinary };
