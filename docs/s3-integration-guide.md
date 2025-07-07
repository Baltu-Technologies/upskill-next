# AWS S3 Integration Guide

## Overview

This document provides a complete guide for the AWS S3 integration in the Upskill Employer Portal. The integration supports secure, multi-tenant file storage with proper access controls and efficient file management.

## Architecture

### Multi-Tenant Storage Strategy

The S3 integration uses a **single bucket with tenant-specific prefixes** approach:

```
s3://upskill-employer-portal/
├── ayHu5XNaTNHMasO5/           # Tenant ID (from Auth0 org)
│   ├── uploads/                 # General uploads
│   ├── company-logos/           # Company branding
│   ├── job-images/              # Job posting images
│   ├── user-profiles/           # User avatars
│   ├── documents/               # PDF documents
│   └── reports/                 # Generated reports
└── another-tenant-id/
    ├── uploads/
    └── ...
```

### Security Model

- **Tenant Isolation**: All file operations are scoped to the authenticated user's tenant
- **Pre-signed URLs**: No AWS credentials exposed to client-side code
- **Server-side Validation**: All tenant access is validated on the backend
- **Encryption**: SSE-S3 encryption enabled for all objects
- **Access Control**: JWT-based authentication with Auth0 integration

## Setup Instructions

### 1. AWS S3 Configuration

#### Create S3 Bucket

```bash
# Create bucket (replace with your bucket name)
aws s3 mb s3://upskill-employer-portal --region us-east-1

# Enable versioning (optional)
aws s3api put-bucket-versioning \
  --bucket upskill-employer-portal \
  --versioning-configuration Status=Enabled

# Enable encryption
aws s3api put-bucket-encryption \
  --bucket upskill-employer-portal \
  --server-side-encryption-configuration '{
    "Rules": [
      {
        "ApplyServerSideEncryptionByDefault": {
          "SSEAlgorithm": "AES256"
        }
      }
    ]
  }'
```

#### Configure CORS

```json
[
  {
    "AllowedOrigins": [
      "http://localhost:3000",
      "https://yourdomain.com"
    ],
    "AllowedMethods": ["GET", "PUT", "POST", "HEAD"],
    "AllowedHeaders": [
      "Authorization",
      "Content-Type",
      "x-amz-acl",
      "x-amz-server-side-encryption",
      "x-amz-meta-*"
    ],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3000
  }
]
```

Apply CORS configuration:

```bash
aws s3api put-bucket-cors \
  --bucket upskill-employer-portal \
  --cors-configuration file://cors.json
```

#### Create IAM User and Policy

1. **Create IAM User**:
   ```bash
   aws iam create-user --user-name upskill-s3-user
   ```

2. **Create Policy**:
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Action": [
           "s3:GetObject",
           "s3:PutObject",
           "s3:DeleteObject",
           "s3:ListBucket",
           "s3:GetObjectVersion",
           "s3:PutObjectAcl"
         ],
         "Resource": [
           "arn:aws:s3:::upskill-employer-portal",
           "arn:aws:s3:::upskill-employer-portal/*"
         ]
       }
     ]
   }
   ```

3. **Attach Policy**:
   ```bash
   aws iam put-user-policy \
     --user-name upskill-s3-user \
     --policy-name S3AccessPolicy \
     --policy-document file://s3-policy.json
   ```

4. **Create Access Keys**:
   ```bash
   aws iam create-access-key --user-name upskill-s3-user
   ```

### 2. Environment Variables

Add the following environment variables to your `.env.local` file:

```bash
# AWS S3 Configuration
AWS_REGION=us-east-1
S3_BUCKET_NAME=upskill-employer-portal
AWS_ACCESS_KEY_ID=your-access-key-id
AWS_SECRET_ACCESS_KEY=your-secret-access-key

# Optional: Custom S3 endpoint (for testing with LocalStack)
# S3_ENDPOINT=http://localhost:4566
```

### 3. Production Environment Setup

For production environments, use AWS IAM roles instead of access keys:

#### Using AWS IAM Roles (Recommended)

1. **Create IAM Role**:
   ```bash
   aws iam create-role \
     --role-name upskill-s3-role \
     --assume-role-policy-document file://trust-policy.json
   ```

2. **Attach Policy**:
   ```bash
   aws iam attach-role-policy \
     --role-name upskill-s3-role \
     --policy-arn arn:aws:iam::aws:policy/AmazonS3ReadOnlyAccess
   ```

3. **Use Role in ECS/Lambda**:
   ```json
   {
     "taskRoleArn": "arn:aws:iam::123456789012:role/upskill-s3-role"
   }
   ```

## API Endpoints

### 1. Upload URL Generation

**POST** `/api/s3/upload-url`

Generates a pre-signed URL for direct file uploads to S3.

**Request:**
```json
{
  "fileName": "company-logo.png",
  "fileType": "image/png",
  "fileSize": 25600,
  "folder": "company-logos"
}
```

**Response:**
```json
{
  "uploadUrl": "https://s3.amazonaws.com/...",
  "key": "ayHu5XNaTNHMasO5/company-logos/company-logo_1234567890_abc123.png",
  "expiresIn": 900,
  "tenantId": "ayHu5XNaTNHMasO5",
  "folder": "company-logos"
}
```

### 2. Download URL Generation

**POST** `/api/s3/download-url`

Generates a pre-signed URL for secure file downloads.

**Request:**
```json
{
  "key": "ayHu5XNaTNHMasO5/company-logos/company-logo_1234567890_abc123.png",
  "expiresIn": 3600
}
```

**Response:**
```json
{
  "downloadUrl": "https://s3.amazonaws.com/...",
  "key": "ayHu5XNaTNHMasO5/company-logos/company-logo_1234567890_abc123.png",
  "expiresIn": 3600,
  "tenantId": "ayHu5XNaTNHMasO5"
}
```

### 3. File Management

**GET** `/api/s3/files?folder=uploads&maxKeys=100`

Lists files for the authenticated user's tenant.

**DELETE** `/api/s3/files`

Deletes a file (tenant access validated).

**POST** `/api/s3/files`

Gets file metadata.

## Client-Side Usage

### React Hooks

The integration includes custom React hooks for easy client-side usage:

```tsx
import { useS3Upload, useS3FileManager } from '@/hooks/useS3Upload';

function MyComponent() {
  const { uploadFile, uploadWithProgress, isUploading, error } = useS3Upload();
  const { listFiles, deleteFile, getDownloadUrl } = useS3FileManager();

  const handleFileUpload = async (file: File) => {
    const key = await uploadWithProgress(file, 'company-logos', (progress) => {
      console.log(`Upload progress: ${progress.percentage}%`);
    });
    
    if (key) {
      console.log('File uploaded successfully:', key);
    }
  };

  // ... rest of component
}
```

### Upload with Progress

```tsx
const handleUpload = async (file: File) => {
  const key = await uploadWithProgress(
    file,
    'uploads',
    (progress) => {
      setUploadProgress(progress.percentage);
    }
  );
  
  if (key) {
    console.log('Upload successful:', key);
  }
};
```

### File Management

```tsx
const handleListFiles = async () => {
  const files = await listFiles('company-logos');
  setFileList(files);
};

const handleDeleteFile = async (key: string) => {
  const success = await deleteFile(key);
  if (success) {
    // Refresh file list
    await handleListFiles();
  }
};

const handleDownload = async (key: string) => {
  const url = await getDownloadUrl(key);
  if (url) {
    window.open(url, '_blank');
  }
};
```

## File Organization

### Folder Structure

- **uploads**: General file uploads
- **company-logos**: Company branding assets
- **job-images**: Job posting images
- **user-profiles**: User avatar images
- **documents**: PDF and document files
- **reports**: Generated analytics reports
- **temp**: Temporary files (auto-cleanup)

### File Naming Convention

Files are automatically renamed using the pattern:
```
{original-name}_{timestamp}_{uuid}.{extension}
```

Example: `company-logo_1640995200000_abc123.png`

## Security Considerations

### Authentication

- All API endpoints require valid JWT tokens
- Tenant ID is extracted from Auth0 organization claims
- No operations allowed without proper authentication

### Access Control

- Files are strictly scoped to the authenticated user's tenant
- Pre-signed URLs are generated server-side only
- No AWS credentials exposed to client-side code
- Tenant validation on all file operations

### File Validation

- File type validation based on folder
- File size limits enforced (default 10MB)
- Malicious file detection (future enhancement)

### Encryption

- Server-side encryption (SSE-S3) for all objects
- Metadata includes tenant ID and upload timestamp
- Audit trail for all file operations

## Performance Optimization

### Caching

- CloudFront distribution for static assets (recommended)
- Browser caching for frequently accessed files
- Pre-signed URL caching (with expiration)

### Lifecycle Management

Set up S3 lifecycle rules for cost optimization:

```json
{
  "Rules": [
    {
      "Id": "TempFileCleanup",
      "Status": "Enabled",
      "Filter": {
        "Prefix": "temp/"
      },
      "Expiration": {
        "Days": 1
      }
    },
    {
      "Id": "OldVersionCleanup",
      "Status": "Enabled",
      "NoncurrentVersionExpiration": {
        "NoncurrentDays": 30
      }
    }
  ]
}
```

## Monitoring and Logging

### CloudWatch Metrics

Monitor these key metrics:
- Upload success/failure rates
- File access patterns
- Storage usage per tenant
- API response times

### Application Logging

All S3 operations are logged with:
- Tenant ID
- Operation type
- File key
- Success/failure status
- Error details

## Testing

### Test Page

Visit `/s3-test` to test the S3 integration:
- File upload with progress tracking
- File listing and management
- Download URL generation
- Error handling

### Unit Tests

```bash
# Run S3 integration tests
npm test -- --testPathPattern=s3

# Run with coverage
npm test -- --coverage --testPathPattern=s3
```

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Verify CORS configuration on S3 bucket
   - Check allowed origins include your domain
   - Ensure proper headers are allowed

2. **Permission Denied**
   - Verify IAM user/role has correct permissions
   - Check AWS credentials are properly configured
   - Validate bucket name and region

3. **Upload Failures**
   - Check file size limits
   - Verify file type is allowed
   - Confirm pre-signed URL hasn't expired

4. **Tenant Access Issues**
   - Verify JWT token contains organization claim
   - Check tenant ID extraction logic
   - Ensure file keys have correct tenant prefix

### Debug Mode

Enable debug logging:

```bash
DEBUG=s3:* npm run dev
```

## Future Enhancements

- [ ] Image resizing and optimization
- [ ] Virus scanning integration
- [ ] CloudFront distribution setup
- [ ] Advanced analytics and reporting
- [ ] Backup and disaster recovery
- [ ] Multi-region replication

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review application logs
3. Verify AWS and Auth0 configuration
4. Contact development team 