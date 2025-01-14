require('dotenv').config();

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const Resend = require("resend");

const app = express();

const BOT_TOKEN = process.env.BOT_TOKEN;
const resend = new Resend.Resend(process.env.RESEND_APIKEY);

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => res.send('It Work'));

const port = process.env.PORT || 4000;

app.post('/send-message', async (req, res) => {
  const { chatId, message } = req.body;
  
  try {
    const response = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: 'HTML',
        }),
      }
    );
    
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/send-media', async (req, res) => {
  const { chatId, photoUrl } = req.body;
  try {
    const response = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          photo: photoUrl
        })
      }
    );
    res.json(await response.json());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/send-location', async (req, res) => {
  const { chatId, latitude, longitude } = req.body;
  try {
    const response = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendLocation`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          latitude,
          longitude
        })
      }
    );
    res.json(await response.json());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/send-email", async (req, res) => {
  const { data, error } = await resend.emails.send({
    from: "Acme <onboarding@resend.dev>",
    to: ["delivered@resend.dev"],
    subject: "hello world",
    html: "<strong>it works!</strong>",
  });

  if (error) {
    return res.status(400).json({ error });
  }

  res.status(200).json({ data });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
