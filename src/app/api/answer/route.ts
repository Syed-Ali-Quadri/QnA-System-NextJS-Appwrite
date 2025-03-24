import { answerCollection, db } from "@/models/name";
import { databases, users } from "@/models/server/config";
import { NextRequest, NextResponse } from "next/server";
import { ID } from "node-appwrite";

// Handles creating a new answer
export async function POST(request: NextRequest) {
    try {
        // Parse the JSON body of the request
        const { authorId, questionId, answer } = await request.json();

        // Create a new document in the database
        const response = await databases.createDocument(
            db,
            answerCollection,
            ID.unique(),
            {
                content: answer,
                authorId,
                questionId
            }
        );

        // Retrieve the preferences of the user who authored the answer
        const prefs = await users.getPrefs(authorId);
        // Increment the user's reputation by 1
        await users.updatePrefs(authorId, {
            reputation: Number(prefs.reputation) + 1
        });

        // Send a JSON response back to the client with the created document
        return NextResponse.json(
            {
                data: response
            },
            {
                status: 201 // Created
            }
        );
    } catch (error) {
        // Handle errors and send a JSON response with the error message
        NextResponse.json(
            {
                error: error?.message || "Error while creating the answer."
            },
            {
                status: error?.status || error?.code || 500
            }
        );
    }
}

// Handles deleting an existing answer
export async function DELETE(request: NextRequest) {
    try {
        // Parse the JSON body of the request
        const { answerId } = await request.json();

        // Retrieve the document (answer) from the database
        const answer = await databases.getDocument(
            db,
            answerCollection,
            answerId
        );
        // Delete the document (answer) from the database
        const response = await databases.deleteDocument(
            db,
            answerCollection,
            answerId
        );

        // Retrieve the preferences of the user who authored the answer
        const prefs = await users.getPrefs(answer.authorId);
        // Decrement the user's reputation by 1
        await users.updatePrefs(answer.authorId, {
            reputation: Number(prefs.reputation) - 1
        });

        // Send a JSON response back to the client with the deletion result
        return NextResponse.json(
            {
                data: response
            },
            {
                status: 201 // Created
            }
        );
    } catch (error) {
        // Handle errors and send a JSON response with the error message
        NextResponse.json(
            {
                error: error?.message || "Error while deleting the answer."
            },
            {
                status: error?.status || error?.code || 500
            }
        );
    }
}