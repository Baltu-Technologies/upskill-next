# AI-Enhanced Course Creator

The AI-Enhanced Course Creator provides intelligent text suggestions throughout the course creation workflow, helping instructors develop professional, industry-appropriate training content faster and more effectively.

## 🎯 Course Context Foundation

The system includes a foundational **Course Context** system that ensures all AI suggestions are aligned with specific job requirements and course structure guidelines. This context is automatically injected into every AI prompt throughout the course creation process.

### Context Components

#### 1. Job Description & Knowledge Standards
- Upload PDFs, text files, or enter manual text
- Includes job descriptions, curriculum standards, learning objectives
- Defines what skills and knowledge the course should cover
- Supports industry standards and compliance requirements

#### 2. Course Structure Guidelines
- Master guidelines for content creation consistency
- System prompts that structure learning progression
- Ensures proper content sequencing and dependencies
- Prevents microlessons from referencing uncreated material

### Context Features
- **File Upload Support**: PDF, TXT, MD files up to 10MB
- **Drag & Drop Interface**: Easy file management
- **Manual Text Entry**: Direct text input for context
- **Context Preview**: Real-time preview of loaded content
- **Persistent Context**: Automatically included in all AI suggestions

## 🎯 Features

### Smart Text Suggestions
- **Contextual AI**: Suggestions are tailored based on industry, skill level, and existing content
- **Non-destructive**: Original text is never replaced automatically
- **Accept/Decline Interface**: Review and selectively choose suggestions
- **Real-time Context**: AI considers all related fields when generating suggestions
- **Clear & Concise**: AI emphasizes simple, direct language that's easy to understand

### Inline Editing
- **Edit Learning Outcomes**: Click the edit button to modify individual learning outcomes
- **Edit Prerequisites**: Click the edit button to modify individual prerequisites
- **Keyboard Shortcuts**: Press Enter to save or Escape to cancel editing
- **Real-time Updates**: Changes are immediately reflected in the course data

### Auto-Generated Tags
- **Intelligent Categorization**: Automatically generates relevant tags for course discovery
- **Industry-Specific**: Tags focus on technical skills, tools, equipment, and safety aspects
- **Editable**: All generated tags can be modified or removed manually

### Duration Management
- **Hours-Based**: All durations are measured in hours for consistency and clarity
- **Course Duration**: Total learning time in hours (e.g., 8, 24, 40)
- **Lesson Duration**: Individual lesson time in hours (e.g., 2, 4, 8)
- **Auto-Generated**: Durations are automatically calculated based on course content and complexity

### Supported Fields
- **Course Title**: Professional, engaging course names
- **Course Description**: Comprehensive overviews focused on practical outcomes
- **Learning Outcomes**: Specific, measurable objectives using action verbs
- **Prerequisites**: Realistic skill and knowledge requirements
- **Lesson Titles**: Concise, action-oriented lesson names
- **Lesson Descriptions**: Brief summaries of lesson content
- **Lesson Objectives**: Specific learning goals for individual lessons

## 🚀 How to Use

### 1. Course Context Setup
Before creating content, set up your course context:

1. **Upload Job Description**: Add job descriptions, knowledge standards, or curriculum requirements
2. **Define Course Structure**: Provide guidelines for content organization and progression
3. **File Support**: Upload PDF, TXT, or MD files, or enter text manually

### 2. AI Auto-Generation Workflow
The system now supports automatic course generation from context:

1. **Complete Course Context**: Ensure both job description and course structure are provided
2. **Generate Course Info**: Click "Next" to auto-generate course title, description, learning outcomes, and prerequisites
3. **Generate Lesson Structure**: After reviewing course info, click "Next" to auto-generate comprehensive lesson plans
4. **Review and Edit**: All generated content is editable and can be refined

### 3. Manual Enhancement
For detailed customization, use the AI-enhanced text inputs:

1. **Enter Initial Content**: Type your draft text in any field
2. **Request Suggestions**: Click the ✨ (Sparkles) button next to the field
3. **Review Options**: AI will provide 2-3 contextual suggestions
4. **Accept or Decline**: 
   - Click ✅ to replace your text with a suggestion
   - Click ❌ to remove a suggestion from the list
   - Click ↻ to generate new suggestions

### 4. Setting Up
Ensure you have an OpenAI API key configured in your environment:
```bash
OPENAI_API_KEY=your_openai_api_key_here
```

### 2. Creating Suggestions

1. **Enter Initial Content**: Type your draft text in any field
2. **Request Suggestions**: Click the ✨ (Sparkles) button next to the field
3. **Review Options**: AI will provide 2-3 contextual suggestions
4. **Accept or Decline**: 
   - Click ✅ to replace your text with a suggestion
   - Click ❌ to remove a suggestion from the list
   - Click ↻ to generate new suggestions

### 3. Best Practices

**For Better Suggestions:**
- Provide some initial text rather than starting completely blank
- Fill out related fields (industry, skill level) for better context
- Use descriptive course/lesson titles to help AI understand scope

**Workflow Tips:**
- Start with course-level information before lesson details
- Review all suggestions before accepting
- Use suggestions as inspiration rather than exact replacements
- Combine multiple suggestions to create ideal content

## 🔧 Technical Implementation

### Model Configuration
- **Model**: GPT-4o (highest quality suggestions and understanding)
- **Temperature**: 0.7 (balanced creativity and consistency)
- **Max Tokens**: 300 (concise but comprehensive suggestions)
- **System Context**: Instructional design expertise focused on skilled trades
- **Language Emphasis**: Clear, concise, and simple language that's easy to understand

### API Endpoints

#### AI Suggestions
```
POST /api/ai-suggestions
```

#### AI Auto-Generation
```
POST /api/ai-course-generation
```

### Request Format
```json
{
  "fieldType": "courseTitle",
  "currentValue": "Basic Semiconductor",
  "context": {
    "industry": "Semiconductor & Microelectronics",
    "skillLevel": "intermediate",
    "title": "Existing course title"
  },
  "courseContext": {
    "jobDescription": {
      "text": "Job description and knowledge standards...",
      "source": "file",
      "files": [...]
    },
    "courseStructure": {
      "text": "Course structure guidelines...",
      "source": "manual",
      "files": []
    }
  }
}
```

### Response Format
```json
{
  "suggestions": [
    "Semiconductor Manufacturing Fundamentals",
    "Industrial Semiconductor Processing",
    "Applied Semiconductor Technology"
  ],
  "fieldType": "courseTitle",
  "context": {...}
}
```

### Auto-Generation API

#### Course Info Generation
```json
{
  "generationType": "courseInfo",
  "courseContext": {
    "jobDescription": {
      "text": "Job description and knowledge standards...",
      "source": "manual"
    },
    "courseStructure": {
      "text": "Course structure guidelines...",
      "source": "manual"
    }
  }
}
```

#### Lesson Generation
```json
{
  "generationType": "lessons",
  "courseContext": {...},
  "courseData": {
    "title": "Course Title",
    "description": "Course Description",
    "industry": "Semiconductor Manufacturing",
    "skillLevel": "intermediate",
    "learningOutcomes": [...],
    "prerequisites": [...]
  }
}
```

#### Auto-Generation Response
```json
{
  "success": true,
  "data": {
    "title": "Generated Course Title",
    "description": "Generated description...",
    "industry": "Industry Category",
    "skillLevel": "beginner|intermediate|advanced",
    "estimatedDuration": "X hours/days/weeks",
    "learningOutcomes": ["outcome 1", "outcome 2", ...],
    "prerequisites": ["prerequisite 1", "prerequisite 2", ...]
  }
}
```

### Component Usage
```tsx
import { AiEnhancedInput } from '@/components/ui/ai-enhanced-input';
import CourseContextForm from '@/app/course-creator/create/CourseContextForm';

// Course Context Form
<CourseContextForm 
  contextData={courseContext}
  onUpdate={setCourseContext}
/>

// AI Enhanced Input with Course Context
<AiEnhancedInput
  label="Course Title"
  value={value}
  onChange={setValue}
  placeholder="Enter course title..."
  fieldType="courseTitle"
  context={{
    industry: "Semiconductor & Microelectronics",
    skillLevel: "intermediate"
  }}
  courseContext={courseContext}
  className="your-styles"
/>
```

## 🎨 UI Components

### AiEnhancedInput
The main component that wraps text inputs with AI functionality:

**Props:**
- `value`: Current text value
- `onChange`: Function to update text
- `fieldType`: Type of content being edited
- `context`: Additional context for AI suggestions
- `multiline`: Whether to use textarea (default: false)
- `placeholder`: Input placeholder text
- `className`: Additional CSS classes

### Suggestion Panel
- Appears below input when suggestions are available
- Shows up to 3 suggestions with accept/decline buttons
- Includes refresh button for new suggestions
- Dismissible with X button

## 🏭 Industry Context

### Supported Industries
- Semiconductor & Microelectronics
- Advanced Manufacturing
- Broadband & Fiber Optics
- Green Technology & Renewable Energy
- Data Centers
- Aerospace & Aviation Technologies
- Energy & Power Systems
- Industrial MEP

### Skill Levels
- **Entry Level**: No prior experience required
- **Intermediate**: Some experience recommended
- **Advanced**: Significant experience required

## 📊 Example Suggestions

### Course Title Examples
**Input**: "Semiconductor basics"
**Suggestions**:
- "Semiconductor Manufacturing Fundamentals"
- "Introduction to Semiconductor Technology"
- "Applied Semiconductor Engineering Principles"

### Learning Outcome Examples
**Input**: "Students will understand clean rooms"
**Suggestions**:
- "Apply proper clean room protocols in semiconductor manufacturing environments"
- "Demonstrate correct gowning procedures for contamination-free work areas"
- "Analyze environmental controls required for semiconductor fabrication"

## 🔧 Customization

### Adding New Field Types
1. Add new field type to the API prompts object
2. Update the component's fieldType prop type
3. Create appropriate context prompts for the new field

### Modifying AI Behavior
- Change model (currently GPT-4o) to GPT-4o-mini for cost savings or GPT-4-turbo for alternatives
- Adjust temperature (currently 0.7) for more/less creative suggestions
- Modify max_tokens (currently 300) for longer/shorter suggestions
- Update system prompts for different content styles

## 🐛 Troubleshooting

### Common Issues

**No Suggestions Appearing:**
- Check OpenAI API key configuration
- Ensure input field has some text before requesting suggestions
- Verify internet connection for API calls

**Poor Quality Suggestions:**
- Provide more context in related fields
- Use more descriptive initial text
- Try different wording for better AI understanding

**API Errors:**
- Check API key validity and billing status
- Verify network connectivity
- Review browser console for specific error messages

## 🚀 Future Enhancements

### Planned Features
- **Batch Suggestions**: Generate suggestions for multiple fields at once
- **Template Library**: Pre-built course structures with AI enhancement
- **Style Preferences**: Customize suggestion tone and approach
- **Multi-language Support**: Generate content in different languages
- **Advanced Context**: Integration with existing course databases

### Integration Opportunities
- **LMS Integration**: Direct publishing to learning management systems
- **Quality Scoring**: AI assessment of content quality and completeness
- **Accessibility Checking**: Automated accessibility compliance verification
- **Content Versioning**: Track changes and AI suggestion adoption

---

For more information or support, please refer to the main documentation or contact the development team. 