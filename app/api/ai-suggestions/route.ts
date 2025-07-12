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

    // Handle lesson title generation
    if (type === 'lesson_title') {
      const systemPrompt = `You are an expert instructional designer specializing in skilled trades and industrial training.

Your task is to generate lesson titles that will be part of a comprehensive course outline. Create titles that are:

- **Clear and descriptive** - learners should immediately understand what the lesson covers
- **Keyword-based and topical** - use keywords that clearly summarize the lesson content
- **Professional and industry-appropriate** - suitable for workplace training
- **Concise but informative** - typically 4-8 words
- **Specific and focused** - each lesson should cover a distinct skill or knowledge area
- **Logically progressive** - consider how this lesson fits in the overall learning sequence

Examples of good lesson titles:
- "Introduction to Data Centers"
- "Key Components of Data Centers"
- "Networking and Security in Data Centers"
- "Power Distribution Systems"
- "Cooling and HVAC Systems"
- "Server Hardware and Configuration"
- "Safety Protocols and Procedures"

Avoid generic or vague titles like:
- "Basic Equipment Overview"
- "Understanding Important Topics"
- "General Safety Information"`;

      const userPrompt = `Course: "${context.courseTitle}"
Industry: ${context.industry}
Skill Level: ${context.skillLevel}
Current Lesson Title: "${context.currentTitle}"
Current Lesson Description: "${context.currentDescription}"

Other lessons in this course:
${context.allLessons?.map((l: any, i: number) => `${i + 1}. ${l.title}`).join('\n') || 'None'}

Please suggest 3 alternative lesson titles that would be appropriate for this lesson within the course context. Each title should be clear, action-oriented, and specific to what learners will accomplish.`;

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
        max_tokens: 300,
        temperature: 0.7,
      });

      const response = completion.choices[0]?.message?.content?.trim();
      
      if (!response) {
        return NextResponse.json(
          { error: 'No title suggestions generated' },
          { status: 500 }
        );
      }

      const suggestions = response.split('\n')
        .map(s => s.trim())
        .filter(s => s.length > 0)
        .map(s => s.replace(/^\d+\.\s*/, '')) // Remove numbering
        .slice(0, 3);

      return NextResponse.json({
        success: true,
        suggestions,
        type: 'lesson_title'
      });
    }

    // Handle lesson description generation
    if (type === 'lesson_description') {
      const systemPrompt = `You are an expert instructional designer specializing in skilled trades and industrial training. 

Your task is to generate lesson descriptions that are CONCISE, CLEAR, and ACTION-ORIENTED, matching the style of professional course outlines.

Create descriptions that are:
- **Exactly 1-2 sentences** - be concise and direct
- **Action-focused** - describe what learners will DO, not just learn about
- **Specific and practical** - mention concrete skills, tasks, or knowledge
- **Professional but simple** - avoid flowery or overly complex language
- **Industry-appropriate** - use relevant terminology but keep it accessible

**Examples of GOOD concise descriptions:**
- "Explore the critical role of data center operations in ensuring business continuity and disaster recovery."
- "Learn proper safety lockout/tagout procedures for electrical equipment maintenance."
- "Install and test fiber optic connectors using industry-standard splicing techniques."

**Avoid verbose or wordy descriptions like:**
- "Learners will explore the essential safety protocols and security measures required to protect personnel and infrastructure in data centers, focusing on best practices for risk mitigation and emergency response."

Keep it simple, direct, and focused on the core learning activity.`;

      const userPrompt = `Course: "${context.courseTitle}"
Industry: ${context.industry}
Skill Level: ${context.skillLevel}
Lesson Title: "${context.lessonTitle}"
Current Description: "${context.currentDescription}"

Other lessons in this course:
${context.allLessons?.map((l: any, i: number) => `${i + 1}. ${l.title}: ${l.description}`).join('\n') || 'None'}

Please suggest 3 alternative descriptions for this lesson that explain what learners will do and achieve.`;

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
        max_tokens: 500,
        temperature: 0.7,
      });

      const response = completion.choices[0]?.message?.content?.trim();
      
      if (!response) {
        return NextResponse.json(
          { error: 'No description suggestions generated' },
          { status: 500 }
        );
      }

      const suggestions = response.split('\n\n')
        .map(s => s.trim())
        .filter(s => s.length > 0)
        .map(s => s.replace(/^\d+\.\s*/, '')) // Remove numbering
        .slice(0, 3);

      return NextResponse.json({
        success: true,
        suggestions,
        type: 'lesson_description'
      });
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
      
      lessonTitle: `Generate 3 CLEAR, CONCISE lesson titles that improve and refine the current text while maintaining its core meaning and focus.

**CRITICAL REQUIREMENTS:**
- **Base on current text**: Use "${currentValue}" as the foundation - improve clarity and conciseness without changing the core topic
- **No forced prefixes**: DO NOT automatically add "Implement", "Learn", "Understand" or similar prefixes unless they were in the original
- **Keep it natural**: Maintain the natural style and intent of the current title
- **Simple & clear**: Use plain, professional language that is easy to understand
- **Industry appropriate**: Suitable for ${context.industry || 'industrial'} training

**Examples of good improvements:**
- Current: "data center stuff" → Improved: "Data Center Infrastructure Basics"
- Current: "safety things" → Improved: "Workplace Safety Protocols"
- Current: "how to do wiring" → Improved: "Electrical Wiring Techniques"

**Avoid:**
- Adding unnecessary prefixes like "Implement..." when not in original
- Making titles overly complex or verbose
- Changing the core subject matter

Current title: "${currentValue}". Return only the suggestions, one per line.`,
      
      lessonDescription: `Generate 3 CLEAR, CONCISE lesson descriptions (1-2 sentences each) that describe what this lesson covers, using the lesson title as context.

**CRITICAL REQUIREMENTS:**
- **Use lesson title as context**: Base the description on the lesson title "${context.lessonTitle || currentValue}"
- **Describe what's covered**: Focus on what topics, skills, or concepts the lesson teaches
- **Be concise**: Keep each description to 1-2 sentences maximum
- **Clear & simple**: Use plain, professional language that is easy to understand
- **No "learners will" language**: Write direct descriptions of lesson content

**Examples of good descriptions:**
- For "Electrical Safety Basics": "Cover fundamental electrical safety principles and hazard identification procedures."
- For "Data Center Infrastructure": "Explore the key components of data center infrastructure including power, cooling, and networking systems."
- For "Welding Techniques": "Demonstrate proper welding techniques for steel joints using MIG and TIG welding methods."

**Avoid:**
- Starting with "Students will..." or "Learners will..."
- Overly complex or verbose explanations
- Vague descriptions that don't specify what's actually covered

Current description: "${currentValue}". Return only the suggestions, separated by "---".`,
      
      lessonObjective: `Generate 3 SPECIFIC, CONCISE learning objectives for a lesson titled "${context.lessonTitle || 'Training Module'}" in a ${context.industry || 'industrial'} course. 

**CRITICAL REQUIREMENTS:**

**FORMAT:** Start directly with action verbs - DO NOT use "Students will", "Learners will", "Participants will" or similar prefixes.

**NEVER use generic verbs:** recognize, understand, be familiar with, know about, appreciate, be aware of, get acquainted with, comprehend, learn about

**ALWAYS use specific action verbs:** identify, explain, demonstrate, calculate, install, troubleshoot, operate, maintain, inspect, test, calibrate, configure, assemble, disassemble, measure, analyze, compare, evaluate, apply, implement, perform, execute, follow, create, design, modify, repair, replace, adjust, monitor, control

**Each objective must be:**
- **Start directly with action verb** - NO "Students will" prefix
- **Concise and direct** - one clear sentence each
- **Specific and measurable** - exactly what learners will DO
- **Professional but simple** - avoid verbose explanations

**PERFECT examples (correct format):**
- "Explain how data center operations contribute to business continuity"
- "Identify risks associated with data center downtime and their business impacts" 
- "Demonstrate proper safety procedures for equipment maintenance"

**WRONG examples (avoid these formats):**
- "Students will be able to identify and explain the function of fire suppression systems"
- "Learners will recognize major components within a data center"
- "Participants will understand safety procedures"

**Remember:** Start each objective immediately with the action verb. No introductory phrases.

Current objective: "${currentValue}". Return only the suggestions, one per line.`,
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