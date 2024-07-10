import { UploadApiResponse, v2 } from "cloudinary";
import { config } from "../config";
import { ErrorTypes } from "../constants/ErrorTypes";
import ApolloError from "./ApolloError";

v2.config(config.cloudinary);

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
  } catch (error: any) {
    return ApolloError(`Upload Image error :${error}`, ErrorTypes.BAD_REQUEST);
  }
};

const removeFromCloudinary = async (public_id: string): Promise<void> => {
  try {
    await v2.uploader.destroy(public_id);
  } catch (error: any) {
    return ApolloError(`Remove Image error :${error}`, ErrorTypes.BAD_REQUEST);
  }
};

export { removeFromCloudinary, uploadCloudinary };
