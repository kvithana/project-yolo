import OpenAI from "openai";

export const runtime = "edge";
export const dynamic = "force-dynamic";
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  const body = await request.json();
  const imageBase64 = body.imageBase64;
  const history = body.history;

  if (!imageBase64) {
    return new Response("Missing imageBase64", { status: 400 });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        { role: "system", content: prompt },
        ...(history?.length
          ? [
              {
                role: "system",
                content:
                  "You have already provided the following responses: " +
                  history.join(", "),
              },
            ]
          : ([] as any)),
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Is there any new contextual information about where I am or what is infront of me?",
            },
            {
              type: "image_url",
              image_url: {
                detail: "low",
                url: `${imageBase64}`,
              },
            },
          ],
        },
      ],
    });

    if (completion.choices.length === 0) {
      return new Response(
        JSON.stringify({
          message: {
            content: "",
          },
        }),
        { status: 200 }
      );
    }

    if (
      completion.choices[0].message.content?.toLowerCase().includes("null") ||
      completion.choices[0].message.content?.includes("context")
    ) {
      return new Response(
        JSON.stringify({
          message: {
            content: "",
          },
        }),
        { status: 200 }
      );
    }

    return new Response(JSON.stringify(completion.choices[0]), { status: 200 });
  } catch (err: any) {
    console.error(err);
    return new Response(err.message, { status: 500 });
  }
}

const prompt = `\
You are helping a visually impaired person understand the world around them and avoid any danger or obstacles. \
Your response will be turned to speech so keep word count low (max 20 words). \
You receive a scene from a camera feed. Return any relevant message to the user about this scene. \
If no new changes observed, only return the specific keyword: "NULL"`;
