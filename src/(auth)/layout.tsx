import { useAuthStore } from "@/store/auth";
import { useRouter } from "next/router";
import { ReactNode, useEffect } from "react";

const Layout = ({ children }: { children: ReactNode }) => {
	const { session } = useAuthStore() as { session: string };
	const Router = useRouter();

	useEffect(
		() => {
			if (session) {
				Router.push("/");
			}
		},
		[session, Router]
	);

	if(session) {
		return null;
	}

	return (
		<html lang="en">
			<div className="">
				<div className="">
					{ children }
				</div>
			</div>
		</html>
	)
};

export default Layout;
