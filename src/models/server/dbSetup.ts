// Importing the internal config files.
import { databases } from "./config";
import { db } from "../name";

// Importing all the coollections.
import createQuestionCollection from "./question.collection";
import createAnswerCollection from "./answer.collection";
import createCommentCollection from "./comment.collection";
import createvoteCollection from "./vote.collection";

export async function getOrCreateDB() {
    try {
        // Connnecting the database.
        await databases.get(db);
        console.log("Database is connected.");

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
        try {
            // Creating the database.
            await databases.create(db, db)
            console.log("Database is created.")

            // Creating/saving the collections in the database.
            Promise.all([
                createQuestionCollection(),
                createAnswerCollection(),
                createCommentCollection(),
                createvoteCollection()
            ])

        } catch (error) {
            // Error handling in the database.
            console.log("There was a error in database connection.", error);
        }
    }
}