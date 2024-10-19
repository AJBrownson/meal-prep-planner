"use client";

import React, { useState } from "react";

import { useCopilotReadable, useCopilotAction } from "@copilotkit/react-core";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"


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
      <section className="flex flex-col w-full min-h-screen ">
        <div className="flex-1 p-4 md:p-8 lg:p-10">
          <div className="container mx-auto p-4">
              <h1 className="text-2xl font-bold mb-4">
                Meal Prep Planning Schedule
              </h1>
            <div className="overflow-x-auto">
              {/* Table for displaying the meal plan */}
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-200">
                    <TableHead className="px-4 py-2">Days</TableHead>
                    <TableHead className="px-4 py-2">Breakfast</TableHead>
                    <TableHead className="px-4 py-2">Lunch</TableHead>
                    <TableHead className="px-4 py-2">Dinner</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mealPrep.map((item, index) => (
                    <TableRow key={index} className="">
                      <TableCell className="px-4 py-2 border border-white">{item.day}</TableCell>
                      <TableCell className="px-4 py-2 border border-white">{item.breakfast}</TableCell>
                      <TableCell className="px-4 py-2 border border-white">{item.lunch}</TableCell>
                      <TableCell className="px-4 py-2 border border-white">{item.dinner}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

