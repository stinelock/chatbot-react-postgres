import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
	throw new Error(
		"SUPABASE_URL and SUPABASE_ANON_KEY must be set before starting the backend.",
	);
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function requireAuth(req, res, next) {
	const authHeader = req.headers.authorization;

	if (!authHeader) {
		return res
			.status(401)
			.json({ error: "Missing or invalid Authorization header" });
	}

	const token = authHeader?.startsWith("Bearer ")
		? authHeader.slice(7)
		: null;

	try {
		const {
			data: { user },
			error,
		} = await supabase.auth.getUser(token);

		if (error || !user) {
			return res.status(401).json({ error: "Invalid or expired token" });
		}

		req.userId = user.id;
		return next();
	} catch (error) {
		console.error("Failed to verify authentication token:", error);
		return res.status(401).json({ error: "Could not verify token" });
	}
}
