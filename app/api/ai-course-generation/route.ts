import { NextRequest, NextResponse } from 'next/server';
import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { generationType, courseContext, courseData, lesson, lessonData, previousMicrolessons } = await request.json();

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

CRITICAL: For learning objectives, be HIGHLY SPECIFIC and DETAILED:
- NEVER use generic verbs like "recognize," "understand," or "be familiar with"
- ALWAYS break down broad concepts into their specific components
- ENUMERATE actual items, systems, processes, or tools when applicable
- Use precise action verbs: "identify," "explain," "demonstrate," "calculate," "install," "troubleshoot," "operate," "maintain"

Examples of GOOD vs BAD objectives:
❌ BAD: "Recognize major components within a data center"
✅ GOOD: "Identify and explain the function of electrical systems, power distribution units, compute servers, cooling systems, networking equipment, and backup generators in data center operations"

❌ BAD: "Understand safety procedures"
✅ GOOD: "Demonstrate lockout/tagout procedures, explain arc flash protection requirements, and apply proper PPE selection for electrical work environments"

❌ BAD: "Learn about welding equipment"
✅ GOOD: "Identify MIG welders, TIG welders, stick welders, and plasma cutters; explain when to use each type; and demonstrate proper setup procedures for each welding method"

Ensure all lesson content is:
- CLEAR and CONCISE - use simple, direct language that is easy to understand
- Practical and actionable
- Directly relevant to job requirements
- Written in plain language appropriate for skilled trades professionals
- SPECIFIC with enumerated components, tools, processes, or systems

For lesson titles and descriptions, be specific and descriptive while keeping language simple and accessible.`;

      userPrompt = `Generate lessons for this course:

**CORE COURSE INFORMATION:**
**Course Title:** ${courseData?.title || 'Untitled Course'}
**Description:** ${courseData?.description || 'No description'}
**Industry:** ${courseData?.industry || 'General'}
**Skill Level:** ${courseData?.courseLevel || courseData?.skillLevel || 'intermediate'}
**Duration:** ${courseData?.duration || 'Not specified'}

**LEARNING OBJECTIVES (What students must achieve):**
${courseData?.learningOutcomes?.map((outcome: string, index: number) => `${index + 1}. ${outcome}`).join('\n') || 'No learning outcomes specified'}

**PREREQUISITES (What students need before starting):**
${courseData?.prerequisites?.map((prereq: string, index: number) => `${index + 1}. ${prereq}`).join('\n') || 'No prerequisites specified'}

**COMPREHENSIVE COURSE CONTEXT:**
**Job Description & Knowledge Standards:**
${courseData?.context?.jobDescription?.text || courseContext?.jobDescription?.text || 'No job description provided'}

**Course Structure Guidelines:**
${courseData?.context?.courseStructure?.text || courseContext?.courseStructure?.text || 'No course structure provided'}

**CRITICAL INSTRUCTIONS:**
- Create lessons that systematically build toward ALL learning objectives listed above
- Ensure each lesson addresses specific job requirements from the job description
- Follow the course structure guidelines provided
- Progress from foundational concepts to advanced application
- Include hands-on practical elements aligned with industry standards
- Make lessons directly applicable to real workplace scenarios

Create a logical lesson progression that builds the required skills and knowledge systematically, ensuring every learning objective is addressed through the lesson sequence.`;

    } else if (generationType === 'microlessons') {
      // Generate microlessons for a specific lesson
      systemPrompt = `You are an expert instructional designer specializing in skilled trades and industrial training. Your task is to take the lesson's learning objectives and atomize them into the most specific, niche, focused microlessons possible.

**CRITICAL SEQUENTIAL LEARNING REQUIREMENTS:**
- BUILD UPON PREVIOUS KNOWLEDGE: Each microlesson must logically build on concepts covered in previous microlessons
- AVOID PREMATURE DEPENDENCIES: Never introduce concepts that require knowledge not yet covered in previous microlessons
- MAINTAIN LINEAR PROGRESSION: Ensure each new microlesson follows naturally from the last, creating a smooth learning path
- CONSIDER PREREQUISITE ORDER: Place foundational concepts before advanced applications

**CRITICAL TITLE REQUIREMENTS:**
- NEVER use generic titles like "Introduction to [Topic] - Part 1", "[Lesson Name] - Part 2", etc.
- Each title must describe the SPECIFIC TOPIC, SKILL, or CONCEPT being taught
- Base each title directly on the learning objective it addresses
- Use descriptive, topic-focused titles that clearly communicate what will be learned

**CRITICAL ATOMIZATION APPROACH:**
- Take each learning objective from the lesson and break it down into its smallest teachable components
- Each microlesson should focus on ONE very specific skill, tool, concept, or procedure
- Think granularly - if a learning objective mentions "power systems," create separate microlessons for each component (transformers, generators, distribution panels, etc.)
- Each microlesson should have only 1 learning objective (occasionally 2 if closely related)

Return your response as a JSON object with the following structure:
{
  "microlessons": [
    {
      "id": "microlesson-1",
      "title": "Specific topic name that directly describes what will be learned (e.g., 'Power Distribution Units and Their Functions')",
      "description": "Brief, clear description of the specific topic covered in this 5-10 minute unit",
      "duration": "5-10 minutes",
      "objectives": ["One very specific, actionable learning objective"],
      "content": "Brief overview of what will be taught",
      "practicalApplication": "How this specific skill is applied in real work scenarios"
    }
  ]
}

**MICROLESSON REQUIREMENTS:**
- Create 3-6 microlessons (minimum 3, maximum 6)
- Each microlesson should be 5-10 minutes of highly focused content
- Each microlesson should have exactly 1 learning objective (occasionally 2 if inseparable)
- Learning objectives must be very clear, specific, and concise
- Break down broad lesson objectives into their component parts

**TITLE EXAMPLES (GOOD vs BAD):**
❌ BAD: "Introduction to Data Centers - Part 1", "Data Center Components - Part 2"
✅ GOOD: "Power Distribution Units and Their Functions", "UPS Systems and Backup Power Equipment", "Cooling System Components", "Server Rack Organization"

❌ BAD: "Electrical Safety - Part 1", "Safety Procedures - Part 2"  
✅ GOOD: "LOTO (Lockout/Tagout) Procedures", "PPE Selection for Electrical Work", "Arc Flash Hazard Identification"

**ATOMIZATION EXAMPLES:**
Instead of one microlesson on "Data Center Components," create separate microlessons like:
- "Power Distribution Units and Their Functions"
- "UPS Systems and Backup Power Equipment"  
- "Cooling System Components"
- "Server Rack Organization and Cabling"

Instead of "Electrical Safety," atomize into:
- "LOTO (Lockout/Tagout) Procedures"
- "PPE Selection for Electrical Work"
- "Arc Flash Hazard Identification"

**LEARNING OBJECTIVE QUALITY:**
- Start directly with action verbs (identify, demonstrate, operate, install, etc.)
- Be ultra-specific about what exactly the learner will do
- Avoid generic terms - name specific tools, components, procedures
- Each objective should be measurable and achievable in 5-10 minutes

Ensure all microlesson content is:
- ULTRA-SPECIFIC and NICHE - focus on the smallest teachable unit
- CLEAR and ACTIONABLE - learner knows exactly what they'll accomplish
- DIRECTLY APPLICABLE - relates to real job tasks from the provided context
- APPROPRIATELY SCOPED - can be mastered in 5-10 minutes`;

      userPrompt = `Generate microlessons for this lesson:

**LESSON INFORMATION:**
**Lesson Title:** ${lesson?.title || 'Untitled Lesson'}
**Lesson Description:** ${lesson?.description || 'No description'}
**Lesson Objectives:** ${lesson?.objectives?.join(', ') || 'No objectives specified'}

**COMPREHENSIVE COURSE CONTEXT:**
**Course Title:** ${courseData?.title || 'Untitled Course'}
**Industry:** ${courseData?.industry || 'General'}
**Skill Level:** ${courseData?.courseLevel || courseData?.skillLevel || 'intermediate'}
**Course Description:** ${courseData?.description || 'No description'}
**Course Duration:** ${courseData?.duration || 'Not specified'}

**COURSE PREREQUISITES:**
${courseData?.prerequisites?.map((prereq: string, index: number) => `${index + 1}. ${prereq}`).join('\n') || 'No prerequisites specified'}

**OVERALL COURSE LEARNING OBJECTIVES:**
${courseData?.learningOutcomes?.map((outcome: string, index: number) => `${index + 1}. ${outcome}`).join('\n') || 'No learning outcomes specified'}

**PREVIOUSLY COVERED MICROLESSONS (CRITICAL - BUILD UPON THESE):**
${previousMicrolessons && previousMicrolessons.length > 0 
  ? previousMicrolessons.map((ml: any, index: number) => `${index + 1}. "${ml.title}" - Objectives: ${ml.objectives?.join(', ') || 'None specified'} - Content: ${ml.content || 'No content'}`).join('\n')
  : 'This is the first lesson - no previous microlessons to build upon'}

**JOB DESCRIPTION & KNOWLEDGE STANDARDS (Critical for workplace relevance):**
${courseData?.context?.jobDescription?.text || courseContext?.jobDescription?.text || 'No job description provided'}

**COURSE STRUCTURE GUIDELINES (Framework for content design):**
${courseData?.context?.courseStructure?.text || courseContext?.courseStructure?.text || 'No course structure provided'}

**CRITICAL INSTRUCTIONS:**
- Each microlesson must be 5-10 minutes of focused, specific content
- Break down the lesson objectives into the smallest teachable components
- Ensure each microlesson directly supports the lesson objectives
- **SEQUENTIAL DEPENDENCY**: Each new microlesson must logically build upon concepts covered in the PREVIOUSLY COVERED MICROLESSONS listed above
- **AVOID KNOWLEDGE GAPS**: Never introduce concepts, tools, or procedures that require knowledge not yet covered in previous microlessons
- **LINEAR PROGRESSION**: Order microlessons so each one naturally follows from the previous, creating a smooth learning path
- **PREREQUISITE AWARENESS**: Always consider what learners have already learned from previous microlessons when designing new content
- Make content immediately applicable to real job requirements
- Include practical, hands-on elements where appropriate
- Use clear, simple language suitable for the target skill level
- Ensure progression builds systematically toward lesson completion

Create very specific, atomized microlessons (5-10 minutes each) that break down the lesson into the smallest teachable components while maintaining perfect sequential progression and building systematically upon all previously covered content. Each microlesson should feel like a natural next step in the learning journey.`;

    } else if (generationType === 'learningObjectives') {
      // Generate learning objectives for a specific lesson
      systemPrompt = `You are an expert instructional designer specializing in skilled trades and industrial training. Based on the provided lesson information and course context, generate clear, specific, and measurable learning objectives for the lesson.

Return your response as a JSON object with the following structure:
{
  "objectives": [
    "Identify and select the appropriate screwdriver type for different screw heads",
    "Demonstrate proper screwdriver grip and technique for effective torque application", 
    "Apply proper safety procedures when using screwdrivers and recognize common hazards"
  ]
}

Create 3-5 learning objectives that:
- Are specific, measurable, and actionable
- Use clear action verbs (identify, demonstrate, apply, explain, perform, etc.)
- Are directly relevant to the lesson content and job requirements
- Build toward the overall course learning outcomes
- Are appropriate for the target skill level
- Focus on practical, hands-on skills when applicable

CRITICAL: Make objectives HIGHLY SPECIFIC and DETAILED:
- NEVER use generic verbs like "recognize," "understand," or "be familiar with"
- ALWAYS break down broad concepts into their specific components
- ENUMERATE actual items, systems, processes, or tools when applicable
- Use precise action verbs: "identify," "explain," "demonstrate," "calculate," "install," "troubleshoot," "operate," "maintain"

Examples of GOOD vs BAD objectives:
❌ BAD: "Recognize major components within a data center"
✅ GOOD: "Identify and explain the function of electrical systems, power distribution units, compute servers, cooling systems, networking equipment, and backup generators in data center operations"

❌ BAD: "Understand safety procedures"
✅ GOOD: "Demonstrate lockout/tagout procedures, explain arc flash protection requirements, and apply proper PPE selection for electrical work environments"

❌ BAD: "Learn about welding equipment"
✅ GOOD: "Identify MIG welders, TIG welders, stick welders, and plasma cutters; explain when to use each type; and demonstrate proper setup procedures for each welding method"

FORMAT REQUIREMENTS:
- Start directly with action verbs - DO NOT use "Students will", "Learners will", "Participants will" or similar prefixes
- Each objective should follow the format: "[Action verb] [specific skill/knowledge] [context/condition]"
- Be concise and professional

Ensure all learning objectives are:
- CLEAR and CONCISE - use simple, direct language that is easy to understand
- Specific and measurable with enumerated components
- Achievable within the lesson timeframe
- Directly relevant to job requirements
- Written in plain language appropriate for skilled trades professionals`;

      userPrompt = `Generate learning objectives for this lesson:

**LESSON INFORMATION:**
**Lesson Title:** ${lessonData?.title || 'Untitled Lesson'}
**Lesson Description:** ${lessonData?.description || 'No description'}
**Current Objectives:** ${lessonData?.currentObjectives?.length ? lessonData.currentObjectives.join(', ') : 'None currently defined'}

**COMPREHENSIVE COURSE CONTEXT:**
**Course Title:** ${courseData?.title || 'Untitled Course'}
**Industry:** ${courseData?.industry || 'General'}
**Skill Level:** ${courseData?.skillLevel || 'intermediate'}
**Course Description:** ${courseData?.description || 'No description'}
**Course Duration:** ${courseData?.duration || 'Not specified'}

**COURSE PREREQUISITES:**
${courseData?.prerequisites?.map((prereq: string, index: number) => `${index + 1}. ${prereq}`).join('\n') || 'No prerequisites specified'}

**OVERALL COURSE LEARNING OBJECTIVES (Lesson must contribute to these):**
${courseData?.learningOutcomes?.map((outcome: string, index: number) => `${index + 1}. ${outcome}`).join('\n') || 'No learning outcomes specified'}

**JOB DESCRIPTION & KNOWLEDGE STANDARDS (Critical context for relevance):**
${courseData?.context?.jobDescription?.text || 'No job description provided'}

**COURSE STRUCTURE GUIDELINES (Framework for lesson design):**
${courseData?.context?.courseStructure?.text || 'No course structure provided'}

**CRITICAL INSTRUCTIONS:**
- Create objectives that directly align with specific course learning objectives listed above
- Ensure objectives address real job requirements from the job description context
- Make objectives appropriate for the specified skill level and industry
- Focus on practical, measurable skills that can be applied in the workplace
- Consider the course prerequisites when setting objective difficulty
- Ensure objectives fit within the overall course structure guidelines

Create specific, measurable learning objectives that align with the lesson content and contribute to the overall course learning outcomes while being directly relevant to the job requirements and industry standards.`;

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
      model: "gpt-4.1-mini", // Updated to GPT-4.1 Mini (released April 14, 2025)
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
      max_tokens: 8000, // Increased from 2000 to 8000 for more comprehensive responses
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
      if (generationType === 'learningObjectives' && !generatedData.objectives) {
        throw new Error('Response missing required "objectives" property');
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

    // Return appropriate response based on generation type
    if (generationType === 'learningObjectives') {
      return NextResponse.json({
        success: true,
        objectives: generatedData.objectives
      });
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