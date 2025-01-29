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
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const app = express();
const upload = multer({ dest: 'uploads/' });
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
    const filePath = req.file.path;
    const parsedData = await pdf(filePath);

    const prompt = parsedData.text;
    const result = await model.generateContent(prompt);
    const data = await Data.create({ name: req.body.name, feedback: parsedData.text });
    res.json({ result: result.response.text() })

    // res.json({
    //     "result": "## Dhruvang Gajjar - Restructured Resume\n\nThis version restructures Dhruvang Gajjar's resume for improved readability and impact, emphasizing achievements and quantifiable results.\n\n**Contact:**\n\nDhruvang Gajjar | (91) 81558 96243 | dhruvangg@gmail.com | dhruvangg.github.io | in.linkedin.com/in/dhruvangg\n\n\n**Summary:**\n\nHighly skilled and results-oriented Software Engineer with 7+ years of experience building responsive, user-friendly web applications using React.js, Node.js, and various other technologies. Proven ability to deliver high-quality solutions, streamline workflows, and enhance team collaboration.  Dedicated to creating optimized and accessible applications.\n\n\n**Experience:**\n\n**Cygnet.one | Senior Software Engineer | July 2022 – Present**\n\n* **Model-Based Engineering Implementation:**  Successfully implemented the Model-Based Engineering (MBE) module in Solumina MES Software (iBASEt) using Hoops library, resulting in streamlined workflows and improved accuracy of engineering data throughout the manufacturing process.\n* **Real-Time Messaging Feature Development:** Designed and integrated a real-time messaging feature in Solumina's Group Job module, enhancing communication and collaboration, and significantly improving operational efficiency.\n* **Module Development (Group Job Executions):** Developed functionalities for managing parts, tools, buyoffs, and data collection, leading to improved workflow efficiency within the Group Job module.\n* **Collaborative Development:**  Collaborated effectively with cross-functional teams to align Solumina features with manufacturing requirements and enhance system usability.\n\n\n**Uplers | Senior Javascript Developer | April 2021 – June 2022**\n\n* **Project Management & Scope Definition:** Estimated project timelines, created detailed documentation, and defined scopes of work, ensuring project alignment and clarity.\n* **Code Reusability & Optimization:** Designed and implemented reusable code components, maintaining code repositories to optimize development processes and ensure future project efficiency.\n* **Team Leadership & Training:** Conducted webinars and training sessions, upskilling developers on new technologies and establishing efficient work patterns.\n* **Frontend Development:** Developed highly responsive UI components using Vanilla JavaScript and ReactJS, improving frontend performance and user experience.\n* **Backend Development & Integrations:** Automated workflows and integrated various SaaS platforms using Node.js and PHP, improving backend efficiency.\n* **Data Migration:** Efficiently executed data migration tasks using REST APIs and GraphQL, ensuring seamless data transfer between systems.\n\n\n**Uplers | jQuery Developer | October 2017 – March 2021**\n\n* **Custom jQuery Plugin Development:** Created custom jQuery plugins tailored to specific client requirements.\n* **Website Optimization:** Optimized website page speed and performance, improving user experience and meeting performance goals.\n* **HubSpot Development:** Utilized PHP as a backend proxy server and worked on HubSpot backend development using HubL, enhancing HubSpot's features and functionality.\n\n\n**Education:**\n\n**Government Engineering College, Modasa (Gujarat Technological University) | Bachelor of Engineering (Computer Engineering) | April 2012 – May 2016**\n\n\n**Skills:**\n\n**Programming Languages:** JavaScript, ReactJS, Redux, RTK, RxJS, jQuery, HTML, CSS, Node.js, Express.js, PHP\n\n**Databases:** MySQL, MongoDB, Mongoose, Sequelize\n\n**APIs & Tools:** REST API, GraphQL, Webhooks, Git, Docker, Tailwind CSS, Firebase Auth\n\n**Platforms:** HubSpot, Shopify, MailChimp\n\n**Other:**  Model-Based Engineering (MBE), Real-time Messaging\n\n\n**Certifications:**\n\n* Frontend Developer (React) Certificate – HackerRank\n* Node (Basic) Certificate – HackerRank\n* Front-End Software Engineering Virtual Experience Programme – Skyscanner\n* Software Engineering Virtual Experience – JP Morgan Chase\n* M001: MongoDB Basics – MongoDB University\n* Javascript Algorithms and Data Structures – FreeCodeCamp\n* Responsive Web Design – FreeCodeCamp\n\n\n**Awards & Recognition:**\n\n* Employee of the Month (13 times) – Uplers\n\n\n**Projects:**\n\n* **Headless E-commerce:** Built a responsive e-commerce platform using Shopify and React.js, leveraging Tailwind CSS and Firebase Auth.  Significantly reduced average development time by [quantify the reduction, e.g., 20%].\n* **MailStencil:** Developed an Email Templates Marketplace featuring 6000+ templates, live previews, real-time coding updates, and exportable HTML. Implemented a modular architecture using microservices and created an NPM package for database operations.\n\n\nThis revised resume is more concise, highlights key accomplishments with quantifiable results wherever possible, and uses stronger action verbs.  Remember to replace bracketed information with specific details.\n"
    // })
});

app.listen(process.env.PORT, () => console.log(`Server running on http://localhost:${process.env.PORT}`));