# 🗄️ DynamoDB Profile System Setup Guide

This guide will help you set up and use the DynamoDB backend for your profile system using AWS Amplify Gen 2.

## 📋 Overview

Your profile system now has a complete DynamoDB backend with:

- **13 interconnected tables** for comprehensive profile data
- **Core Profile Data** (shared with employers): Candidate, Education, Skills, Projects, Work History, References
- **Optional Data** (private): Compensation, Transportation, Learning Profile, EEO Data
- **System Metrics** (auto-calculated): XP, levels, streaks, completion tracking
- **Full CRUD operations** with type-safe APIs
- **Real-time data synchronization** using Amplify

## 🚀 Quick Start

### 1. Start the Amplify Sandbox

```bash
npm run db:sandbox
```

This will:
- Deploy your DynamoDB tables to AWS
- Set up authentication
- Generate the data client
- Provide a local development environment

### 2. Seed the Database

Once the sandbox is running, populate it with Peter Costa's profile data:

```bash
npm run db:seed
```

This will create:
- ✅ Complete candidate profile
- ✅ 2 Education entries
- ✅ 4 Formal skills & 4 Informal skills
- ✅ 3 Projects
- ✅ 3 Work history entries
- ✅ 3 References
- ✅ Compensation preferences
- ✅ Transportation logistics
- ✅ System metrics

### 3. Start Your App

```bash
npm run dev
```

Your profile page at `/profile` will now load data from DynamoDB!

## 📊 Database Schema

### Core Tables (Shared with Employers)

| Table | Purpose | Key Fields |
|-------|---------|------------|
| **Candidate** | Main profile | firstName, lastName, email, headline, location |
| **Education** | Degrees & certificates | degree, institution, gpa, honors |
| **FormalSkill** | Verified skills | name, type, proficiency, issuingOrganization |
| **InformalSkill** | Self-reported skills | skillName, category, selfRating |
| **Project** | Portfolio projects | title, roleAndTools, description, mediaUrl |
| **WorkHistory** | Employment history | companyName, roleTitle, responsibilities |
| **Reference** | Professional references | name, relationship, contactInfo |
| **SystemMetrics** | Calculated scores | aptitudeScore, totalXP, currentLevel |

### Optional Tables (Private)

| Table | Purpose | Key Fields |
|-------|---------|------------|
| **CompensationPreferences** | Salary expectations | desiredSalaryMin/Max, employmentType |
| **LanguageSkill** | Language abilities | language, proficiency, isNative |
| **TransportationLogistics** | Work logistics | hasVehicle, commuteRadius, workMode |
| **LearningProfile** | Learning preferences | preferredFormats, learningStyle, pace |
| **EEOData** | Demographics (optional) | veteranStatus, disabilityStatus, race |

## 🔧 Usage Examples

### Frontend Integration

Your profile page now uses the `useProfileData()` hook:

```typescript
import { useProfileData } from '@/lib/data/profileService';

function ProfilePage() {
  const { profile, loading, error, updateProfile } = useProfileData();
  
  if (loading) return <div>Loading profile...</div>;
  if (error) return <div>Error: {error}</div>;
  
  // Use real database data
  return <div>{profile?.firstName} {profile?.lastName}</div>;
}
```

### Direct API Usage

```typescript
import { ProfileService } from '@/lib/data/profileService';

// Add a new skill
const result = await ProfileService.addFormalSkill(candidateId, {
  name: 'Docker Containerization',
  type: 'Course',
  proficiency: 'Intermediate',
  issuingOrganization: 'Docker Inc.'
});

// Update basic info
await ProfileService.updateCandidate(candidateId, {
  headline: 'Updated professional headline'
});

// Get employer-shared profile only
const employerData = await ProfileService.getEmployerProfile(candidateId);
```

## 🔒 Data Privacy & Security

### Authorization Model

- **Owner-based access**: Users can only access their own data
- **Automatic filtering**: Amplify enforces data isolation
- **Employer vs Private data**: Clear separation between shared and private information

### Data Sharing Levels

1. **Core Profile (Shared)**: Education, skills, projects, work history
2. **Optional Data (Private)**: Compensation, EEO data, learning preferences
3. **System Metrics (Calculated)**: XP, levels, completion scores

## 📈 Profile Completion Tracking

The system automatically calculates completion percentages:

```typescript
const completion = ProfileService.calculateProfileCompletion(profile);

console.log(completion.coreProgress);     // 95% - employer-shared data
console.log(completion.optionalProgress); // 30% - private enhancement data
console.log(completion.overallProgress);  // 70% - weighted average
```

## 🛠️ Development Commands

| Command | Purpose |
|---------|---------|
| `npm run db:sandbox` | Start Amplify development environment |
| `npm run db:seed` | Populate database with sample data |
| `npm run db:generate` | Generate updated client types |
| `npm run dev` | Start Next.js with database integration |

## 🔄 Data Migration

### From Mock to Real Data

Your existing mock data (`mockProfileData.ts`) has been converted to the database seeder. The profile page will automatically switch from mock data to real database data once you run the seeder.

### Updating Schema

1. Modify `amplify/data/resource.ts`
2. Run `npm run db:sandbox` to deploy changes
3. Update your TypeScript types as needed

## 🚨 Troubleshooting

### Common Issues

**❌ "Module not found" errors**
- Ensure Amplify sandbox is running
- Check that `amplify_outputs.json` exists

**❌ Authentication errors**
- Verify you're signed in to your Amplify app
- Check AWS credentials configuration

**❌ Data not appearing**
- Run the database seeder: `npm run db:seed`
- Check browser console for API errors

### Getting Help

- Check the Amplify sandbox logs in terminal
- Verify your AWS account has proper permissions
- Ensure all required dependencies are installed

## 🎯 Next Steps

1. **Authentication**: Add user signup/login flows
2. **File Uploads**: Add S3 integration for resumes and project images
3. **Search**: Implement employer search and filtering
4. **Analytics**: Track profile views and application rates
5. **Notifications**: Add real-time updates for profile changes

## 📚 Resources

- [AWS Amplify Gen 2 Documentation](https://docs.amplify.aws/)
- [DynamoDB Best Practices](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/best-practices.html)
- [Amplify Data Modeling](https://docs.amplify.aws/gen2/build-a-backend/data/)

---

Your profile system is now backed by a robust, scalable DynamoDB infrastructure! 🎉 