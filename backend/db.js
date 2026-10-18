import postgres from "postgres";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
	throw new Error(
		"DATABASE_URL is missing. Set it in the environment before starting the server.",
	);
}

const sql = postgres(databaseUrl);

export default sql;