import { draft_plan } from '@/lib/ai-engine';


// makes request to AI engine to get a plan for the given objective and returns it.
export async function POST(request: Request) {
  const body = await request.json();
  const objective = body.objective;

  const tasks = [
    {
      "ID": "1",
      "description": "Define the target audience for the daily news summary email and their preferred news sources.",
      "output": "A document specifying the target audience and their preferred news sources.",
      "role": "Manager",
      "tools": []
    },
    {
      "ID": "2",
      "description": "Set up a system for collecting news from reliable sources (RSS feeds, APIs, reputable news websites).",
      "output": "A functional system for collecting news data from multiple sources.",
      "role": "Researcher",
      "tools": [
        "websearch"
      ]
    },
    {
      "ID": "3",
      "description": "Gather news articles and information from identified sources for the past 24 hours.",
      "output": "A collection of news articles and information relevant to the target audience.",
      "role": "Researcher",
      "tools": [
        "webscraper",
        "websearch"
      ]
    },
    {
      "ID": "4",
      "description": "Verify the accuracy and credibility of gathered news items from multiple sources.",
      "output": "A curated list of verified news items with sources cited.",
      "role": "Researcher",
      "tools": [
        "websearch"
      ]
    },
    {
      "ID": "5",
      "description": "Analyze the collected news to identify major trends, themes, and significant events.",
      "output": "A concise summary of major news trends and significant events with supporting data.",
      "role": "Analyst",
      "tools": []
    },
    {
      "ID": "6",
      "description": "Write a clear, concise, and engaging email summarizing the major news events of the past 24 hours.",
      "output": "A draft of the daily news summary email.",
      "role": "Writer",
      "tools": []
    },
    {
      "ID": "7",
      "description": "Edit and proofread the email summary for clarity, accuracy, and style.",
      "output": "A polished and error-free version of the daily news summary email.",
      "role": "Writer",
      "tools": []
    },
    {
      "ID": "8",
      "description": "Design the email layout and format to ensure readability and visual appeal.",
      "output": "An email template optimized for readability and visual appeal.",
      "role": "Writer",
      "tools": []
    },
    {
      "ID": "9",
      "description": "Set up an automated system for sending the daily email at a specified time.",
      "output": "A fully functional automated email sending system.",
      "role": "Personal Assistant",
      "tools": [
        "scheduler",
        "gmail"
      ]
    },
    {
      "ID": "10",
      "description": "Test the email delivery system to ensure that emails are sent correctly and reach the intended recipients.",
      "output": "Confirmation that the email system is functioning correctly and delivering emails.",
      "role": "Personal Assistant",
      "tools": [
        "gmail"
      ]
    },
    {
      "ID": "11",
      "description": "Monitor the performance of the daily email (open rates, click-through rates, etc.) and make adjustments as needed.",
      "output": "Performance data for the daily email and a plan for improvement.",
      "role": "Manager",
      "tools": [
        "gmail"
      ]
    },
    {
      "ID": "12",
      "description": "Create a schedule for the daily email creation and distribution process.",
      "output": "A detailed schedule for the entire process.",
      "role": "Manager",
      "tools": []
    }
  ]

  return Response.json({ status: 'ok', plan: tasks });

  // Call the AI engine to get the plan for the given objective.
  const response = await draft_plan(objective);
  if (!response.ok) {
    throw new Error('Failed to get plan from the AI engine.');
  }

  const data = await response.json();
  const plan = data.plan;

  return Response.json({ status: 'ok', plan });
}