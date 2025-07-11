import { NextRequest, NextResponse } from 'next/server';
import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { fieldType, currentValue, context, courseContext, userInput, type, prompt, industry } = await request.json();

    if (!process.env.OPENAI_API_KEY) {
      console.error('OpenAI API key not configured');
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    console.log('🔍 AI Suggestions - API Key present:', !!process.env.OPENAI_API_KEY);
    console.log('🔍 AI Suggestions - Request type:', type || fieldType);
    console.log('🔍 AI Suggestions - Context purpose:', context?.purpose);

    // Handle new Course Information generation for Quick Start feature
    if (type === 'course_info') {
      const industries = [
        'Semiconductor & Microelectronics',
        'Advanced Manufacturing', 
        'Broadband & Fiber Optics',
        'Green Technology & Renewable Energy',
        'Data Centers (Construction & Operations)',
        'Aerospace & Aviation Technologies',
        'Energy & Power Systems',
        'Specialized Trades in Industrial MEP (Mechanical, Electrical, Plumbing)'
      ];

      const durations = [
        '30 minutes', '1 hour', '2 hours', '3 hours', '4 hours'
      ];

      const skillLevels = ['entry', 'intermediate', 'advanced'];

      const systemPrompt = `You are an expert instructional designer specializing in skilled trades and industrial training. 

Your task is to generate comprehensive course information based on a course idea description. You should create:
1. A compelling course title (concise and professional)
2. A detailed course description (2-3 sentences explaining what the course covers and who it's for)
3. The most appropriate industry from the provided list
4. Recommended duration from the provided options (MAXIMUM 4 hours)
5. Appropriate skill level (entry, intermediate, or advanced)
6. 3-5 realistic prerequisites (specific skills, certifications, or experience)
7. 3-5 measurable learning outcomes (using action verbs like "Apply", "Demonstrate", "Analyze")

IMPORTANT DURATION GUIDELINES:
- Maximum course duration is 4 hours
- If the course idea requires more than 4 hours of content, focus on the most essential core concepts
- Recommend breaking complex topics into multiple separate courses rather than exceeding 4 hours
- Each course should be focused, specific, and atomized to a particular skill or competency

Available industries: ${industries.join(', ')}
Available durations: ${durations.join(', ')}
Available skill levels: ${skillLevels.join(', ')}

Create content that is:
- Professional and industry-appropriate
- Clear and specific
- Practical and actionable
- Suitable for workforce development
- Focused and atomized (single skills, not broad subjects)

Return your response as a JSON object with exactly these fields:
- title: string (concise course title)
- description: string (2-3 sentences describing the course)
- industry: string (must be exactly one of the available industries)
- duration: string (must be exactly one of the available durations)
- skillLevel: string (must be exactly one of: entry, intermediate, advanced)
- prerequisites: array of strings (3-5 realistic prerequisites)
- learningOutcomes: array of strings (3-5 measurable learning outcomes)`;

      const userPrompt = `Course idea: "${prompt}"

Please generate comprehensive course information for this training course idea.`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user", 
            content: userPrompt
          }
        ],
        max_tokens: 1500,
        temperature: 0.7,
        response_format: { type: "json_object" }
      });

      const response = completion.choices[0]?.message?.content?.trim();
      
      if (!response) {
        return NextResponse.json(
          { error: 'No course information generated' },
          { status: 500 }
        );
      }

      try {
        const parsedResponse = JSON.parse(response);
        return NextResponse.json({
          success: true,
          title: parsedResponse.title || '',
          description: parsedResponse.description || '',
          industry: parsedResponse.industry || industries[0],
          duration: parsedResponse.duration || durations[0],
          skillLevel: parsedResponse.skillLevel || 'intermediate',
          prerequisites: parsedResponse.prerequisites || [],
          learningOutcomes: parsedResponse.learningOutcomes || [],
          type: 'course_info'
        });
      } catch (parseError) {
        console.error('Error parsing JSON response:', parseError);
        return NextResponse.json(
          { error: 'Failed to parse AI response' },
          { status: 500 }
        );
      }
    }

    // Handle new Course Context generation for Quick Start feature
    if (type === 'course_context') {
      const systemPrompt = `You are an expert instructional designer specializing in skilled trades and industrial training. 

Your task is to generate helpful context information based on a course idea description. You should create:
1. A detailed job description or role requirements that would benefit from this training
2. Course structure guidelines that would be appropriate for this type of training

Focus on the ${industry} industry and create content that is:
- Professional and industry-appropriate
- Clear and specific
- Practical and actionable
- Suitable for workforce development

Return your response as a JSON object with exactly these fields:
- jobDescription: A detailed job description or role requirements (2-3 paragraphs)
- courseStructure: Specific course structure guidelines and requirements (2-3 paragraphs)`;

      const userPrompt = `Course idea: "${prompt}"

Please generate job description context and course structure guidelines for this training course idea.`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user", 
            content: userPrompt
          }
        ],
        max_tokens: 1500,
        temperature: 0.7,
        response_format: { type: "json_object" }
      });

      const response = completion.choices[0]?.message?.content?.trim();
      
      if (!response) {
        return NextResponse.json(
          { error: 'No context generated' },
          { status: 500 }
        );
      }

      try {
        const parsedResponse = JSON.parse(response);
        return NextResponse.json({
          success: true,
          jobDescription: parsedResponse.jobDescription || '',
          courseStructure: parsedResponse.courseStructure || '',
          type: 'course_context'
        });
      } catch (parseError) {
        console.error('Error parsing JSON response:', parseError);
        return NextResponse.json(
          { error: 'Failed to parse AI response' },
          { status: 500 }
        );
      }
    }

    // Check if this is a Quick Start request (legacy)
    const isQuickStartRequest = context?.purpose === 'quick_start_elaboration' || context?.purpose === 'quick_start_structure';

    if (isQuickStartRequest) {
      // Handle Quick Start requests with detailed elaboration
      const systemPrompt = "You are an expert instructional designer specializing in skilled trades and industrial training. You provide CLEAR, CONCISE, and practical content that is industry-appropriate and professionally written. Use simple, direct language that is easy to understand.";
      
      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user", 
            content: context.request || `Please elaborate on this course requirement: "${userInput}"`
          }
        ],
        max_tokens: 1000,
        temperature: 0.7,
      });

      const suggestion = completion.choices[0]?.message?.content?.trim();
      
      if (!suggestion) {
        return NextResponse.json(
          { success: false, error: 'No suggestion generated' },
          { status: 500 }
        );
      }

      // Return format expected by Quick Start
      return NextResponse.json({
        success: true,
        suggestion: suggestion,
        fieldType,
        context
      });
    }

    // Handle regular suggestion requests (existing functionality)
    // Create contextual prompts based on field type
    const prompts = {
      courseTitle: `Suggest 3 professional course titles for a training program in the ${context.industry || 'industrial'} sector focusing on ${context.skillLevel || 'intermediate'} level content. Make them engaging but professional and CLEAR. Use simple, direct language. Current title: "${currentValue}". Return only the suggestions, one per line.`,
      
      courseDescription: `Write 3 compelling course descriptions (2-3 sentences each) for a ${context.industry || 'industrial'} training program titled "${context.title || 'Professional Development Course'}". Focus on practical skills and career outcomes. Use CLEAR, CONCISE language that is easy to understand. Avoid jargon and complex terms. Current description: "${currentValue}". Return only the suggestions, separated by "---".`,
      
      learningOutcome: `Suggest 3 specific, measurable learning outcomes for a ${context.industry || 'industrial'} course titled "${context.title || 'Professional Development Course'}". Start each with action verbs like "Apply", "Demonstrate", "Analyze", etc. Use CLEAR, SIMPLE language that is easy to understand. Current outcome: "${currentValue}". Return only the suggestions, one per line.`,
      
      prerequisite: `Suggest 3 realistic prerequisites for a ${context.skillLevel || 'intermediate'} level course in ${context.industry || 'industrial'} sector titled "${context.title || 'Professional Development Course'}". Be specific about skills or certifications. Use CLEAR, PLAIN language that is easy to understand. Current prerequisite: "${currentValue}". Return only the suggestions, one per line.`,
      
      lessonTitle: `Suggest 3 engaging lesson titles for a training module within a ${context.industry || 'industrial'} course titled "${context.courseTitle || 'Professional Development Course'}". Keep them concise and action-oriented. Use CLEAR, SIMPLE language. Current title: "${currentValue}". Return only the suggestions, one per line.`,
      
      lessonDescription: `Write 3 brief lesson descriptions (1-2 sentences each) for a lesson titled "${context.lessonTitle || 'Training Module'}" within a ${context.industry || 'industrial'} course. Focus on what learners will do in this lesson. Use CLEAR, CONCISE language that is easy to understand. Current description: "${currentValue}". Return only the suggestions, separated by "---".`,
      
      lessonObjective: `Suggest 3 specific learning objectives for a lesson titled "${context.lessonTitle || 'Training Module'}" in a ${context.industry || 'industrial'} course. Use measurable action verbs and CLEAR, SIMPLE language. Current objective: "${currentValue}". Return only the suggestions, one per line.`,
    };

    const prompt_text = prompts[fieldType as keyof typeof prompts] || 
      `Provide 3 helpful suggestions to improve this text for a professional training course: "${currentValue}". Return only the suggestions, one per line.`;

    // Build enhanced system prompt with course context
    let systemPrompt = "You are an expert instructional designer helping create professional training courses for skilled trades and industrial sectors. Provide CLEAR, CONCISE, and practical suggestions that are industry-appropriate and professionally written. Use simple, direct language that is easy to understand. Avoid jargon and complex terms unless necessary for technical accuracy.";
    
    if (courseContext) {
      systemPrompt += "\n\n### COURSE CONTEXT ###";
      
      if (courseContext.jobDescription?.text) {
        systemPrompt += `\n\n**Job Description & Knowledge Standards:**\n${courseContext.jobDescription.text}`;
      }
      
      if (courseContext.courseStructure?.text) {
        systemPrompt += `\n\n**Course Structure Guidelines:**\n${courseContext.courseStructure.text}`;
      }
      
      systemPrompt += "\n\nUse this context to ensure all suggestions align with the specified job requirements and follow the established course structure guidelines. Ensure content is relevant to the target skills and knowledge areas.";
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user", 
          content: prompt_text
        }
      ],
      max_tokens: 300,
      temperature: 0.7,
    });

    const suggestion = completion.choices[0]?.message?.content?.trim();
    
    if (!suggestion) {
      return NextResponse.json(
        { error: 'No suggestion generated' },
        { status: 500 }
      );
    }

    // Parse multiple suggestions
    const suggestions = fieldType === 'courseDescription' || fieldType === 'lessonDescription' 
      ? suggestion.split('---').map(s => s.trim()).filter(s => s.length > 0)
      : suggestion.split('\n').map(s => s.trim()).filter(s => s.length > 0);

    return NextResponse.json({
      suggestions: suggestions.slice(0, 3), // Limit to 3 suggestions
      fieldType,
      context
    });

  } catch (error: any) {
    console.error('❌ OpenAI API error in suggestions:', error);
    console.error('❌ Error details:', {
      message: error.message,
      status: error.status,
      code: error.code,
      type: error.type
    });
    
    // Log specific OpenAI authentication errors
    if (error.status === 401) {
      console.error('❌ Authentication failed - API key invalid or expired');
      console.error('❌ API Key first 20 chars:', process.env.OPENAI_API_KEY?.substring(0, 20) + '...');
    }
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to generate suggestions',
        details: error.message,
        status: error.status || 500
      },
      { status: error.status || 500 }
    );
  }
} 