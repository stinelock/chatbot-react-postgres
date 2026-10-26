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
        RETURNING * 
        `;

		const userMessage = messages[0];

		const updatedMessages = await sql`
        SELECT id, thread_id, content, type, created_at
        FROM messages
        WHERE thread_id = ${threadId}
        ORDER BY created_at ASC
        `;

		const groqMessages = updatedMessages.map((m) => {
			m = {
				role: m.type === "user" ? "user" : "assistant",
				content: m.content,
			};
			return m;
		});

		const api_key = process.env.GROQ_API_KEY;
		let data;

		if (!api_key) {
			return res
				.status(500)
				.json({ error: "Missing GROQ_API_KEY for chat answer logic" });
		}

		try {
			const assistentResponse = await fetch(
				"https://api.groq.com/openai/v1/chat/completions",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${api_key}`,
					},
					body: JSON.stringify({
						model: "openai/gpt-oss-20b",
						messages: groqMessages,
					}),
				},
			);

			if (!assistentResponse.ok) {
				throw new Response("Failed to fetch from GROQ API", {
					status: assistentResponse.status,
				});
			}

			data = await assistentResponse.json();
		} catch (error) {
			console.error("Failed to fetch from GROQ API:", error);
			return res
				.status(500)
				.json({ error: "Failed to fetch from GROQ API" });
		}

		const botMessage = data.choices[0].message;

		await sql`
        INSERT INTO messages (thread_id, type, content)
        VALUES (${threadId}, ${botMessage.role === "user" ? "user" : "bot"}, ${botMessage.content})`;

        return res.status(201).json({userMessage, botMessage});
	} catch (error) {
		console.error("Failed to fetch messages:", error);
		res.status(500).json({
			error: "Could not create message",
		});
	}
});

app.post("/api/test-groq", async (req, res) => {
	const api_key = process.env.GROQ_API_KEY;
	if (!api_key) {
		return res
			.status(500)
			.json({ error: "Missing GROQ_API_KEY for chat answer logic" });
	}

	try {
		const assistentResponse = await fetch(
			"https://api.groq.com/openai/v1/chat/completions",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${api_key}`,
				},
				body: JSON.stringify({
					model: "openai/gpt-oss-20b",
					messages: req.body.messages,
				}),
			},
		);

		if (!assistentResponse.ok) {
			throw new Response("Failed to fetch from GROQ API", {
				status: assistentResponse.status,
			});
		}

		const data = await assistentResponse.json();

		return res.status(201).json(data);
	} catch (error) {
		console.error("Failed to fetch from GROQ API:", error);
		return res.status(500).json({ error: "Failed to fetch from GROQ API" });
	}
});

app.listen(port, () =>
	console.log(`Server running on port: http://localhost:${port}`),
);
