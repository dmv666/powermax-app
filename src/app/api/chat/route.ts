import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();
  const apiKey = process.env.OPENAI_API_KEY;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    }),
  });

  const data = await response.json();

  // Depuración: loguea el error si existe
  if (!response.ok) {
    console.error("OpenAI error:", data);
    return Response.json({ result: "Error en la API de OpenAI." }, { status: 500 });
  }

  return Response.json({ result: data.choices?.[0]?.message?.content || "Sin respuesta." });
}