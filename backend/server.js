import express from "express";
import cors from "cors";
import sql from "./db.js";

const app = express();
const port = process.env.PORT;

//MIDDLEWARE
app.use(cors());
app.use(express.json()); //Sikre at et postrequest sendes som JSON i stedet for bytes - eller er req.body undefined

//ROUTES
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
		res.status(500).json({ error: "Could not fetch thread data" });
	}
});

app.get("/api/threads/:id", async (req, res) => {
	try {
		const threadId = req.params.id;
		const threads = await sql`
        SELECT id, title, created_at
        FROM threads
        WHERE id = ${threadId}`;

		if (threads.length === 0) {
			return res
				.status(404)
				.json({ error: "Could not find chat thread" });
		}

		return res.json(threads[0]);
	} catch (error) {
		console.error("Failed to fetch thread:", error);
		res.status(500).json({ error: "Could not fetch thread data" });
	}
});

app.get("/api/threads/:id/messages", async (req, res) => {
	try {
		const threadId = req.params.id;
		const messages = await sql`
        SELECT id, content, type, thread_id, created_at
        FROM messages
        WHERE thread_id = ${threadId}
        ORDER BY created_at ASC`;

		return res.json(messages);
	} catch (error) {
		console.error("Failed to fetch messages:", error);
		res.status(500).json({
			error: "Could not find thread messages",
		});
	}
});

app.post("/api/threads/:id/messages", async (req, res) => {
	try {
		const threadId = req.params.id;
		const { content, type } = req.body ?? {};

		if (!content || !type) {
			return res.status(400).json({
				error: "Missing required fields: content and type are required",
			});
		}

		const trimmedContent = content.trim();

		if (type !== "user" && type !== "bot") {
			return res
				.status(400)
				.json({ error: "Invalid type: must be 'user' or 'bot'" });
		}

		if (!trimmedContent) {
			return res.status(400).json({
				error: "Message content cannot be empty",
			});
		}

		const messages = await sql`
        INSERT INTO messages (thread_id, content, type)
        VALUES (${threadId}, ${trimmedContent}, ${type})
        RETURNING content, type, thread_id, created_at 
        `;

		return res.status(201).json(messages[0]);
	} catch (error) {
		console.error("Failed to fetch messages:", error);
		res.status(500).json({
			error: "Could not create message",
		});
	}
});

app.delete("/api/threads/:id", async (req, res) => {
	try {
		const threadId = req.params.id;

		if (!threadId) {
			return res
				.status(400)
				.json({
					error: "The thread you wish to delete does not exist",
				});
		}

		const deleteThread = await sql`
        DELETE FROM threads
        WHERE id = ${threadId}
        RETURNING title`;

		if (deleteThread.length === 0) {
			return res.status(404).json({
				error: "The thread you wish to delete does not exist",
			});
		}

		return res.status(200).json({
			message: `Thread with title "${deleteThread[0].title}" has been deleted`,
		});
	} catch (error) {
		console.error("Failed to delete thread:", error);
		return res.status(500).json({
			error: "Could not delete thread",
		});
	}
});

app.listen(port, () =>
	console.log(`Server running on port: http://localhost:${port}`),
);
