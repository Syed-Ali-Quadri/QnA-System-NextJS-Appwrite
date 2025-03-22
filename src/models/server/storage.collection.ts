// Importing the internal config files.
import { Permission } from "node-appwrite";

import { storage } from "./config";
import { questionAttachmentBucket } from "../name";

export default async function getOrCreateStorage() {
    try {
        // Connecting the storage bucket.
        await storage.getBucket(questionAttachmentBucket);
        console.log("Question attached storage bucket is connected.");

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
        try {
            // Creating the storage bucket and configuring.
            await storage.createBucket(questionAttachmentBucket, questionAttachmentBucket, [
                Permission.read("any"),
                Permission.read("users"),
                Permission.create("users"),
                Permission.update("users"),
                Permission.delete("users"),
            ], false, undefined, undefined, [
                "jpg", "png", "gif", "jpeg", "webp", "heic"
            ]);
            console.log("Question attached storage bucket is created.");
            console.log("Question attached storage bucket is connected.");
        } catch (error) {
            // Error handling in the storage bucket.
            console.log("There was an error in storage bucket connection.", error);
        }
    }
}