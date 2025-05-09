import { NextResponse } from 'next/server';

// Fallback static data in case API fails
const fallbackCourses = [
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

// Function to fetch courses from the API
async function fetchCoursesFromAPI() {
  try {
    const response = await fetch('https://upskill.baltutech.com/wp-json/ldlms/v2/sfwd-courses', {
      headers: {
        'Authorization': 'Basic ' + Buffer.from('ariasorozcojoseluis3@gmail.com:P6Ug C3km Hjyj 3q3c aa10 5zh3').toString('base64')
      }
    });

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();
    
    // Transform the API response to match our expected format
    return data.map((course: any) => ({
      id: course.id.toString(),
      title: course.title.rendered || course.title,
      description: course.excerpt?.rendered || course.description || 'No description available',
      imageUrl: course.featured_media ? 
        `https://upskill.baltutech.com/wp-json/wp/v2/media/${course.featured_media}` : 
        'https://picsum.photos/400/250?random=' + course.id,
      instructor: course.author_name || 'Unknown Instructor',
      duration: course.duration || 'Duration not specified'
    }));
  } catch (error) {
    console.error('Error fetching courses from API:', error);
    return null;
  }
}

export async function GET() {
  try {
    // Try to fetch from API first
    const apiCourses = await fetchCoursesFromAPI();
    
    // If API fetch fails, use fallback data
    const courses = apiCourses || fallbackCourses;
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return NextResponse.json(courses);
  } catch (error) {
    console.error('Error in GET handler:', error);
    // Return fallback data if everything fails
    return NextResponse.json(fallbackCourses);
  }
} 