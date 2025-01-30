import { draft_plan } from '@/lib/ai-engine';


const MOCK = false

// makes request to AI engine to get a plan for the given objective and returns it.
export async function POST(request: Request) {
  const body = await request.json();
  const objective = body.objective;

  // Call the AI engine to get the plan for the given objective.
  // Just pass thru the response from the AI engine.
  if (!MOCK) {
    const response = await draft_plan(objective);
    if (!response.ok) {
      throw new Error('Failed to get plan from the AI engine.');
    }
    const data = await response.json();
    return Response.json({ status: 'ok', ...data });
  }

  const mock_data = {
    "plan": {
        "objective": "An aspirational sportswear brand, Lululemon, would like to launch a tiered membership for it's most loyal customers. It wants to show the value of community while being a global brand and having different membership tiers. I would like to determine the mission, vision, values and overall communication strategy. Do some research and send me an email with a short summary.",
        "roles": [
            {
                "backstory": "You are a researcher. You excel at finding and verifying information from various sources.You are detail-oriented and can quickly identify relevant information.",
                "goal": "Gather, verify, and synthesize information from various sources.",
                "title": "Researcher"
            },
            {
                "backstory": "You are an analyst. You excel at interpreting information and providing insights, trends, or actionable conclusions.You are detail-oriented and can quickly identify relevant information.",
                "goal": "Interpret information and provide insights, trends, or actionable conclusions.",
                "title": "Analyst"
            },
            {
                "backstory": "You are a writer. You excel at generating content (text, image, audio, video) that can be used for emails, social media posts, documents.",
                "goal": "Generate content (text, image, audio, video) that can be used for emails, social media posts, documents.",
                "title": "Writer"
            },
            {
                "backstory": "You are an assistant. You excel at handling scheduling, reminders, email, or organization tasks.",
                "goal": "Handle scheduling, reminders, email, or organization tasks.",
                "title": "Assistant"
            }
        ],
        "tasks": [
            {
                "ID": "1",
                "description": "Research Lululemon's current brand positioning, target audience, and existing loyalty programs.",
                "output": "A comprehensive report detailing Lululemon's current brand strategy, target demographics, and existing loyalty program features, including strengths and weaknesses.",
                "role": "Researcher",
                "tools": [
                    "Websearch",
                    "Webscraper"
                ]
            },
            {
                "ID": "2",
                "description": "Research successful tiered membership programs from other companies (across various industries) to identify best practices and common pitfalls.",
                "output": "A comparative analysis report of successful tiered membership programs, highlighting key features, benefits, pricing strategies, and customer engagement tactics.",
                "role": "Researcher",
                "tools": [
                    "Websearch",
                    "Webscraper"
                ]
            },
            {
                "ID": "3",
                "description": "Analyze the competitive landscape of the sportswear industry, focusing on loyalty programs and community-building initiatives.",
                "output": "A competitive analysis report that identifies key competitors, their loyalty programs, and their strengths and weaknesses, focusing on community building.",
                "role": "Analyst",
                "tools": [
                    "Websearch",
                    "Webscraper"
                ]
            },
            {
                "ID": "4",
                "description": "Analyze the research findings to identify key insights and opportunities for Lululemon's tiered membership program.",
                "output": "A concise report outlining key findings from the research, including insights into target audience preferences, competitive advantages, and potential program features.",
                "role": "Analyst",
                "tools": [
                    "Spreadsheet"
                ]
            },
            {
                "ID": "5",
                "description": "Develop a mission statement, vision statement, and core values for Lululemon's tiered membership program, aligning with the overall brand identity.",
                "output": "A document outlining the mission, vision, and values for the tiered membership program, clearly articulating the program's purpose and guiding principles.",
                "role": "Writer",
                "tools": []
            },
            {
                "ID": "6",
                "description": "Develop a communication strategy outlining key messaging, target audiences, and communication channels for promoting the tiered membership program.",
                "output": "A detailed communication strategy document including messaging guidelines, target audience segmentation, communication channels (e.g., email, social media, in-store), and a proposed content calendar.",
                "role": "Writer",
                "tools": []
            },
            {
                "ID": "7",
                "description": "Draft different membership tier options with varying levels of benefits and pricing.",
                "output": "A document outlining different membership tier options, including a description of benefits and pricing for each tier.",
                "role": "Writer",
                "tools": [
                    "Spreadsheet"
                ]
            },
            {
                "ID": "8",
                "description": "Create a preliminary draft of the email summarizing the key findings and recommendations.",
                "output": "A draft email summarizing the key findings, recommendations for Lululemon's tiered membership program, including mission, vision, values, and communication strategy.",
                "role": "Writer",
                "tools": [
                    "Gmail"
                ]
            },
            {
                "ID": "9",
                "description": "Schedule meetings with stakeholders to review progress and gather feedback.",
                "output": "Meeting schedule and agendas for reviewing progress and gathering feedback from stakeholders.",
                "role": "Assistant",
                "tools": [
                    "Gmail",
                    "Scheduler"
                ]
            },
            {
                "ID": "10",
                "description": "Manage communication and documentation throughout the project.",
                "output": "Organized project files, meeting minutes, and communication logs.",
                "role": "Assistant",
                "tools": [
                    "Gmail",
                    "Dropbox"
                ]
            }
        ],
        "tools": [
            {
                "description": "Receive and send emails.",
                "name": "Gmail"
            },
            {
                "description": "Given a URL, fetch the content from the Internet (text, image, pdf).",
                "name": "Webscraper"
            },
            {
                "description": "Given keywords, search the Internet. Return a list of relevant URLs. Content from a URL can be fetched using the webscraper tool.",
                "name": "Websearch"
            },
            {
                "description": "Given a task, run it at the specified interval.",
                "name": "Scheduler"
            },
            {
                "description": "Given a filename and its path, fetch it from Dropbox cloud storage",
                "name": "Dropbox"
            },
            {
                "description": "Given the name of a sheet, fetch the sheet data.",
                "name": "Spreadheet"
            },
            {
                "description": "Given a database name and a SQL query, return data from the database in a structured row based format",
                "name": "Database"
            },
            {
                "description": "Given a message (text, images, video), post it on the social media site Twitter. The message is called a tweet.",
                "name": "Twitter"
            }
        ]
    }
  }
  return Response.json({ status: 'ok', ...mock_data });
}