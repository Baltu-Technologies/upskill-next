import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface MicrolessonContext {
  id: string;
  title: string;
  content: string;
  objectives: string[];
  duration: string;
  type: string;
}

interface CourseContext {
  id: string;
  title: string;
  description: string;
  industry: string;
  skillLevel: string;
  lessons: {
    id: string;
    title: string;
    description: string;
    microlessons: MicrolessonContext[];
  }[];
}

interface SlideGenerationRequest {
  microlesson: MicrolessonContext;
  courseContext: CourseContext;
  additionalContext: string;
}

export async function POST(request: NextRequest) {
  try {
    const { microlesson, courseContext, additionalContext }: SlideGenerationRequest = await request.json();

    console.log('🔍 Slide Generation API - Received request:', {
      microlesson: microlesson ? {
        id: microlesson.id,
        title: microlesson.title,
        objectives: microlesson.objectives,
        duration: microlesson.duration,
        type: microlesson.type
      } : 'undefined',
      courseContext: courseContext ? {
        id: courseContext.id,
        title: courseContext.title,
        industry: courseContext.industry,
        skillLevel: courseContext.skillLevel
      } : 'undefined',
      additionalContext: additionalContext || 'none'
    });

    // Validate required fields
    if (!microlesson || !courseContext) {
      console.error('❌ Missing required fields:', { microlesson: !!microlesson, courseContext: !!courseContext });
      return NextResponse.json(
        { error: 'Missing required fields: microlesson and courseContext' },
        { status: 400 }
      );
    }

    // Build the learning storybook context prompt
    const contextPrompt = `
You are creating microlesson slides for YOUNGER, LESS-EXPERIENCED workers in industrial training. 

Think like writing a "children's book" for adults - simple, clear, impactful content that helps learners connect the dots between what they're learning and why it matters in their real job.

TARGET AUDIENCE:
- Younger workers (often first job in industry)
- Need help connecting concepts to real work
- Learn best with clear examples and "why this matters" explanations
- Prefer bite-sized, digestible information

CONTENT GUIDELINES:
- Maximum 2 paragraphs per slide
- Always explain WHY they need to know this
- Connect every concept to real workplace scenarios
- Use simple language, avoid unnecessary jargon
- One main idea per slide
- Include specific, relatable examples

SLIDE COUNT: Generate 7-12 slides depending on topic complexity

COURSE CONTEXT:
- Industry: ${courseContext.industry}
- Skill Level: ${courseContext.skillLevel} 
- Course: ${courseContext.title}
- Course Description: ${courseContext.description}

MICROLESSON DETAILS:
- Topic: ${microlesson.title}
- Content: ${microlesson.content}
- Duration: ${microlesson.duration}
- Learning Objectives: ${microlesson.objectives.map((obj, index) => `${index + 1}. ${obj}`).join('\n')}

INDUSTRY CONTEXT:
${getIndustryGuidelines(courseContext.industry)}

ADDITIONAL REQUIREMENTS:
${additionalContext || 'Focus on practical workplace applications'}

SLIDE STRUCTURE TEMPLATE:
Create slides following this story flow:
1. "Why This Matters to You" - Connect to their real job
2. "What We're Learning Today" - Simple overview  
3-4. Core concepts (one per slide) with workplace examples
5-6. "In Your Job, This Looks Like..." - Specific applications
7. Quick knowledge check
8. "What You Do Next" - Clear action steps

AVAILABLE SLIDE FORMATS:
Choose the best format for each piece of content:

**1. SPLIT TEXT-IMAGE SLIDE (TitleWithImage)**
- Use when concepts need visual support
- Left side: Simple explanation (1-2 paragraphs max)
- Right side: Description of workplace visual they'd see
- Example: "Here's what proper PPE looks like in a cleanroom"

**2. QUICK-CHECK SLIDE (QuickCheckSlide)**
- Use to reinforce key learning points
- Simple multiple choice question
- Focus on critical knowledge they MUST remember
- Include "why this matters" in the explanation

**3. BULLET POINT SLIDE (TitleWithSubtext)**
- Use for step-by-step processes or key points
- 3-5 bullets maximum
- Each bullet connects to real work scenario
- Start each bullet with action words

**4. DEFINITION SLIDE (TitleWithSubtext)**  
- Use when introducing important terms
- Simple definition in plain English
- Include: "You'll encounter this when..."
- Give specific workplace example

**5. REAL-WORLD EXAMPLE SLIDE (TitleWithSubtext or TitleWithImage)**
- Use to connect concepts to actual work
- Start with: "Imagine you're working at [Company]..."
- Describe specific scenario they'd face
- Show how the concept applies

**6. FORMATTED CONTENT SLIDE (MarkdownSlide)**
- Use for comparisons, procedures, or structured info
- Tables for side-by-side comparisons
- Formatted blocks for before/after scenarios
- Visual organization of complex information

CONTENT CREATION RULES:
1. **Connect Every Slide to Real Work**: Always answer "Why does this matter in my job?"
2. **Use Specific Examples**: Name actual companies, equipment, or scenarios when possible
3. **Simple Language**: Write for someone learning this for the first time
4. **One Idea Per Slide**: Don't overwhelm with multiple concepts
5. **Include Consequences**: Show what happens when done wrong

EXAMPLE SLIDE STRUCTURE:
[
  {
    "id": "slide-1",
    "type": "TitleWithImage",
    "title": "Why Cleanroom Protocols Matter to YOU",
    "content": "When you work in semiconductor manufacturing, even tiny particles can ruin expensive chips. One contaminated wafer can cost your company $50,000. Your job is to keep these particles out.",
    "imageLayout": "right",
    "imageUrl": "Semiconductor technician in full cleanroom gear working with wafers",
    "workplaceRelevance": "This is what you'll do every day at work"
  },
  {
    "id": "slide-2", 
    "type": "QuickCheckSlide",
    "question": "What can happen if you don't follow cleanroom protocols?",
    "choices": ["Nothing serious", "Expensive chip damage", "Just a warning from supervisor"],
    "correctAnswer": "Expensive chip damage",
    "explanation": "Even one particle can ruin a $50,000 wafer. That's why these protocols exist."
  }
]

REMEMBER: Write like you're explaining to someone's younger sibling who just started their first job. Make it clear, simple, and show them exactly why it matters.
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert instructional designer specializing in industrial training programs. Create engaging, practical slides that effectively teach the specified learning objectives. IMPORTANT: Always respond with ONLY valid JSON - no markdown code blocks, no explanations, just the raw JSON array."
        },
        {
          role: "user",
          content: contextPrompt
        }
      ],
      max_tokens: 4000,
      temperature: 0.7,
    });

    const responseText = completion.choices[0]?.message?.content;
    if (!responseText) {
      throw new Error('No response from OpenAI');
    }

    // Parse the JSON response
    let slides;
    try {
      // Clean up the response text by removing markdown code blocks if present
      let cleanedResponse = responseText.trim();
      
      // Remove markdown code blocks if they exist
      if (cleanedResponse.startsWith('```json')) {
        cleanedResponse = cleanedResponse.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (cleanedResponse.startsWith('```')) {
        cleanedResponse = cleanedResponse.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }
      
      console.log('🔧 Cleaned response text:', cleanedResponse.substring(0, 200) + '...');
      
      slides = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error('❌ JSON parsing error:', parseError);
      console.error('📝 Original response text:', responseText);
      throw new Error('Invalid JSON response from AI');
    }

    // Validate that slides is an array
    if (!Array.isArray(slides)) {
      throw new Error('AI response must be an array of slides');
    }

    // Add default values and validate slide structure
    const processedSlides = slides.map((slide, index) => {
      if (!slide.id) {
        slide.id = `slide-${index + 1}`;
      }
      if (!slide.type) {
        slide.type = 'TitleWithSubtext';
      }
      
      // Add default duration if not present
      if (!slide.duration) {
        slide.duration = 30; // 30 seconds default
      }

      return slide;
    });

    console.log('✅ Successfully generated slides:', {
      microlessonTitle: microlesson.title,
      courseTitle: courseContext.title,
      slideCount: processedSlides.length,
      slideTypes: processedSlides.map(s => s.type)
    });

    // Return the generated slides
    return NextResponse.json({ 
      success: true,
      slides: processedSlides,
      metadata: {
        microlessonId: microlesson.id,
        courseId: courseContext.id,
        generatedAt: new Date().toISOString(),
        slideCount: processedSlides.length
      }
    });

  } catch (error) {
    console.error('AI slide generation error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate slides', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}

function getIndustryGuidelines(industry: string): string {
  const guidelines = {
    'Semiconductor & Microelectronics': `
- Emphasize safety protocols and cleanroom procedures
- Include technical specifications and precision requirements
- Focus on process control and quality assurance
- Use industry-standard terminology and measurements
- Highlight contamination prevention and equipment handling`,
    
    'Advanced Manufacturing': `
- Stress safety procedures and equipment operation
- Include lean manufacturing principles
- Focus on quality control and continuous improvement
- Use real production examples and case studies
- Emphasize efficiency and waste reduction`,
    
    'Broadband & Fiber Optics': `
- Focus on installation safety and proper techniques
- Include technical specifications and testing procedures
- Emphasize cable management and signal integrity
- Use industry-standard tools and terminology
- Highlight troubleshooting and maintenance procedures`,
    
    'Green Technology & Renewable Energy': `
- Emphasize environmental impact and sustainability
- Include safety protocols for electrical systems
- Focus on efficiency and performance optimization
- Use real-world installation examples
- Highlight maintenance and monitoring procedures`,
    
    'Data Centers (Construction & Operations)': `
- Stress critical infrastructure and redundancy
- Include power and cooling system management
- Focus on monitoring and maintenance procedures
- Use industry-standard metrics and terminology
- Emphasize uptime and reliability requirements`,
    
    'Aerospace & Aviation Technologies': `
- Emphasize strict safety and quality standards
- Include regulatory compliance requirements
- Focus on precision and attention to detail
- Use industry-standard procedures and documentation
- Highlight testing and validation processes`,
    
    'Energy & Power Systems': `
- Stress electrical safety and hazard awareness
- Include system monitoring and control procedures
- Focus on reliability and performance optimization
- Use industry-standard codes and regulations
- Emphasize maintenance and troubleshooting`
  };

  return guidelines[industry as keyof typeof guidelines] || `
- Focus on industry best practices and safety
- Include relevant technical specifications
- Emphasize practical application and real-world scenarios
- Use appropriate industry terminology
- Highlight quality and compliance requirements`;
} 