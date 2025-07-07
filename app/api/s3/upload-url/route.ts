import { NextRequest, NextResponse } from 'next/server';
import { 
  generatePresignedUploadUrl, 
  validateFileType, 
  ALLOWED_FILE_TYPES, 
  MAX_FILE_SIZE,
  FILE_FOLDERS,
  type FileFolder,
  getTenantIdFromAuth0Org
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
    const { fileName, fileType, fileSize, folder = 'uploads' } = body;

    // Validate required fields
    if (!fileName || !fileType) {
      return NextResponse.json(
        { error: 'fileName and fileType are required' },
        { status: 400 }
      );
    }

    // Validate file size
    if (fileSize && fileSize > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File size exceeds maximum allowed size of ${MAX_FILE_SIZE / (1024 * 1024)}MB` },
        { status: 400 }
      );
    }

    // Validate file type based on folder
    let allowedTypes: string[] = [];
    
    switch (folder) {
      case FILE_FOLDERS.companyLogos:
      case FILE_FOLDERS.jobImages:
      case FILE_FOLDERS.userProfiles:
        allowedTypes = [...ALLOWED_FILE_TYPES.images];
        break;
      case FILE_FOLDERS.documents:
        allowedTypes = [...ALLOWED_FILE_TYPES.documents];
        break;
      case FILE_FOLDERS.uploads:
        allowedTypes = [
          ...ALLOWED_FILE_TYPES.images,
          ...ALLOWED_FILE_TYPES.documents,
          ...ALLOWED_FILE_TYPES.videos,
          ...ALLOWED_FILE_TYPES.audio
        ];
        break;
      default:
        allowedTypes = [...ALLOWED_FILE_TYPES.images];
    }

    if (!validateFileType(fileType, allowedTypes)) {
      return NextResponse.json(
        { error: `File type ${fileType} is not allowed for folder ${folder}` },
        { status: 400 }
      );
    }

    // Validate folder
    if (!Object.values(FILE_FOLDERS).includes(folder as FileFolder)) {
      return NextResponse.json(
        { error: 'Invalid folder specified' },
        { status: 400 }
      );
    }

    // Generate pre-signed URL
    const { url, key } = await generatePresignedUploadUrl(
      tenantId,
      fileName,
      fileType,
      folder
    );

    return NextResponse.json({
      uploadUrl: url,
      key,
      expiresIn: 900, // 15 minutes
      tenantId,
      folder
    });

  } catch (error) {
    console.error('Error generating upload URL:', error);
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