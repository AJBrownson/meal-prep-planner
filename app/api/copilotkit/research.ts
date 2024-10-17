import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { ChatGroq } from "@langchain/groq";
import { StateGraph, END } from "@langchain/langgraph";
import { RunnableLambda } from "@langchain/core/runnables";
import { TavilySearchAPIRetriever } from "@langchain/community/retrievers/tavily_search_api";


interface AgentState {
  dietaryPreference: string;
  searchResults?: string;
  mealPlan?: string;
  critique?: string;
}

function model() {
  return new ChatGroq({
    modelName: process.env.GROQ_MODEL,
  })
}

async function search(state: {
  agentState: AgentState;
}): Promise<{ agentState: AgentState }> {
  const retriever = new TavilySearchAPIRetriever({
    k: 10,
  });
  let dietaryPreference = state.agentState.dietaryPreference;
  if (dietaryPreference.length < 5) {
    dietaryPreference = "dietary preference: " + dietaryPreference;
  }
  const docs = await retriever.getRelevantDocuments(dietaryPreference);
  return {
    agentState: {
      ...state.agentState,
      searchResults: JSON.stringify(docs),
    },
  };
}

async function curate(state: {
  agentState: AgentState;
}): Promise<{ agentState: AgentState }> {
  const response = await model().invoke([
    new SystemMessage(
      `You are a personal meal planner. Your sole task is to return a list of URLs and articles for the 7 most relevant recipes based on the provided query or dietary preference as a JSON list of strings in this format:
       { urls: ["url1", "url2", "url3", "url4", "url5", "url6", "url7"] }.`.replace(/\s+/g, " ")
    ),
    new HumanMessage(
      `Today's date is ${new Date().toLocaleDateString("en-GB")}.
      Dietary Preference or Query: ${state.agentState.dietaryPreference}
      
      Here is a meal plan based on your dietary preference:
      ${state.agentState.searchResults}`.replace(/\s+/g, " ")
    ),
  ]);
  const urls = JSON.parse(response.content as string).urls;
  const searchResults = JSON.parse(state.agentState.searchResults!);
  const newSearchResults = searchResults.filter((result: any) => {
    return urls.includes(result.metadata.source);
  });
  return {
    agentState: {
      ...state.agentState,
      searchResults: JSON.stringify(newSearchResults),
    },
  };
}

async function critique(state: {
  agentState: AgentState;
}): Promise<{ agentState: AgentState }> {
  let feedbackInstructions = "";
  if (state.agentState.critique) {
    feedbackInstructions =
      `The meal plan has been revised based on your previous critique: ${state.agentState.critique}
       The planner may have left feedback for you encoded between <FEEDBACK> tags for you to see.`.replace(/\s+/g, " ");
  }
  const response = await model().invoke([
    new SystemMessage(
      `You are a personal meal planning assistant. Provide short feedback on the meal plan to improve it. 
      If it looks good, return [DONE].`.replace(/\s+/g, " ")
    ),
    new HumanMessage(
      `${feedbackInstructions}
       This is the meal plan: ${state.agentState.mealPlan}`
    ),
  ]);
  const content = response.content as string;
  return {
    agentState: {
      ...state.agentState,
      critique: content.includes("[DONE]") ? undefined : content,
    },
  };
}

async function write(state: {
  agentState: AgentState;
}): Promise<{ agentState: AgentState }> {
  const response = await model().invoke([
    new SystemMessage(
      `You are a meal planning assistant. Write a 7-day meal plan in markdown based on dietary preferences and the list of recipes.`.replace(
        /\s+/g,
        " "
      )
    ),
    new HumanMessage(
      `Today's date is ${new Date().toLocaleDateString("en-GB")}.
      Dietary Preference: ${state.agentState.dietaryPreference}
      List of recipes: ${state.agentState.searchResults}
      Please create a meal plan based on these preferences and recipes.`.replace(
        /\s+/g,
        " "
      )
    ),
  ]);
  const content = response.content as string;
  return {
    agentState: {
      ...state.agentState,
      mealPlan: content,
    },
  };
}

async function revise(state: {
  agentState: AgentState;
}): Promise<{ agentState: AgentState }> {
  const response = await model().invoke([
    new SystemMessage(
      `You are a meal planner. Revise the meal plan based on the provided critique.`.replace(/\s+/g, " ")
    ),
    new HumanMessage(
      `Your task is to revise the meal plan based on the critique given.
      This is the meal plan: ${state.agentState.mealPlan}
      This is the critique: ${state.agentState.critique}
      You may leave feedback about the critique encoded between <FEEDBACK> tags.`.replace(/\s+/g, " ")
    ),
  ]);
  const content = response.content as string;
  return {
    agentState: {
      ...state.agentState,
      mealPlan: content,
    },
  };
}

const agentState = {
  agentState: {
    value: (x: AgentState, y: AgentState) => y,
    default: () => ({
      dietaryPreference: "",
    }),
  },
};

const shouldContinue = (state: { agentState: AgentState }) => {
  return state.agentState.critique === undefined ? "end" : "continue";
};

const workflow = new StateGraph({
  channels: agentState as any,
});

workflow.addNode("search", new RunnableLambda({ func: search }) as any);
workflow.addNode("curate", new RunnableLambda({ func: curate }) as any);
workflow.addNode("write", new RunnableLambda({ func: write }) as any);
workflow.addNode("critique", new RunnableLambda({ func: critique }) as any);
workflow.addNode("revise", new RunnableLambda({ func: revise }) as any);

workflow.addEdge("search", "curate");
workflow.addEdge("curate", "write");
workflow.addEdge("write", "critique");

workflow.addConditionalEdges(
  "critique",
  shouldContinue,
  {
    continue: "revise",
    end: END,
  }
);

workflow.addEdge("revise", "critique");

workflow.setEntryPoint("search");
const app = workflow.compile();

export async function generateMealPlan(dietaryPreference: string) {
  const inputs = {
    agentState: {
      dietaryPreference,
    },
  };
  const result = await app.invoke(inputs);
  const regex = /<FEEDBACK>[\s\S]*?<\/FEEDBACK>/g;
  const mealPlan = result.agentState.mealPlan.replace(regex, "");
  return mealPlan;
}
