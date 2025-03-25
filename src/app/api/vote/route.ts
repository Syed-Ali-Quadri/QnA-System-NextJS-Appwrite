import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	try {
        const { votedById, voteStatus, type, typeId } = await request.json();

	} catch (error) {
		return NextResponse.json({
			error: error?.message || "Error while voting."
		}, {
            status: error.status || error.code || 500
        });
	}
}
