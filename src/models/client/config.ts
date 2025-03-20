import { Client, Account, Databases, Storage } from "appwrite";
import env from "@/app/env";

const client = new Client()
	.setEndpoint(env.appwrite.endpoint)
	.setProject(env.appwrite.projectId);

const account = new Account(client);
const databases = new Databases(client);
const storage = new Storage(client);

export { account, databases, storage };
