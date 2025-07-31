import { NextRequest } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { microlessonContext, courseContext } = await request.json();

    // Validate required data
    if (!microlessonContext?.title || !courseContext?.title) {
      return new Response('Missing required context data', { status: 400 });
    }

    // Enhanced context prompt for "Learning Storybook" style
    const contextPrompt = `You are an instructional designer creating a microlesson for YOUNGER, LESS-EXPERIENCED workers who need help connecting concepts to real-world applications. Think like writing a "children's book" for adults starting their first job.

TARGET AUDIENCE:
- Age 18-25, entry-level workers
- Need clear "why this matters" explanations  
- Learn best with specific, real examples
- Struggle to connect concepts to actual work tasks
- Benefit from simple, direct language

MICROLESSON CONTEXT:
- Title: ${microlessonContext.title}
- Content: ${microlessonContext.content || 'Not specified'}
- Learning Objectives: ${microlessonContext.objectives?.join(', ') || 'Not specified'}
- Duration: ${microlessonContext.duration || 'Not specified'} minutes
- Type: ${microlessonContext.type || 'Not specified'}

COURSE CONTEXT:
- Course: ${courseContext.title}
- Description: ${courseContext.description || 'Not specified'}
- Industry: ${courseContext.industry || 'General'}
- Skill Level: ${courseContext.skillLevel || 'Beginner'}

CONTENT GUIDELINES:
- Maximum 2 paragraphs per slide
- Always explain "WHY" they need to know this
- Connect everything to their real workplace 
- Use simple, conversational language
- One main idea per slide
- Include specific examples they'll actually encounter

SLIDE COUNT: Generate exactly 7-12 slides (you decide based on content complexity)

SLIDE STRUCTURE TEMPLATE:
1. Title Slide - Microlesson title and why it matters to them
2. Why This Matters to You - Real workplace impact
3. What We're Learning Today - Clear objectives in plain language  
4. Core Concepts - Main ideas broken into digestible pieces
5. In Your Job - Specific workplace applications
6. Quick Check - Simple question to reinforce key points
7. What You Do Next - Actionable steps they can take immediately
(Add more slides as needed for complex topics)

AVAILABLE SLIDE FORMATS (use ONLY these 6 types):

1. TITLE SLIDE (TitleSlide) - Always use this for slide 1
   - Use for: Opening slide, microlesson introduction
   - Fields: title, subtitle
   - Example: title="How to Use a Multimeter Safely", subtitle="Why This Skill Keeps You Safe and Efficient"

2. SPLIT TEXT-IMAGE SLIDE (TitleWithImage) 
   - Use for: Visual concepts, equipment identification, before/after comparisons
   - Fields: title, subtitle  
   - Note: Image placeholder will be added manually
   - Example: title="What Does a Multimeter Look Like?", subtitle="You'll see these on every job site"

3. QUICK-CHECK SLIDE (QuickCheckSlide)
   - Use for: Knowledge reinforcement, key concept checks
   - Fields: title, question, options (array), correctAnswer (number), explanation
   - Example: question="When should you check if power is off?", options=["After you start working", "Before touching any wires", "Only if it looks dangerous", "Never"]

4. BULLET POINT SLIDE (TitleWithSubtext)
   - Use for: Step-by-step procedures, lists, key points
   - Fields: title, subtext, content (use bullet markdown: - Point 1\n- Point 2)
   - Example: title="Safety Steps Before Testing", content="- Turn off power at breaker\n- Test the tester on known live circuit\n- Double-check your meter is working"

5. DEFINITION SLIDE (TitleWithSubtext)
   - Use for: Important terms, concepts they must know
   - Fields: title, subtext, content
   - Example: title="Voltage", subtext="The electrical pressure in a circuit", content="Think of it like water pressure in a pipe. Higher voltage = more electrical pressure flowing through the wires."

6. REAL-WORLD EXAMPLE SLIDE (TitleWithSubtext or TitleWithImage)
   - Use for: Workplace scenarios, application stories
   - Fields: title, subtext, content
   - Example: title="Why Maria Always Tests First", content="Maria is an apprentice electrician. Last month, she assumed a circuit was off and got shocked. Now she ALWAYS tests with her multimeter first. That 30 seconds of testing saved her from injury and embarrassment in front of her supervisor."

CONTENT CREATION RULES:
1. Connect to Real Work: Every slide must connect to their actual job
2. Specific Examples: Use names, situations, consequences they'll face  
3. Simple Language: Write like talking to someone's younger sibling
4. One Idea Per Slide: Don't overwhelm them
5. Include Consequences: Show what happens if they don't follow the advice

TEXT FORMATTING GUIDELINES:
Use HTML formatting to enhance readability and emphasis:

**EMPHASIS & HIGHLIGHTING:**
- <strong>Bold text</strong> for critical safety warnings, key terms, important actions
- <em>Italic text</em> for emphasis, workplace scenarios, consequences
- <u>Underline</u> for step numbers, critical warnings that need attention
- <span style="color: #ef4444"><strong>Red bold text</strong></span> for safety warnings, dangers, critical errors
- <span style="color: #10b981"><strong>Green bold text</strong></span> for correct procedures, success outcomes
- <span style="color: #f59e0b"><strong>Orange bold text</strong></span> for cautions, things to watch out for

**STRUCTURE & ORGANIZATION:**
- <h3>Use H3 headings</h3> for sub-sections within content
- Use bullet lists with <ul><li>Point 1</li><li>Point 2</li></ul> for procedures, safety steps, key points
- Use numbered lists with <ol><li>Step 1</li><li>Step 2</li></ol> for sequential procedures
- <blockquote>Use blockquotes for important rules, supervisor quotes, or key insights</blockquote>

**WORKPLACE SCENARIOS:**
- Use <em>italics for workplace stories</em> and real-world examples
- Use <strong>bold for the lesson/takeaway</strong> from each story
- Use colors to highlight <span style="color: #ef4444">what went wrong</span> vs <span style="color: #10b981">what worked</span>

FORMATTING EXAMPLES:
- Safety Warning: "<span style="color: #ef4444"><strong>⚠️ DANGER:</strong></span> Never assume power is off"
- Success Story: "<em>When Jake followed this procedure, he</em> <span style="color: #10b981"><strong>avoided a costly mistake</strong></span>"
- Key Steps: "<ol><li><strong>Turn off power</strong> at the breaker</li><li><u>Test your meter</u> on a known live circuit</li></ol>"
- Important Term: "<strong>Voltage</strong> is <em>the electrical pressure in a circuit</em>"

EXAMPLE SLIDE STRUCTURE WITH FORMATTING:
{
  "type": "TitleSlide",
  "title": "<strong>How to Use a Multimeter Safely</strong>", 
  "subtitle": "The skill that <em>keeps you safe</em> and <span style=\"color: #10b981\"><strong>gets the job done right</strong></span>"
}

{
  "type": "TitleWithSubtext",
  "title": "<span style=\"color: #f59e0b\"><strong>Why This Matters to You</strong></span>",
  "subtext": "<em>Real consequences in your first year</em>",
  "content": "<em>Every year, apprentices get hurt because they</em> <span style=\"color: #ef4444\"><strong>skip electrical testing</strong></span>. But the workers who <u>always test their circuits</u>? <span style=\"color: #10b981\"><strong>They become the ones supervisors trust with bigger projects</strong></span>. Learning this now sets you up for success."
}

{
  "type": "TitleWithSubtext",
  "title": "<strong>Safety Steps Before Testing</strong>",
  "subtext": "<span style=\"color: #ef4444\"><strong>⚠️ Follow this order every time</strong></span>",
  "content": "<ol><li><span style=\"color: #ef4444\"><strong>Turn off power</strong></span> at the breaker</li><li><u>Test your meter</u> on a known live circuit</li><li><strong>Double-check</strong> your meter is working</li><li>Now you can <span style=\"color: #10b981\"><strong>safely test the circuit</strong></span></li></ol>"
}

FORMATTING BY SLIDE TYPE:
- **TitleSlide**: Use <strong>bold titles</strong>, <em>italic subtitles</em> for emphasis, color for key benefits
- **TitleWithSubtext**: Use colors for importance levels, <ol>/<ul> for procedures, <blockquote> for key insights  
- **QuickCheckSlide**: <strong>Bold questions</strong>, <em>italic explanations</em>, color-code correct vs incorrect
- **Safety Content**: Always use <span style="color: #ef4444">red for dangers</span>, <span style="color: #10b981">green for safe practices</span>
- **Procedures**: Use <ol> for sequential steps, <strong>bold</strong> for critical actions, <u>underline</u> for verification steps

Remember: Write like you're explaining to someone's younger sibling who just started their first job. Be encouraging but direct about real workplace consequences. Use formatting to guide their attention to what matters most.

CRITICAL: Return ONLY a valid JSON array of slide objects. No explanations, no markdown, just the JSON array starting with [ and ending with ].`;

    // Create the stream
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Send initial event to indicate streaming has started
          controller.enqueue(`data: ${JSON.stringify({ type: 'start', message: 'Starting slide generation...' })}\n\n`);

          const completion = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
              {
                role: 'system',
                content: contextPrompt
              }
            ],
            temperature: 0.7,
            max_tokens: 4000,
            stream: true,
          });

          let accumulatedContent = '';
          let currentSlideIndex = 0;
          let currentField = '';
          let currentContent = '';
          let slides: any[] = [];
          let insideJsonArray = false;
          let braceCount = 0;
          let currentSlideJson = '';

          for await (const chunk of completion) {
            const content = chunk.choices[0]?.delta?.content || '';
            if (!content) continue;

            accumulatedContent += content;

            // Look for start of JSON array
            if (!insideJsonArray && content.includes('[')) {
              insideJsonArray = true;
              const startIndex = content.indexOf('[');
              accumulatedContent = content.substring(startIndex);
              continue;
            }

            if (!insideJsonArray) continue;

            // Process character by character for streaming effect
            for (const char of content) {
              // Track braces to identify slide boundaries
              if (char === '{') {
                braceCount++;
                if (braceCount === 1) {
                  currentSlideJson = '{';
                  continue;
                }
              } else if (char === '}') {
                braceCount--;
                currentSlideJson += char;
                
                if (braceCount === 0) {
                  // Complete slide object found
                  try {
                    const slideObj = JSON.parse(currentSlideJson);
                    
                    // Ensure slide has required properties
                    if (!slideObj.type) {
                      console.warn('Slide missing type property:', slideObj);
                      slideObj.type = 'TitleSlide'; // Default fallback
                    }
                    
                    // Ensure slide has an ID
                    if (!slideObj.id) {
                      slideObj.id = `slide-${Date.now()}-${currentSlideIndex}`;
                    }
                    
                    slides.push(slideObj);
                    
                    // Send slide creation event
                    controller.enqueue(`data: ${JSON.stringify({ 
                      type: 'slide_created', 
                      slideIndex: currentSlideIndex,
                      slide: slideObj 
                    })}\n\n`);
                    
                    currentSlideIndex++;
                    currentSlideJson = '';
                    
                    // Small delay to make streaming visible
                    await new Promise(resolve => setTimeout(resolve, 100));
                  } catch (e) {
                    // Invalid JSON, continue accumulating
                    console.warn('Failed to parse slide JSON:', currentSlideJson);
                  }
                  continue;
                }
              }

              if (braceCount > 0) {
                currentSlideJson += char;
                
                // Check if we're in a string field that we want to stream
                const fieldMatches = currentSlideJson.match(/"(title|subtitle|subtext|content|question)"\s*:\s*"([^"]*)/);
                if (fieldMatches) {
                  const [, fieldName, fieldValue] = fieldMatches;
                  
                  // Send character-by-character update
                  controller.enqueue(`data: ${JSON.stringify({ 
                    type: 'character', 
                    slideIndex: currentSlideIndex,
                    field: fieldName,
                    content: fieldValue + char,
                    isTyping: true
                  })}\n\n`);
                  
                  // Very fast typing speed as requested
                  await new Promise(resolve => setTimeout(resolve, 20));
                }
              }
            }
          }

          // Send completion event
          controller.enqueue(`data: ${JSON.stringify({ 
            type: 'complete', 
            slides: slides,
            totalSlides: slides.length 
          })}\n\n`);

        } catch (error) {
          console.error('Streaming error:', error);
          controller.enqueue(`data: ${JSON.stringify({ 
            type: 'error', 
            message: error instanceof Error ? error.message : 'Unknown error occurred'
          })}\n\n`);
        } finally {
          controller.close();
        }
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });

  } catch (error) {
    console.error('Error in streaming API:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}