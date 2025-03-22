// Importing the stuffs from external/internal lib files.
import { Permission } from "appwrite";

// Importing the stuffs from local files.
import { db, answerCollection } from "../name";
import { databases } from "./config";

export default async function createAnswerCollection() {
    // Create question collection.
    await databases.createCollection(db, answerCollection, answerCollection, [
        Permission.read("any"),
        Permission.read("users"),
        Permission.create("users"),
        Permission.update("users"),
        Permission.delete("users"),
    ]);
    
    console.log("Answer collection is created.");

    // Assigning the attributes to the question collection.
    await Promise.all([
        databases.createStringAttribute(db, answerCollection, "content", 10000, true),
        databases.createStringAttribute(db, answerCollection, "questionId", 50, true),
        databases.createStringAttribute(db, answerCollection, "authorId", 50, true),
    ]);

    console.log("Answer collection attributes is assigned.");
}