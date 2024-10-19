import { CopilotKit } from "@copilotkit/react-core";
import { CopilotSidebar } from "@copilotkit/react-ui";
import "@copilotkit/react-ui/styles.css";

import MealPrep from "./components/MealPrep";

export default function Home() {
  return (
    <>
      <CopilotKit runtimeUrl="/api/copilotkit">
        <CopilotSidebar
          instructions={
            "Help the user create a meal prep plan for the week. Don't add the meal prep plan to the response."
          }
          labels={{
            initial:
              "Hi there!, I'm Mini and I'm here to help you plan your meals. Tell me your dietary preferences and restrictions below.",
          }}
          defaultOpen={true} // On page load, the Sidebar is open by default
          clickOutsideToClose={false} // Clicking outside the sidebar does not close it
        >
          <MealPrep />
        </CopilotSidebar>
      </CopilotKit>
    </>
  );
}
