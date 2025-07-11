import { NextRequest, NextResponse } from 'next/server';
import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { generationType, courseContext, courseData, lesson } = await request.json();

    console.log('🔍 Course Generation - API Key present:', !!process.env.OPENAI_API_KEY);
    console.log('🔍 Course Generation - API Key length:', process.env.OPENAI_API_KEY?.length);
    console.log('🔍 Course Generation - Generation Type:', generationType);

    if (!process.env.OPENAI_API_KEY) {
      console.error('❌ OpenAI API key not configured');
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    let systemPrompt = '';
    let userPrompt = '';

    if (generationType === 'courseInfo') {
      // Generate course information from context
      systemPrompt = `You are an expert instructional designer specializing in skilled trades and industrial training. Based on the provided course context, generate comprehensive course information that aligns with industry standards and best practices.

Return your response as a JSON object with the following structure:
{
  "title": "Course title (concise, professional)",
  "description": "Detailed course description (2-3 paragraphs)",
  "industry": "Primary industry category",
  "skillLevel": "beginner|intermediate|advanced",
  "estimatedDuration": "Number of hours (e.g., 8, 24, 40)",
  "learningOutcomes": ["outcome 1", "outcome 2", "outcome 3", "outcome 4"],
  "prerequisites": ["prerequisite 1", "prerequisite 2", "prerequisite 3"],
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"]
}

Ensure all content is:
- CLEAR and CONCISE - use simple, direct language that is easy to understand
- Industry-appropriate and professional
- Aligned with the job description/knowledge standards provided
- Follows the course structure guidelines
- Suitable for skilled trades and industrial sectors

For learning outcomes and prerequisites, provide clear, actionable statements that are:
- Specific and measurable
- Written in plain language
- Directly relevant to the job requirements
- Appropriate for the target skill level

For tags, generate 4-6 relevant keywords that would help categorize and discover this course, focusing on:
- Technical skills covered
- Industry-specific terms
- Tools and equipment
- Safety aspects
- Certification relevance`;

      userPrompt = `Generate course information based on this context:

**Job Description & Knowledge Standards:**
${courseContext?.jobDescription?.text || 'No job description provided'}

**Course Structure Guidelines:**
${courseContext?.courseStructure?.text || 'No course structure provided'}

Please create a comprehensive course that addresses the skills and knowledge requirements outlined in the job description while following the structure guidelines provided.`;

    } else if (generationType === 'lessons') {
      // Generate lessons from course information
      systemPrompt = `You are an expert instructional designer specializing in skilled trades and industrial training. Based on the provided course information and context, generate a logical lesson structure that builds skills progressively.

Return your response as a JSON object with the following structure:
{
  "lessons": [
    {
      "id": "lesson-1",
      "title": "Lesson title",
      "description": "Lesson description (1-2 sentences)",
      "objectives": ["objective 1", "objective 2", "objective 3"],
      "duration": "Number of hours (e.g., 2, 4, 8)",
      "order": 1,
      "microlessons": []
    }
  ]
}

Create 4-8 lessons that:
- Build skills progressively from basic to advanced
- Address all learning outcomes
- Are appropriate for the target skill level
- Follow industry-standard training progression
- Include hands-on practical elements where appropriate

Ensure all lesson content is:
- CLEAR and CONCISE - use simple, direct language that is easy to understand
- Practical and actionable
- Directly relevant to job requirements
- Written in plain language appropriate for skilled trades professionals

For lesson titles and descriptions, be specific and descriptive while keeping language simple and accessible.`;

      userPrompt = `Generate lessons for this course:

**Course Title:** ${courseData?.title || 'Untitled Course'}
**Description:** ${courseData?.description || 'No description'}
**Industry:** ${courseData?.industry || 'General'}
**Skill Level:** ${courseData?.courseLevel || courseData?.skillLevel || 'intermediate'}
**Duration:** ${courseData?.duration || 'Not specified'}

**Learning Outcomes:**
${courseData?.learningOutcomes?.map((outcome: string, index: number) => `${index + 1}. ${outcome}`).join('\n') || 'No learning outcomes specified'}

**Prerequisites:**
${courseData?.prerequisites?.map((prereq: string, index: number) => `${index + 1}. ${prereq}`).join('\n') || 'No prerequisites specified'}

**Original Course Context:**
**Job Description & Knowledge Standards:**
${courseContext?.jobDescription?.text || 'No job description provided'}

**Course Structure Guidelines:**
${courseContext?.courseStructure?.text || 'No course structure provided'}

Create a logical lesson progression that builds the required skills and knowledge systematically.`;

    } else if (generationType === 'microlessons') {
      // Generate microlessons for a specific lesson
      systemPrompt = `You are an expert instructional designer specializing in skilled trades and industrial training. Based on the provided lesson information and course context, generate very specific, atomized microlessons that break down complex skills into manageable 5-10 minute learning units.

Return your response as a JSON object with the following structure:
{
  "microlessons": [
    {
      "id": "microlesson-1",
      "title": "Very specific, atomized topic (e.g., 'Identify a phillips screwdriver and know how to operate it')",
      "description": "Brief description of what this microlesson covers",
      "duration": "5-10 minutes",
      "objectives": ["specific learning objective 1", "specific learning objective 2"],
      "content": "Brief overview of what will be taught",
      "practicalApplication": "How this skill is applied in real work scenarios"
    }
  ]
}

Create 4-8 microlessons that:
- Are very specific and atomized topics (each should be 5-10 minutes long)
- Break down the lesson into the smallest teachable components
- Focus on practical, hands-on skills when appropriate
- Are directly relevant to the job requirements
- Build toward the lesson's objectives
- Use clear, simple language appropriate for skilled trades professionals

IMPORTANT: Each microlesson should be a very specific, focused topic that can be completed in 5-10 minutes. Examples:
- "Identify a phillips screwdriver and know how to operate it"
- "Measure voltage using a digital multimeter"
- "Apply proper safety lockout procedures for electrical panels"
- "Read and interpret basic circuit diagrams"

Ensure all microlesson content is:
- CLEAR and CONCISE - use simple, direct language that is easy to understand
- Highly specific and actionable
- Directly relevant to job requirements
- Written in plain language appropriate for skilled trades professionals`;

      userPrompt = `Generate microlessons for this lesson:

**Lesson Title:** ${lesson?.title || 'Untitled Lesson'}
**Lesson Description:** ${lesson?.description || 'No description'}
**Lesson Objectives:** ${lesson?.objectives?.join(', ') || 'No objectives specified'}

**Course Context:**
**Course Title:** ${courseData?.title || 'Untitled Course'}
**Industry:** ${courseData?.industry || 'General'}
**Skill Level:** ${courseData?.courseLevel || courseData?.skillLevel || 'intermediate'}
**Course Description:** ${courseData?.description || 'No description'}

**Learning Outcomes:** ${courseData?.learningOutcomes?.join(', ') || 'No learning outcomes specified'}

**Original Course Context:**
**Job Description & Knowledge Standards:**
${courseContext?.jobDescription?.text || 'No job description provided'}

**Course Structure Guidelines:**
${courseContext?.courseStructure?.text || 'No course structure provided'}

Create very specific, atomized microlessons (5-10 minutes each) that break down the lesson into the smallest teachable components while staying aligned with the job requirements and course objectives.`;

    } else if (generationType === 'assessments') {
      // Generate assessments from course information
      systemPrompt = `You are an expert instructional designer specializing in skilled trades and industrial training. Based on the provided course information and lessons, generate comprehensive assessments that effectively evaluate learner competency.

Return your response as a JSON object with the following structure:
{
  "assessments": [
    {
      "id": "assessment-1",
      "title": "Assessment title",
      "type": "quiz|practical|project",
      "description": "Brief description of what the assessment covers",
      "questions": 10,
      "duration": "30 minutes",
      "passingScore": 80
    }
  ]
}

Create 2-4 assessments that:
- Cover different aspects of learning (knowledge, skills, application)
- Include a mix of assessment types:
  * Quiz: Multiple choice, true/false, fill-in-blank for knowledge retention
  * Practical: Hands-on demonstration of skills and procedures
  * Project: Real-world application combining multiple skills
- Are appropriate for the target skill level
- Align with industry certification standards when applicable
- Provide meaningful evaluation of competency

Assessment Types Guidelines:
- QUIZ: 5-15 questions, 15-30 minutes, focuses on safety knowledge, theory, identification
- PRACTICAL: Hands-on demonstration, 30-60 minutes, focuses on specific skills and procedures
- PROJECT: Comprehensive application, 1-3 hours, focuses on integrating multiple skills

Ensure all assessment content is:
- CLEAR and CONCISE - use simple, direct language that is easy to understand
- Relevant to real job requirements
- Appropriately challenging for the skill level
- Focused on essential competencies
- Written in plain language appropriate for skilled trades professionals`;

      userPrompt = `Generate assessments for this course:

**Course Title:** ${courseData?.title || 'Untitled Course'}
**Description:** ${courseData?.description || 'No description'}
**Industry:** ${courseData?.industry || 'General'}
**Skill Level:** ${courseData?.courseLevel || courseData?.skillLevel || 'intermediate'}
**Duration:** ${courseData?.duration || 'Not specified'}

**Learning Outcomes:**
${courseData?.learningOutcomes?.map((outcome: string, index: number) => `${index + 1}. ${outcome}`).join('\n') || 'No learning outcomes specified'}

**Lessons:**
${courseData?.lessons?.map((lesson: any, index: number) => `${index + 1}. ${lesson.title} - ${lesson.description}`).join('\n') || 'No lessons specified'}

**Original Course Context:**
**Job Description & Knowledge Standards:**
${courseContext?.jobDescription?.text || 'No job description provided'}

**Course Structure Guidelines:**
${courseContext?.courseStructure?.text || 'No course structure provided'}

Create comprehensive assessments that effectively measure learner competency in the skills and knowledge covered in this course. Include a variety of assessment types to evaluate different aspects of learning.`;
    } else {
      return NextResponse.json(
        { error: `Unsupported generation type: ${generationType}` },
        { status: 400 }
      );
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o", // Using gpt-4o as requested in the memories
      messages: [
        {
          role: "system",
          content: systemPrompt + "\n\nIMPORTANT: You MUST respond with valid JSON only. Do not include any conversational text, explanations, or markdown formatting. Return only the JSON object as specified in the format above."
        },
        {
          role: "user", 
          content: userPrompt
        }
      ],
      max_tokens: 2000,
      temperature: 0.7,
    });

    const responseText = completion.choices[0].message.content;
    
    if (!responseText) {
      throw new Error('No response from OpenAI');
    }

    // Enhanced JSON parsing with better error handling
    let generatedData;
    try {
      let jsonString = responseText.trim();
      
      // Check if response is conversational (not JSON)
      if (jsonString.toLowerCase().includes('hello') || jsonString.toLowerCase().includes('how can i help') || 
          jsonString.toLowerCase().includes('assist you') || !jsonString.includes('{')) {
        throw new Error('AI returned conversational response instead of JSON format');
      }
      
      // Remove markdown code blocks if present
      if (jsonString.includes('```json')) {
        const jsonMatch = jsonString.match(/```json\s*([\s\S]*?)\s*```/);
        if (jsonMatch) {
          jsonString = jsonMatch[1];
        }
      } else if (jsonString.includes('```')) {
        const jsonMatch = jsonString.match(/```\s*([\s\S]*?)\s*```/);
        if (jsonMatch) {
          jsonString = jsonMatch[1];
        }
      }
      
      // Try to find JSON object within the text
      const jsonMatch = jsonString.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        jsonString = jsonMatch[0];
      }
      
      // Clean up any extra text before/after JSON
      jsonString = jsonString.replace(/^[^{]*/, '').replace(/[^}]*$/, '');
      
      generatedData = JSON.parse(jsonString);
      
      // Validate the structure based on generation type
      if (generationType === 'lessons' && !generatedData.lessons) {
        throw new Error('Response missing required "lessons" property');
      }
      if (generationType === 'microlessons' && !generatedData.microlessons) {
        throw new Error('Response missing required "microlessons" property');
      }
      if (generationType === 'assessments' && !generatedData.assessments) {
        throw new Error('Response missing required "assessments" property');
      }
      if (generationType === 'courseInfo' && !generatedData.title) {
        throw new Error('Response missing required course info properties');
      }
      
    } catch (parseError) {
      console.error('Failed to parse OpenAI response as JSON:', responseText);
      console.error('Parse error:', parseError);
      
      // Return a helpful error with the raw response for debugging
      return NextResponse.json(
        { 
          error: 'Invalid JSON response from AI',
          details: `Parse error: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`,
          rawResponse: responseText.substring(0, 500), // First 500 chars for debugging
          generationType
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      data: generatedData 
    });

  } catch (error: any) {
    console.error('❌ OpenAI API error:', error);
    console.error('❌ Error details:', {
      message: error.message,
      status: error.status,
      code: error.code,
      type: error.type,
      stack: error.stack?.split('\n').slice(0, 3) // First 3 lines of stack trace
    });
    
    // Log specific OpenAI authentication errors
    if (error.status === 401) {
      console.error('❌ Authentication failed - API key invalid or expired');
      console.error('❌ API Key first 20 chars:', process.env.OPENAI_API_KEY?.substring(0, 20) + '...');
      console.error('❌ API Key last 10 chars:', '...' + process.env.OPENAI_API_KEY?.substring(-10));
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to generate course content',
        details: error.message,
        status: error.status || 500
      },
      { status: error.status || 500 }
    );
  }
} 