import { auth } from "@/auth";

export async function GET(request: Request) {
    try {
        console.log('Auth GET request:', request.url);
        return await auth.handler(request);
    } catch (error) {
        console.error('Auth GET error:', error);
        throw error;
    }
}

export async function POST(request: Request) {
    try {
        console.log('Auth POST request:', request.url);
        console.log('Request headers:', Object.fromEntries(request.headers.entries()));
        return await auth.handler(request);
    } catch (error) {
        console.error('Auth POST error:', error);
        console.error('Error details:', {
            message: (error as any)?.message,
            stack: (error as any)?.stack,
            name: (error as any)?.name
        });
        throw error;
    }
} 