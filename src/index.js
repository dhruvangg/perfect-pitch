require('dotenv').config()
const express = require('express'),
    bodyParser = require('body-parser'),
    multer = require('multer'),
    axios = require('axios'),
    pdf = require('pdf-parse'),
    path = require("path"),
    cors = require("cors");
const connectDB = require("./config/db");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const Data = require("./models/Data");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

const app = express();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
connectDB();

app.use(bodyParser.json());

const allowedOrigins = [
    "http://localhost:5173",
    "https://dhruvangg.github.io"
];

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        methods: ["POST"],
    })
);

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "./static/index.html"));
});

app.post('/review', upload.single('resume'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }

    const pdfData = await pdf(req.file.buffer);

    const prompt = `Review this resume and provide feedback:\n\n${pdfData.text}`
    const result = await model.generateContent(prompt);
    res.json({ result: result.response.text() })
    // const data = await Data.create({ name: req.body.name, feedback: result.text });
});

app.listen(process.env.PORT, () => console.log(`Server running on http://localhost:${process.env.PORT}`));