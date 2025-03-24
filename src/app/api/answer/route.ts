import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	try {
		const { authorId, questionId, answer } = await request.json();
		console.log(authorId);
		console.log(questionId);
		console.log(answer);
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
