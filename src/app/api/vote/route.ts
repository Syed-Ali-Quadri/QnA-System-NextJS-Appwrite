import {
	answerCollection,
	db,
	questionCollection,
	voteCollection
} from "@/models/name";
import { databases, users } from "@/models/server/config";
import { NextRequest, NextResponse } from "next/server";
import { Query } from "node-appwrite";

export async function POST(request: NextRequest) {
	try {
		const { votedById, voteStatus, type, typeId } = await request.json();

		const response = await databases.listDocuments(db, voteCollection, [
			Query.equal("type", type),
			Query.equal("typeId", typeId),
			Query.equal("votedById", votedById)
		]);

		console.log(response);

		if (response.documents.length > 0) {
			await databases.deleteDocument(
				db,
				voteCollection,
				response.documents[0].$id
			);
		}

		const answerOrQuestion = await databases.getDocument(
			db,
			type === "question" ? questionCollection : answerCollection,
			typeId
		);

		const authorPrefs = await users.getPrefs(answerOrQuestion.authodId);

		if (response.documents[0]) {
			await users.updatePrefs(answerOrQuestion.authorId, {
				reputation:
					response.documents[0].voteStatus === "upvote"
						? Number(authorPrefs.reputation) - 1
						: Number(authorPrefs.reputation) + 1
			});
		} else {
			await users.updatePrefs(answerOrQuestion.authorId, {
				reputation:
					response.documents[0].voteStatus === "upvote"
						? Number(authorPrefs.reputation) + 1
						: Number(authorPrefs.reputation) - 1
			});
		}
	} catch (error) {
		return NextResponse.json(
			{
				error: error?.message || "Error while voting."
			},
			{
				status: error.status || error.code || 500
			}
		);
	}
}
