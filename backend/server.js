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
			return res.status(400).json({
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

app.post("/api/threads", async (req, res) => {
	try {
		const { title, content } = req.body ?? {};
		const TEST_USER_ID = "b94614de-f124-43de-b36f-81b44e09b024"; // Replace with the actual user ID later when implementing authentication

		console.log(
			"Received request to create thread with title:",
			title,
			"and content:",
			content,
		);

		const trimmedTitle = title?.trim();
		const trimmedContent = content?.trim();

		if (!trimmedTitle || !trimmedContent) {
			return res.status(400).json({
				error: "Missing required fields: title and content are required",
			});
		}

		// Sequelize transaction to ensure both thread and message are created together - otherwise if one fails, the other will not be created
		const { thread, message } = await sql.begin(async (sql) => {
			const [thread] = await sql`
                INSERT INTO threads (title, user_id)
                VALUES (${trimmedTitle}, ${TEST_USER_ID})
                RETURNING id, title, created_at
                `;

			const [message] = await sql`
                INSERT INTO messages (thread_id, type, content)
                VALUES (${thread.id}, 'user', ${trimmedContent})
                RETURNING id, thread_id, type, content, created_at
                `;

			return { thread, message };
		});
		res.status(201).json({ thread, message });
	} catch (error) {
		console.error("Failed to create thread:", error);
		return res.status(500).json({
			error: "Could not create thread",
		});
	}
});

app.patch("/api/threads/:id", async (req, res) => {
	try {
		const threadId = req.params.id;
		const { title } = req.body ?? {};

		if (!title || !title.trim()) {
			return res.status(400).json({
				error: "Missing required field: title is required",
			});
		}

		const updatedThread = await sql`
        UPDATE threads
        SET title = ${title}
        WHERE id = ${threadId}
        RETURNING id, title, created_at
        `;

		if (updatedThread.length === 0) {
			return res.status(404).json({
				error: "Could not find thread to update",
			});
		}

		return res.status(200).json(updatedThread[0]);
	} catch (error) {
		console.error("Failed to update thread:", error);
		return res.status(500).json({
			error: "Could not update thread",
		});
	}
});

app.listen(port, () =>
	console.log(`Server running on port: http://localhost:${port}`),
);
