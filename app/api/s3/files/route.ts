import { NextRequest, NextResponse } from 'next/server';
import { 
  listTenantFiles,
  deleteFile, 
  getFileMetadata,
  getTenantIdFromAuth0Org,
  validateTenantAccess
} from '@/lib/storage/s3';
import { getUserClaims } from '@/lib/auth/middleware';

// GET - List files for the tenant
export async function GET(request: NextRequest) {
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

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const folder = searchParams.get('folder') || undefined;
    const maxKeys = parseInt(searchParams.get('maxKeys') || '100');

    // List files
    const files = await listTenantFiles(tenantId, folder, maxKeys);

    return NextResponse.json({
      files,
      tenantId,
      folder,
      count: files.length
    });

  } catch (error) {
    console.error('Error listing files:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a file
export async function DELETE(request: NextRequest) {
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
    const { key } = body;

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

    // Delete file
    await deleteFile(tenantId, key);

    return NextResponse.json({
      success: true,
      message: 'File deleted successfully',
      key,
      tenantId
    });

  } catch (error) {
    console.error('Error deleting file:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Get file metadata
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
    const { key } = body;

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

    // Get file metadata
    const metadata = await getFileMetadata(tenantId, key);

    return NextResponse.json({
      key,
      tenantId,
      metadata
    });

  } catch (error) {
    console.error('Error getting file metadata:', error);
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
      'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
} 