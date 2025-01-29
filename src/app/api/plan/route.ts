import { draft_plan } from '@/lib/ai-engine';

// makes request to AI engine to get a plan for the given objective and returns it.
export async function POST(request: Request) {
  const body = await request.json();
  const objective = body.objective;

  // Mock data for testing.
  // const mock_tasks = [
  //   {
  //     "ID": "1",
  //     "description": "Define the target audience for the daily news summary email and their preferred news sources.",
  //     "output": "A document specifying the target audience and their preferred news sources.",
  //     "role": "Manager",
  //     "tools": []
  //   },
  //   {
  //     "ID": "2",
  //     "description": "Set up a system for collecting news from reliable sources (RSS feeds, APIs, reputable news websites).",
  //     "output": "A functional system for collecting news data from multiple sources.",
  //     "role": "Researcher",
  //     "tools": [
  //       "websearch"
  //     ]
  //   },
  //   {
  //     "ID": "3",
  //     "description": "Gather news articles and information from identified sources for the past 24 hours.",
  //     "output": "A collection of news articles and information relevant to the target audience.",
  //     "role": "Researcher",
  //     "tools": [
  //       "webscraper",
  //       "websearch"
  //     ]
  //   },
  // ]

  // return Response.json({ status: 'ok', plan: mock_tasks });

  // Call the AI engine to get the plan for the given objective.
  const response = await draft_plan(objective);
  if (!response.ok) {
    throw new Error('Failed to get plan from the AI engine.');
  }

  const data = await response.json();
  const plan = data.plan;

  return Response.json({ status: 'ok', plan });
}