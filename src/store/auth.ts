import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist } from "zustand/middleware";

import { AppwriteException, ID } from "appwrite";
import { account } from "@/models/client/config";

export const useAuthStore = create()(
	persist(
		immer((set) => ({
			user: null,
			jwt: null,
			session: null,
			hydrated: false,

			setHydrated() {
				set({ hydrated: true });
			},

			async verifySession() {
				try {
					const session = await account.getSession("current");
					const user = await account.get();
					set({ session, user });
				} catch (error) {
					console.log(error);
				}
			},

			async login(email: string, password: string) {
				try {
					const session = await account.createEmailPasswordSession(
						email,
						password
					);
					console.log(session);

					const [user, jwtData] = await Promise.all([
						account.get(),
						account.createJWT()
					]);

					console.log(user);
					console.log(jwtData.jwt);

					if (!user.prefs || !user.prefs.reputation) {
						await account.updatePrefs({ reputation: 0 });

						// Update user state after modifying prefs
						const updatedUser = await account.get();
						set({ user: updatedUser });
					}

					set({ session, user, jwt: jwtData.jwt });

					return { success: true, error: null };
				} catch (error) {
					console.log(error);
					return {
						success: false,
						error: error instanceof AppwriteException ? error : null
					};
				}
			},

			async createAccount(name: string, email: string, password: string) {
				try {
					await account.create(ID.unique(), email, password, name);
					return { success: true };
				} catch (error) {
					console.log(error);
					return {
						success: false,
						error: error instanceof AppwriteException ? error : null
					};
				}
			},

			async logout() {
				try {
					await account.deleteSessions();
					set({ user: null, jwt: null, session: null });
				} catch (error) {
					console.log(error);
				}
			}
		})),
		{
			name: "Auth",
			onRehydrateStorage() {
				return (state, error) => {
					if (!error && state) {
						// @ts-expect-error-sillyError
						state.setHydrated();
					}
				};
			}
		}
	)
);
