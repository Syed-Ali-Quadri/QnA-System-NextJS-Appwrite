// Importing the stuffs from external/internal lib files.
import { Permission } from "appwrite";

// Importing the stuffs from local files.
import { db, commentCollection } from "../name";
import { databases } from "./config";

export default async function createCommentCollection() {
    // Create question collection.
    await databases.createCollection(db, commentCollection, commentCollection, [
        Permission.read("any"),
        Permission.read("user"),
        Permission.create("user"),
        Permission.update("user"),
        Permission.delete("user"),
    ]);    
    
    console.log("Answer collection is created.");

    // Assigning the attributes to the question collection.
    await Promise.all([
        databases.createStringAttribute(db, commentCollection, "content", 10000, true),
        databases.createEnumAttribute(db, commentCollection, "type", ["question", "answer"], true),
        databases.createStringAttribute(db, commentCollection, "typeId", 50, true),
        databases.createStringAttribute(db, commentCollection, "authorId", 50, true),
    ]);

    console.log("Comment collection attributes is assigned.");
}