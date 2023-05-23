import { env } from "~/env.mjs";
import {
  Configuration,
  OpenAIApi,
  type CreateChatCompletionRequest,
} from "openai";

export type Messages = CreateChatCompletionRequest["messages"];

const apiKey = env.OPENAI_API_KEY;

const CONTENT = `The following text is the logs for a build process in a GitHub repository. Tell me a list of 5 insights about it (except about telemetry matters since most users are opt-in to this option), like how can the process improve, maybe some pain points, after each insight give me a potential brief solution or if everything is perfect a positive message. Also at the end give me a score about the efficiency of the process from 0 to 100 in the following format “Efficiency Score: x”. Give me this prompt in the following JSON format, and without backticks for markdown, just simple JSON format: 
{
  "insights": [
    {
      "insight": string,
      "solution": string
    },
    {
      "insight": string,
      "solution": string
    },
    {
      "insight": string,
      "positive_message": string
    },
    {
      "insight": string,
      "positive_message": string
    },
    {
      "insight": string,
      "positive_message": string
    }
  ],
  "efficiency_score": number
}

logs: `;

const configuration = new Configuration({
  apiKey,
});
const openai = new OpenAIApi(configuration);

export async function generate(
  logs: string
): Promise<{ message: "success" | "error"; content: string }> {
  try {
    const chatCompletion = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are a software engineer with over 20 years of experience in web development and cloud computing.",
        },
        {
          role: "user",
          content: CONTENT + logs,
        },
      ] satisfies Messages,
    });
    const payload = chatCompletion.data.choices.pop();
    if (!payload?.message) {
      return {
        message: "error",
        content: "recieve a response from the analyser but comes empty",
      };
    }

    const cleanedString = payload.message.content.replace(/^(```json\s*|`)|(```|`)$/g, '').trim();

    return { message: "success", content: cleanedString };
  } catch (error) {
    if (error instanceof Error) {
      return { message: "error", content: error.message };
    }
    return { message: "error", content: "recieve a error from the analyser" };
  }
}
