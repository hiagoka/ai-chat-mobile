import { Request, Response } from "express";
import axios from "axios";

export const sendMessageToAI = async (req: Request, res: Response) => {
  const { message } = req.body;

  if (!message) return res.status(400).json({ error: "Mensagem vazia" });

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: message }],
        max_tokens: 150,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );

    const aiMessage = response.data.choices[0].message.content;
    res.json({ message: aiMessage });
  } catch (error:any) {
    console.error("Erro na API da IA", error.response?.data || error.message);
    res.status(500).json({ error: "Erro na IA" });
  }
};