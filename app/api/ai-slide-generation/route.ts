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

    // Validate required fields
    if (!microlesson || !courseContext) {
      return NextResponse.json(
        { error: 'Missing required fields: microlesson and courseContext' },
        { status: 400 }
      );
    }

    // Build the context prompt
    const contextPrompt = `
You are an expert instructional designer creating engaging microlesson slides for industrial training programs.

COURSE CONTEXT:
- Course Title: ${courseContext.title}
- Industry: ${courseContext.industry}
- Skill Level: ${courseContext.skillLevel}
- Course Description: ${courseContext.description}

MICROLESSON CONTEXT:
- Title: ${microlesson.title}
- Description: ${microlesson.content}
- Duration: ${microlesson.duration}
- Type: ${microlesson.type}
- Learning Objectives: ${microlesson.objectives.map(obj => `• ${obj}`).join('\n')}

ADDITIONAL CONTEXT:
${additionalContext || 'No additional context provided'}

INDUSTRY GUIDELINES:
Follow these industry-specific guidelines for ${courseContext.industry}:
${getIndustryGuidelines(courseContext.industry)}

SLIDE CREATION INSTRUCTIONS:
1. Create 5-8 slides that effectively teach the learning objectives
2. Use a variety of slide types for engagement (Title, Content, Interactive, Quiz)
3. Include practical examples relevant to ${courseContext.industry}
4. Ensure content is appropriate for ${courseContext.skillLevel} level learners
5. Make slides interactive and engaging for ${microlesson.duration} duration
6. Include real-world applications and scenarios
7. Add knowledge checks and quick assessments

AVAILABLE SLIDE TYPES:
- TitleSlide: Main title slide with optional subtitle
- TitleWithSubtext: Title with bullet points or detailed content
- TitleWithImage: Title with accompanying image
- VideoSlide: Video content with description
- QuickCheckSlide: Interactive quiz questions
- MarkdownSlide: Rich text content with formatting
- HotspotActivitySlide: Interactive image with clickable hotspots

Return a JSON array of slide objects. Each slide must have:
- id: unique identifier
- type: one of the available slide types
- appropriate fields for that slide type

Example structure:
[
  {
    "id": "slide-1",
    "type": "TitleSlide",
    "title": "Introduction to ${microlesson.title}",
    "subtitle": "Key concepts for ${courseContext.industry}",
    "backgroundColor": "#1E293B"
  },
  {
    "id": "slide-2", 
    "type": "TitleWithSubtext",
    "title": "Learning Objectives",
    "bullets": ["Objective 1", "Objective 2"],
    "accentColor": "#3B82F6"
  }
]

Focus on creating practical, industry-relevant content that directly addresses the learning objectives.
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: "You are an expert instructional designer specializing in industrial training programs. Create engaging, practical slides that effectively teach the specified learning objectives. Always respond with valid JSON."
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
      slides = JSON.parse(responseText);
    } catch (parseError) {
      console.error('JSON parsing error:', parseError);
      console.error('Response text:', responseText);
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

    return NextResponse.json({
      success: true,
      slides: processedSlides,
      metadata: {
        microlessonId: microlesson.id,
        courseId: courseContext.id,
        generatedAt: new Date().toISOString(),
        totalSlides: processedSlides.length
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