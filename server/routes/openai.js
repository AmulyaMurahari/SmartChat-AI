// import express from "express";
// import axios from "axios";
// import dotenv from "dotenv";
// import { openai } from "../index.js";

// dotenv.config();
// const router = express.Router();

// router.post("/text", async (req, res) => {
//   try {
//     const { text, activeChatId } = req.body;

//     const response = await openai.createCompletion({
//       model: "text-davinci-003",
//       prompt: text,
//       temperature: 0.5,
//       max_tokens: 2048,
//       top_p: 1,
//       frequency_penalty: 0.5,
//       presence_penalty: 0,
//     });

//     await axios.post(
//       `https://api.chatengine.io/chats/${activeChatId}/messages/`,
//       { text: response.data.choices[0].text },
//       {
//         headers: {
//           "Project-ID": process.env.PROJECT_ID,
//           "User-Name": process.env.BOT_USER_NAME,
//           "User-Secret": process.env.BOT_USER_SECRET,
//         },
//       }
//     );

//     res.status(200).json({ text: response.data.choices[0].text });
//   } catch (error) {
//     console.error("error", error);
//     res.status(500).json({ error: error.message });
//   }
// });

// router.post("/code", async (req, res) => {
//   try {
//     const { text, activeChatId } = req.body;

//     const response = await openai.createCompletion({
//       model: "code-davinci-002",
//       prompt: text,
//       temperature: 0.5,
//       max_tokens: 2048,
//       top_p: 1,
//       frequency_penalty: 0.5,
//       presence_penalty: 0,
//     });

//     await axios.post(
//       `https://api.chatengine.io/chats/${activeChatId}/messages/`,
//       { text: response.data.choices[0].text },
//       {
//         headers: {
//           "Project-ID": process.env.PROJECT_ID,
//           "User-Name": process.env.BOT_USER_NAME,
//           "User-Secret": process.env.BOT_USER_SECRET,
//         },
//       }
//     );

//     res.status(200).json({ text: response.data.choices[0].text });
//   } catch (error) {
//     console.error("error", error.response.data.error);
//     res.status(500).json({ error: error.message });
//   }
// });

// router.post("/assist", async (req, res) => {
//   try {
//     const { text } = req.body;

//     const response = await openai.createCompletion({
//       model: "text-davinci-003",
//       prompt: `Finish my thought: ${text}`,
//       temperature: 0.5,
//       max_tokens: 1024,
//       top_p: 1,
//       frequency_penalty: 0.5,
//       presence_penalty: 0,
//     });

//     res.status(200).json({ text: response.data.choices[0].text });
//   } catch (error) {
//     console.error("error", error);
//     res.status(500).json({ error: error.message });
//   }
// });

// export default router;



// /* 
//   NOTE: replace the openai.js file with this file and uncomment 
//   the code if you want to use the newer version of the openai API.
//   OPENAI released their gpt-3.5-turbo version on 3/1/2023, this is
//   gpt-3.5 version which is what powers the ChatGPT bot. most of the
//   code is the same with some minor changes.
// */

// openai.js
import express from "express";
import axios from "axios";
import { openai } from "../index.js"  ;
import dotenv from "dotenv";


dotenv.config();
const router = express.Router();

router.post("/text", async (req, res) => {
  try {
    const { text, activeChatId } = req.body;
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: text }
      ],
    });

    await axios.post(
      `https://api.chatengine.io/chats/${activeChatId}/messages/`,
      { text: response.data.choices[0].message.content },
      {
        headers: {
          "Project-ID": process.env.PROJECT_ID,
          "User-Name": process.env.BOT_USER_NAME,
          "User-Secret": process.env.BOT_USER_SECRET,
        },
      }
    );

    res.status(200).json({ text: response.data.choices[0].message.content });
  } catch (error) {
    console.error("error", error.response?.data.error || error.message);
    res.status(500).json({ error: error.message });
  }
});

router.post("/code", async (req, res) => {
  try {
    const { text, activeChatId } = req.body;
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are an assistant coder who responds with only code and no explanations." },
        { role: "user", content: text }
      ],
    });

    await axios.post(
      `https://api.chatengine.io/chats/${activeChatId}/messages/`,
      { text: response.data.choices[0].message.content },
      {
        headers: {
          "Project-ID": process.env.PROJECT_ID,
          "User-Name": process.env.BOT_USER_NAME,
          "User-Secret": process.env.BOT_USER_SECRET,
        },
      }
    );

    res.status(200).json({ text: response.data.choices[0].message.content });
  } catch (error) {
    console.error("error", error.response?.data.error || error.message);
    res.status(500).json({ error: error.message });
  }
});

router.post("/assist", async (req, res) => {
  try {
    const { text } = req.body;
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant that serves to only complete user's thoughts or sentences." },
        { role: "user", content: `Finish my thought: ${text}` }
      ],
    });

    res.status(200).json({ text: response.data.choices[0].message.content });
  } catch (error) {
    console.error("error", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;