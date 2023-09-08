import Express, { response } from "express";
import { OpenAI } from "openai";
import cors from "cors";
import dotenv from "dotenv";

const app = Express();
app.use(Express.json());
app.use(cors());
dotenv.config();

const openai = new OpenAI({apiKey: process.env.APIKEY});

app.get("/ping", (req, res) => {
  res.json({
    message: "Pong",
  });
});
app.post("/chat", (req, res) => {
   const { question } = req.body;
   openai
     .createCompletion({
       model: "text-davinci-003",
       prompt: question,
       max_tokens: 4000,
       temperature: 0,
     })
     .then((response) => {
       return response?.data?.choices?.[0]?.text;
     })
     .then((answer) => {
       const array = answer
         ?.split("/n")
         .filter((value) => value)
         .map((value) => value.trim());
       return array;
     })
     .then((answer) => {
       res.json({
         answer: answer,
         prompt: question,
       });
     });
 });

app.listen(8000, () => {
  console.log("Server is listening on 8000");
});
