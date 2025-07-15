import { NextRequest, NextResponse } from 'next/server';
import { auth } from '../../../../auth';

export async function GET(request: NextRequest) {
  console.log('🔍 Session endpoint called - redirecting to Better Auth handler');
  
  try {
    // Use the Better Auth handler directly
    const response = await auth.handler(request);
    console.log('✅ Better Auth handler response:', response.status);
    return response;
  } catch (error) {
    console.error('❌ Session endpoint error:', error);
    return NextResponse.json({ error: 'Session retrieval failed' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  console.log('🔍 Session POST endpoint called - redirecting to Better Auth handler');
  
  try {
    // Use the Better Auth handler directly
    const response = await auth.handler(request);
    console.log('✅ Better Auth handler response:', response.status);
    return response;
  } catch (error) {
    console.error('❌ Session POST endpoint error:', error);
    return NextResponse.json({ error: 'Session operation failed' }, { status: 500 });
  }
} 