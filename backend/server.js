import express from 'express'
import cors from 'cors'
import sql from './db';

const app = express();
const port = process.env.PORT;

app.use(cors());

app.get("/", (req,res) => {
    res.json('Velkommen til!')
})

app.listen(port, () => console.log(`Server running on port: http://localhost:${port}`));