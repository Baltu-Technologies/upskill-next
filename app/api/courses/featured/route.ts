import { NextResponse } from 'next/server';

// This is where you would typically fetch from your database
// For now, we'll return mock data
const featuredCourses = [
  {
    id: '1',
    title: 'Web Development Fundamentals',
    description: 'Learn the basics of HTML, CSS, and JavaScript',
    imageUrl: 'https://picsum.photos/400/250?random=1',
    instructor: 'John Doe',
    duration: '8 weeks'
  },
  {
    id: '2',
    title: 'React Masterclass',
    description: 'Master React.js and build modern web applications',
    imageUrl: 'https://picsum.photos/400/250?random=2',
    instructor: 'Jane Smith',
    duration: '10 weeks'
  },
  {
    id: '3',
    title: 'Node.js Backend Development',
    description: 'Build scalable backend services with Node.js',
    imageUrl: 'https://picsum.photos/400/250?random=3',
    instructor: 'Mike Johnson',
    duration: '6 weeks'
  },
  {
    id: '4',
    title: 'Python for Data Science',
    description: 'Learn data analysis and machine learning with Python',
    imageUrl: 'https://picsum.photos/400/250?random=4',
    instructor: 'Sarah Wilson',
    duration: '12 weeks'
  },
  {
    id: '5',
    title: 'UI/UX Design Principles',
    description: 'Master the art of user interface and experience design',
    imageUrl: 'https://picsum.photos/400/250?random=5',
    instructor: 'Alex Brown',
    duration: '8 weeks'
  }
];

export async function GET() {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return NextResponse.json(featuredCourses);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch featured courses' },
      { status: 500 }
    );
  }
} 