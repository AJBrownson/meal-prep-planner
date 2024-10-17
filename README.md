#

install dependencies first
```bash
npm install @langchain/langgraph @langchain/core
```

Then install the Groq package
```bash
npm install @langchain/groq
```

import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { ChatGroq } from "@langchain/groq"
import { StateGraph, END } from "@langchain/langgraph";
import { RunnableLambda } from "@langchain/core/runnables";
import { TavilySearchAPIRetriever } from "@langchain/community/retrievers/tavily_search_api";

interface AgentState {
    topic: string;
    searchResults?: string;
    article?: string;
    critique?: string;
  }
  
  function model() {
    // return new ChatOpenAI({
    //   temperature: 0,
    //   modelName: "gpt-4-1106-preview",
    // });
    return new ChatGroq({
        modelName: process.env.GROQ_MODEL,
    })
  }
# meal-prep-planner
