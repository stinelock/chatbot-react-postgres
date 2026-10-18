import express from "express";
import cors from "cors";
import sql from "./db.js";

const app = express();
const port = process.env.PORT;

app.use(cors());

app.get("/", (req, res) => {
	res.json("Velkommen til!");
});

app.get("/api/threads", async (req, res) => {
	try {
		const threads = await sql`  
        SELECT id, title, created_at
        FROM threads
        ORDER BY created_at DESC
        `;

		res.json(threads);
	} catch (error) {
		console.error("Failed to fetch threads:", error);
		res.status(500).json({ error: "Kunne ikke hente chats data" });
	}
});

app.get("/api/threads/:id", async (req, res) => {
	try {
		const threadId = req.params.id;
		const threads = await sql`
        SELECT id, title, created_at
        FROM threads
        WHERE id = ${threadId}`;

		if (thread.length === 0) {
			return res.status(404).json({ error: "Kunne ikke chat-tråden" });
		}

		return res.json(threads[0]);
	} catch (error) {
		console.error("Failed to fetch thread:", error);
		res.status(500).json({ error: "Kunne ikke hente data for denne chat" });
	}
});

app.listen(port, () =>
	console.log(`Server running on port: http://localhost:${port}`),
);
