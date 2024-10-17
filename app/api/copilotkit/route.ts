// Import the generateMealPlan function from the research module
import { generateMealPlan } from "./research";
// Import the Action type from the @copilotkit/shared package
import { Action } from "@copilotkit/shared";
// Import the NextRequest type from the next/server module
import { NextRequest } from "next/server";
// Import required modules and classes from the @copilotkit/runtime package
import {
  CopilotRuntime,
  GroqAdapter,
  copilotRuntimeNextJSAppRouterEndpoint,
} from "@copilotkit/runtime";
import { Groq } from "groq-sdk";


// Initialize the Groq instance with your API key
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Set up the GroqAdapter with the Groq instance and model
const groqAdapter = new GroqAdapter({
  groq,
  model: process.env.GROQ_MODEL,
});

// Initialize the CopilotRuntime
const runtime = new CopilotRuntime();

// Define the researchAction object with type Action<any>
const researchAction: Action<any> = {
  name: "research", // Name of the action
  description:
    "Call this function to research information relevant to meal prep planning. Respect other notes about when to call this function.",
  parameters: [
    {
      name: "topic", // Name of the parameter
      type: "string", // Type of the parameter, which is a string
      description: "The meal plans to research. Must be at least 5 characters.", // Description of the parameter
    },
  ],
  // Define the handler function for the action, which is asynchronous
  handler: async ({ topic }) => {
    console.log("Researching topic: ", topic); // Log the topic being researched
    // Call the generateMealPlan function to get the article
    return await generateMealPlan(topic);
  },
};

// Define the POST function to handle POST requests
export const POST = async (req: NextRequest) => {
  const actions: Action<any>[] = []; // Initialize an empty array to hold actions

  // Check if the GROQ_API_KEY environment variable is set and not equal to "NONE"
  if (
    process.env["TAVILY_API_KEY"] &&
    process.env["TAVILY_API_KEY"] !== "NONE"
  ) {
    actions.push(researchAction); // Add the researchAction to the actions array
  }

  const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
    runtime,
    serviceAdapter: groqAdapter,
    endpoint: "/api/copilotkit",
    // actions,
  });

  return handleRequest(req);
};
