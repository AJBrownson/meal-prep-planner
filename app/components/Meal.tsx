"use client";

import { useState } from "react";
import { useCopilotAction, useCopilotReadable } from "@copilotkit/react-core";

interface MealProps {
  day: string;
  breakfast: string;
  lunch: string;
  dinner: string;
}

export default function MealPrep() {
  const [mealPrep, setMealPrep] = useState<MealProps[]>([]);

  useCopilotReadable({
    description: "The user's meal prep plan for the week.",
    value: mealPrep,
  });

  // Use the useCopilotAction hook to define a new action
  useCopilotAction(
    {
      name: "createMealPrep", // Name of the action

      description: "Create a meal prep plan for the week.", // Description of the action

      parameters: [
        {
          name: "MealPrepPlan", // Name of the parameter
          type: "object[]", // Type of the parameter (array of objects)
          description: "The meal prep plan for the week", // Description of the parameter

          attributes: [
            {
              name: "day", // Name of the attribute
              type: "string", // Type of the attribute
              description: "The day of the week.", // Description of the attribute
            },
            {
              name: "breakfast", // Name of the attribute
              type: "string", // Type of the attribute
              description: "Foods to be had in the morning.", // Description of the attribute
            },
            {
              name: "lunch", // Name of the attribute
              type: "string", // Type of the attribute
              description: "Foods to be had in the afternoon.", // Description of the attribute
            },
            {
              name: "dinner", // Name of the attribute
              type: "string", // Type of the attribute
              description: "Foods to be had in the evening.", // Description of the attribute
            },
          ],
          required: true, // Indicates that this parameter is required
        },
      ],

      // Handler function that sets the trip plan using the MealPrepPlan parameter
      handler: async ({ MealPrepPlan }) => {
        setMealPrep(MealPrepPlan);
      },

      render: "Planning your meals for the week...", // Message to display while the action is being processed
    },
    [] // Dependency array (empty in this case)
  );

  return (
    <>
      <section className="flex flex-col w-full min-h-screen bg-slate-800 dark:bg-gray-800">
        <h1 className="text-center text-2xl font-bold py-4">
          Your Personal Meal Prep Planner
        </h1>

        <div className="px-3">
          <table className="min-w-full">
            <thead>
              <tr className="bg-yellow-400 text-black">
                <th className="px-4 py-2 border border-white">Days</th>
                <th className="px-4 py-2 border border-white">Breakfast</th>
                <th className="px-4 py-2 border border-white">Lunch</th>
                <th className="px-4 py-2 border border-white">Dinner</th>
              </tr>
            </thead>
            <tbody>
              {mealPrep.map((item, index) => (
                <tr
                  key={index}
                  className={
                    index % 2 === 0
                      ? "bg-teal-400 text-white"
                      : "bg-pink-400 text-white"
                  }
                >
                  <td className="px-4 py-2 border border-white">{item.day}</td>
                  <td className="px-4 py-2 border border-white">
                    {item.breakfast}
                  </td>
                  <td className="px-4 py-2 border border-white">
                    {item.lunch}
                  </td>
                  <td className="px-4 py-2 border border-white">
                    {item.dinner}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
