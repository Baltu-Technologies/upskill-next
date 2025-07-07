import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, ListObjectsV2Command, HeadObjectCommand, CopyObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';

// S3 Configuration
export const s3Config = {
  region: process.env.AWS_REGION || 'us-east-1',
  bucket: process.env.S3_BUCKET_NAME || 'upskill-employer-portal',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  endpoint: process.env.S3_ENDPOINT, // Optional for custom endpoints
};

// Initialize S3 Client
export const s3Client = new S3Client({
  region: s3Config.region,
  credentials: {
    accessKeyId: s3Config.accessKeyId!,
    secretAccessKey: s3Config.secretAccessKey!,
  },
  endpoint: s3Config.endpoint,
});

// File types configuration
export const ALLOWED_FILE_TYPES = {
  images: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
  documents: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  videos: ['video/mp4', 'video/mpeg', 'video/quicktime', 'video/webm'],
  audio: ['audio/mpeg', 'audio/wav', 'audio/ogg'],
} as const;

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// Tenant-scoped path generation
export function getTenantPath(tenantId: string, filePath: string): string {
  // Remove leading slash if present
  const cleanPath = filePath.startsWith('/') ? filePath.slice(1) : filePath;
  return `${tenantId}/${cleanPath}`;
}

// Generate unique file name
export function generateUniqueFileName(originalName: string): string {
  const timestamp = Date.now();
  const uuid = uuidv4().slice(0, 8);
  const extension = originalName.split('.').pop();
  const nameWithoutExtension = originalName.split('.').slice(0, -1).join('.');
  
  return `${nameWithoutExtension}_${timestamp}_${uuid}.${extension}`;
}

// Validate file type
export function validateFileType(mimeType: string, allowedTypes: string[]): boolean {
  return allowedTypes.includes(mimeType);
}

// Generate pre-signed URL for uploads
export async function generatePresignedUploadUrl(
  tenantId: string,
  fileName: string,
  fileType: string,
  folder: string = 'uploads',
  expiresIn: number = 900 // 15 minutes
): Promise<{ url: string; key: string }> {
  const uniqueFileName = generateUniqueFileName(fileName);
  const key = getTenantPath(tenantId, `${folder}/${uniqueFileName}`);

  const command = new PutObjectCommand({
    Bucket: s3Config.bucket,
    Key: key,
    ContentType: fileType,
    ServerSideEncryption: 'AES256',
    Metadata: {
      'tenant-id': tenantId,
      'original-name': fileName,
      'upload-timestamp': new Date().toISOString(),
    },
  });

  const url = await getSignedUrl(s3Client, command, { expiresIn });
  
  return { url, key };
}

// Generate pre-signed URL for downloads
export async function generatePresignedDownloadUrl(
  tenantId: string,
  key: string,
  expiresIn: number = 3600 // 1 hour
): Promise<string> {
  // Validate that the key belongs to the tenant
  if (!key.startsWith(tenantId + '/')) {
    throw new Error('Access denied: File does not belong to tenant');
  }

  const command = new GetObjectCommand({
    Bucket: s3Config.bucket,
    Key: key,
  });

  return await getSignedUrl(s3Client, command, { expiresIn });
}

// Upload file directly (for server-side uploads)
export async function uploadFile(
  tenantId: string,
  fileName: string,
  fileBuffer: Buffer,
  fileType: string,
  folder: string = 'uploads'
): Promise<{ key: string; url: string }> {
  const uniqueFileName = generateUniqueFileName(fileName);
  const key = getTenantPath(tenantId, `${folder}/${uniqueFileName}`);

  const command = new PutObjectCommand({
    Bucket: s3Config.bucket,
    Key: key,
    Body: fileBuffer,
    ContentType: fileType,
    ServerSideEncryption: 'AES256',
    Metadata: {
      'tenant-id': tenantId,
      'original-name': fileName,
      'upload-timestamp': new Date().toISOString(),
    },
  });

  await s3Client.send(command);
  
  // Generate a download URL
  const url = await generatePresignedDownloadUrl(tenantId, key);
  
  return { key, url };
}

// Delete file
export async function deleteFile(tenantId: string, key: string): Promise<void> {
  // Validate that the key belongs to the tenant
  if (!key.startsWith(tenantId + '/')) {
    throw new Error('Access denied: File does not belong to tenant');
  }

  const command = new DeleteObjectCommand({
    Bucket: s3Config.bucket,
    Key: key,
  });

  await s3Client.send(command);
}

// List files for a tenant
export async function listTenantFiles(
  tenantId: string,
  folder?: string,
  maxKeys: number = 100
): Promise<Array<{
  key: string;
  size: number;
  lastModified: Date;
  etag: string;
}>> {
  const prefix = folder ? getTenantPath(tenantId, folder) : `${tenantId}/`;

  const command = new ListObjectsV2Command({
    Bucket: s3Config.bucket,
    Prefix: prefix,
    MaxKeys: maxKeys,
  });

  const response = await s3Client.send(command);
  
  return (response.Contents || []).map(item => ({
    key: item.Key!,
    size: item.Size!,
    lastModified: item.LastModified!,
    etag: item.ETag!,
  }));
}

// Get file metadata
export async function getFileMetadata(tenantId: string, key: string): Promise<{
  size: number;
  lastModified: Date;
  contentType: string;
  metadata: Record<string, string>;
}> {
  // Validate that the key belongs to the tenant
  if (!key.startsWith(tenantId + '/')) {
    throw new Error('Access denied: File does not belong to tenant');
  }

  const command = new HeadObjectCommand({
    Bucket: s3Config.bucket,
    Key: key,
  });

  const response = await s3Client.send(command);
  
  return {
    size: response.ContentLength!,
    lastModified: response.LastModified!,
    contentType: response.ContentType!,
    metadata: response.Metadata || {},
  };
}

// Copy file within tenant's space
export async function copyFile(
  tenantId: string,
  sourceKey: string,
  destinationKey: string
): Promise<void> {
  // Validate that both keys belong to the tenant
  if (!sourceKey.startsWith(tenantId + '/') || !destinationKey.startsWith(tenantId + '/')) {
    throw new Error('Access denied: Keys do not belong to tenant');
  }

  const command = new CopyObjectCommand({
    Bucket: s3Config.bucket,
    Key: destinationKey,
    CopySource: `${s3Config.bucket}/${sourceKey}`,
    ServerSideEncryption: 'AES256',
    Metadata: {
      'tenant-id': tenantId,
      'copy-timestamp': new Date().toISOString(),
    },
    MetadataDirective: 'REPLACE',
  });

  await s3Client.send(command);
}

// Utility function to extract tenant ID from Auth0 organization
export function getTenantIdFromAuth0Org(orgId: string): string {
  // Remove the 'org_' prefix if present
  return orgId.startsWith('org_') ? orgId.slice(4) : orgId;
}

// File organization patterns
export const FILE_FOLDERS = {
  uploads: 'uploads',
  companyLogos: 'company-logos',
  jobImages: 'job-images',
  userProfiles: 'user-profiles',
  documents: 'documents',
  reports: 'reports',
  temp: 'temp',
} as const;

export type FileFolder = typeof FILE_FOLDERS[keyof typeof FILE_FOLDERS];

// Environment validation
export function validateS3Config(): void {
  const required = ['AWS_REGION', 'S3_BUCKET_NAME', 'AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required S3 environment variables: ${missing.join(', ')}`);
  }
}

// Initialize S3 configuration (call this on app startup)
export function initializeS3(): void {
  validateS3Config();
  console.log('S3 configuration initialized successfully');
}

// Validate that a file key belongs to a specific tenant
export function validateTenantAccess(key: string, tenantId: string): boolean {
  const tenantPrefix = `${tenantId}/`;
  return key.startsWith(tenantPrefix);
} 