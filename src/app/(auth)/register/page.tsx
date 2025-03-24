"use client"

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function Register() {

	return (
		<div className="flex items-center justify-center min-h-screen bg-gray-100">
			<Card className="w-full max-w-md p-6 shadow-lg bg-white">
				<CardHeader>
					<CardTitle className="text-center text-xl font-semibold">
						Sign Up
					</CardTitle>
				</CardHeader>
				<CardContent>
					<form className="space-y-4">
						<div>
							<Label htmlFor="name">Name</Label>
							<Input
								id="name"
								name="name"
								type="text"
								placeholder="Enter your name"
							/>
						</div>
						<div>
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								name="email"
								type="email"
								placeholder="Enter your email"
							/>
						</div>
						<div>
							<Label htmlFor="password">Password</Label>
							<Input
								id="password"
								name="password"
								type="password"
								placeholder="Enter your password"
							/>
						</div>
						<Button type="submit" className="w-full">
							Sign Up
						</Button>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
