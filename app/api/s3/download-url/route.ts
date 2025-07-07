import { NextRequest, NextResponse } from 'next/server';
import { 
  generatePresignedDownloadUrl, 
  getTenantIdFromAuth0Org,
  validateTenantAccess
} from '@/lib/storage/s3';
import { getUserClaims } from '@/lib/auth/middleware';

export async function POST(request: NextRequest) {
  try {
    // Validate JWT and extract claims
    const claims = await getUserClaims(request);
    
    if (!claims) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Extract tenant ID from Auth0 organization
    const orgId = claims['https://employer-portal.upskill.com/organization'];
    if (!orgId) {
      return NextResponse.json(
        { error: 'No organization found in user token' },
        { status: 400 }
      );
    }

    const tenantId = getTenantIdFromAuth0Org(orgId);

    // Parse request body
    const body = await request.json();
    const { key, expiresIn = 3600 } = body; // Default 1 hour expiry

    // Validate required fields
    if (!key) {
      return NextResponse.json(
        { error: 'File key is required' },
        { status: 400 }
      );
    }

    // Validate that the file key belongs to the user's tenant
    if (!validateTenantAccess(key, tenantId)) {
      return NextResponse.json(
        { error: 'Access denied to this file' },
        { status: 403 }
      );
    }

    // Generate pre-signed URL
    const url = await generatePresignedDownloadUrl(tenantId, key, expiresIn);

    return NextResponse.json({
      downloadUrl: url,
      key,
      expiresIn,
      tenantId
    });

  } catch (error) {
    console.error('Error generating download URL:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// OPTIONS handler for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
} 