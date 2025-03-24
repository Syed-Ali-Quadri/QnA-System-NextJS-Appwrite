import { answerCollection, db } from "@/models/name";
import { databases, users } from "@/models/server/config";
import { NextRequest, NextResponse } from "next/server";
import { ID } from "node-appwrite";

export async function POST(request: NextRequest) {
	try {
		const { authorId, questionId, answer } = await request.json();

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

		const prefs = await users.getPrefs(authorId);
		await users.updatePrefs(authorId, {
			reputation: Number(prefs.reputation) + 1
		});

		return NextResponse.json(
			{
				data: response
			},
			{
				status: 201
			}
		);
	} catch (error) {
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

export async function DELETE(request: NextRequest) {
	try {
		const { answerId } = await request.json();

		const answer = await databases.getDocument(
			db,
			answerCollection,
			answerId
		);
		const response = await databases.deleteDocument(
			db,
			answerCollection,
			answerId
		);

		const prefs = await users.getPrefs(answer.authorId);
		await users.updatePrefs(answer.authorId, {
			reputation: Number(prefs.reputation) - 1
		});

		return NextResponse.json(
			{
				data: response
			},
			{
				status: 201
			}
		);
	} catch (error) {
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
