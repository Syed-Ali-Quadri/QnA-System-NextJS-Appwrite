// Importing the stuffs from external/internal lib files.
import { Permission } from "appwrite";

// Importing the stuffs from local files.
import { db, voteCollection } from "../name";
import { databases } from "./config";

export default async function createVoteCollection() {
    // Create question collection.
    await databases.createCollection(db, voteCollection, voteCollection, [
        Permission.read("any"),
        Permission.read("users"),
        Permission.create("users"),
        Permission.update("users"),
        Permission.delete("users"),
    ]);    
    
    console.log("Vote collection is created.");

    // Assigning the attributes to the question collection.
    await Promise.all([
        databases.createEnumAttribute(db, voteCollection, "type", ["question", "answer"], true),
        databases.createEnumAttribute(db, voteCollection, "voteStatus", ["upvoted", "downvoted"], true),
        databases.createStringAttribute(db, voteCollection, "typeId", 50, true),
        databases.createStringAttribute(db, voteCollection, "votedById", 500, true),
    ]);

    console.log("Vote collection attributes is assigned.");
}