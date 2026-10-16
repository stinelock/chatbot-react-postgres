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
		const threads = sql`  
        SELECT id, title, created_at
        FROM threads
        ORDER BY created_at DESC
        `;

		res.json(threads);
	} catch {
		console.error("Descriptive message:", error);
		res.status(500).json({ error: "Generic message for users" });
	}
});

app.listen(port, () =>
	console.log(`Server running on port: http://localhost:${port}`),
);
