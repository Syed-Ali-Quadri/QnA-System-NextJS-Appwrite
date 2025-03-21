// Importing the stuffs from external/internal lib files.
import { Permission } from "node-appwrite";

// Importing the stuffs from local files.
import {db, questionCollection} from "../name"
import {databases} from "./config"

export default async function createQuestionCollection() {
    // Create question collection.
    await databases.createCollection(db, questionCollection, questionCollection, [
        Permission.read("any"),
        Permission.read("users"),
        Permission.create("users"),
        Permission.update("users"),
        Permission.delete("users"),
    ]);

    console.log("Question collection is created.");
    
    // Assigning the attributes to the question collection.
    await Promise.all([
        databases.createStringAttribute(db, questionCollection, "title", 100, true),
        databases.createStringAttribute(db, questionCollection, "content", 10000, true),
        databases.createStringAttribute(db, questionCollection, "authorId", 50, true),
        databases.createStringAttribute(db, questionCollection, "tags", 50, false, undefined, true),
        databases.createStringAttribute(db, questionCollection, "attachmentId", 50, false),
    ]);
    
    console.log("Question collection attributes is assigned.");
}