// Importing Required Modules
import {
	answerCollection,
	db,
	questionCollection,
	voteCollection
} from "@/models/name";
import { databases, users } from "@/models/server/config";
import { NextRequest, NextResponse } from "next/server";
import { ID, Query } from "node-appwrite";

// Defining the POST function
export async function POST(request: NextRequest) {
	try {
		// Extracting Data from Request
		const { votedById, voteStatus, type, typeId } = await request.json();

		// Checking if the User Already Voted
		const response = await databases.listDocuments(db, voteCollection, [
			Query.equal("type", type),
			Query.equal("typeId", typeId),
			Query.equal("votedById", votedById)
		]);

		console.log(response);

		// If the User Already Voted, Remove Their Previous Vote
		if (response.documents.length > 0) {
			await databases.deleteDocument(
				db,
				voteCollection,
				response.documents[0].$id
			);
			// Adjusting the Author's Reputation After Vote Removal
			const answerOrQuestion = await databases.getDocument(
				db,
				type === "question" ? questionCollection : answerCollection,
				typeId
			);

			// Handling Reputation Changes
			const authorPrefs = await users.getPrefs(answerOrQuestion.authodId);
			await users.updatePrefs(answerOrQuestion.authorId, {
				reputation:
					response.documents[0].voteStatus === "upvote"
						? Number(authorPrefs.reputation) - 1
						: Number(authorPrefs.reputation) + 1
			});
		}

		// If Vote Status Changed, Create a New Vote Entry
		if (response.documents[0]?.voteStatus !== voteStatus) {
			const doc = await databases.createDocument(
				db,
				voteCollection,
				ID.unique(),
				{
					type,
					typeId,
					votedById,
					voteStatus
				}
			);

			// Adjusting Reputation Based on the New Vote
			const answerOrQuestion = await databases.getDocument(
				db,
				type === "question" ? questionCollection : answerCollection,
				typeId
			);

			const authorPrefs = await users.getPrefs(answerOrQuestion.authodId);

			// Handling Reputation Changes
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
						response.documents[0]?.voteStatus === "upvote"
							? Number(authorPrefs.reputation) + 1
							: Number(authorPrefs.reputation) - 1
				});
			}

			// Counting Total Upvotes and Downvotes
			const [upvotes, downvotes] = await Promise.all([
				databases.listDocuments(db, voteCollection, [
					Query.equal("type", type),
					Query.equal("typeId", typeId),
					Query.equal("voteStatus", "upvoted"),
					// Query.limit(1)
				]),
				databases.listDocuments(db, voteCollection, [
					Query.equal("type", type),
					Query.equal("typeId", typeId),
					Query.equal("voteStatus", "downvoted"),
					// Query.limit(1)
				])
			]);

			// Sending Response for Successful Vote
			return NextResponse.json(
				{
					data: {
						document: doc,
						voteResult: upvotes.total - downvotes.total
					},
					message: response.documents[0]
						? "Vote Status Updated"
						: "Voted"
				},
				{
					status: 201
				}
			);
		}

		// Handling Vote Withdrawal
		const [upvotes, downvotes] = await Promise.all([
			databases.listDocuments(db, voteCollection, [
				Query.equal("type", type),
				Query.equal("typeId", typeId),
				Query.equal("voteStatus", "upvoted"),
				// Query.limit(1)
			]),
			databases.listDocuments(db, voteCollection, [
				Query.equal("type", type),
				Query.equal("typeId", typeId),
				Query.equal("voteStatus", "downvoted"),
				// Query.limit(1)
			])
		]);

		return NextResponse.json(
			{
				data: {
					document: null,
					voteResult: upvotes.total - downvotes.total
				},
				message: "Vote Withdrawn"
			},
			{
				status: 200
			}
		);
	} catch (error: any) {
		// Handling Errors
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
