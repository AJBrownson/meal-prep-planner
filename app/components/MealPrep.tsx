"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { useCopilotReadable, useCopilotAction } from "@copilotkit/react-core";
import { html2pdf } from "html2pdf.js"


interface MealPrepTable {
  day: string;
  breakfast: string;
  lunch: string;
  dinner: string;
}

export default function MealPrep() {
  const [mealPrep, setMealPrep] = useState<MealPrepTable[]>([]);

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
              description:
                "Foods to be had in the morning.", // Description of the attribute
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

  // pdf download functionality
 async function handlePDF() {
  const element = document.querySelector('#prep')

 }

  return (
    <>
      <section className="flex flex-col w-full min-h-screen bg-slate-800 dark:bg-gray-800">
        <main className="flex-1 p-4 md:p-8 lg:p-10">
          <div className="container mx-auto p-4">
            <span className="flex justify-between py-5">
            <h1 className="text-2xl font-bold mb-4">
              Meal Prep Planning Schedule
            </h1>
            <button onClick={handlePDF} className="py-2 px-4 bg-red-500 text-white rounded">Download as PDF</button>
            </span>
            <div className="overflow-x-auto">
              {/* Table for displaying the meal plan */}
              <table className="min-w-full bg-slate-500" id="prep">
                <thead>
                <tr className="bg-yellow-400 text-black">
                    <th className="px-4 py-2 border-b border-white">Days</th>
                    <th className="px-4 py-2 border-b border-white">Breakfast</th>
                    <th className="px-4 py-2 border-b border-white">Lunch</th>{" "}
                    <th className="px-4 py-2 border-b border-white">Dinner</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Map over the meal plan state to display each item on a table */}
                  {mealPrep.map((item, index) => (
                    <tr
                      key={index}
                      className="bg-slate-800"
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
          </div>
        </main>
      </section>
    </>
  );
}
