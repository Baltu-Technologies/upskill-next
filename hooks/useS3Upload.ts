import { useState, useCallback } from 'react';

// Types for S3 operations
export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface S3UploadResponse {
  uploadUrl: string;
  key: string;
  expiresIn: number;
  tenantId: string;
  folder: string;
}

export interface S3FileMetadata {
  size: number;
  lastModified: Date;
  contentType: string;
  metadata: Record<string, string>;
}

export interface S3File {
  key: string;
  size: number;
  lastModified: Date;
  etag: string;
}

// Hook for file uploads
export function useS3Upload() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = useCallback(async (
    file: File,
    folder: string = 'uploads',
    onProgress?: (progress: UploadProgress) => void
  ): Promise<string | null> => {
    setIsUploading(true);
    setError(null);
    setUploadProgress(null);

    try {
      // Step 1: Get pre-signed URL
      const uploadUrlResponse = await fetch('/api/s3/upload-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`, // Adjust based on your auth setup
        },
        body: JSON.stringify({
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
          folder,
        }),
      });

      if (!uploadUrlResponse.ok) {
        const errorData = await uploadUrlResponse.json();
        throw new Error(errorData.error || 'Failed to get upload URL');
      }

      const uploadData: S3UploadResponse = await uploadUrlResponse.json();

      // Step 2: Upload to S3 using pre-signed URL
      const uploadResponse = await fetch(uploadData.uploadUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
        // Monitor upload progress
        ...(onProgress && {
          // Note: Progress monitoring requires additional setup with XMLHttpRequest
        }),
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload file to S3');
      }

      return uploadData.key;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed';
      setError(errorMessage);
      return null;
    } finally {
      setIsUploading(false);
      setUploadProgress(null);
    }
  }, []);

  const uploadWithProgress = useCallback(async (
    file: File,
    folder: string = 'uploads',
    onProgress?: (progress: UploadProgress) => void
  ): Promise<string | null> => {
    setIsUploading(true);
    setError(null);
    setUploadProgress(null);

    try {
      // Step 1: Get pre-signed URL
      const uploadUrlResponse = await fetch('/api/s3/upload-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
        body: JSON.stringify({
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
          folder,
        }),
      });

      if (!uploadUrlResponse.ok) {
        const errorData = await uploadUrlResponse.json();
        throw new Error(errorData.error || 'Failed to get upload URL');
      }

      const uploadData: S3UploadResponse = await uploadUrlResponse.json();

      // Step 2: Upload with progress using XMLHttpRequest
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const progress: UploadProgress = {
              loaded: event.loaded,
              total: event.total,
              percentage: Math.round((event.loaded / event.total) * 100),
            };
            setUploadProgress(progress);
            onProgress?.(progress);
          }
        });

        xhr.addEventListener('load', () => {
          if (xhr.status === 200) {
            resolve(uploadData.key);
          } else {
            reject(new Error('Failed to upload file to S3'));
          }
        });

        xhr.addEventListener('error', () => {
          reject(new Error('Network error during upload'));
        });

        xhr.open('PUT', uploadData.uploadUrl);
        xhr.setRequestHeader('Content-Type', file.type);
        xhr.send(file);
      });

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed';
      setError(errorMessage);
      return null;
    } finally {
      setIsUploading(false);
      setUploadProgress(null);
    }
  }, []);

  return {
    uploadFile,
    uploadWithProgress,
    isUploading,
    uploadProgress,
    error,
  };
}

// Hook for file management operations
export function useS3FileManager() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const listFiles = useCallback(async (
    folder?: string,
    maxKeys: number = 100
  ): Promise<S3File[] | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (folder) params.append('folder', folder);
      params.append('maxKeys', maxKeys.toString());

      const response = await fetch(`/api/s3/files?${params}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to list files');
      }

      const data = await response.json();
      return data.files;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to list files';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteFile = useCallback(async (key: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/s3/files', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
        body: JSON.stringify({ key }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete file');
      }

      return true;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete file';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getFileMetadata = useCallback(async (key: string): Promise<S3FileMetadata | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/s3/files', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
        body: JSON.stringify({ key }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get file metadata');
      }

      const data = await response.json();
      return data.metadata;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get file metadata';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getDownloadUrl = useCallback(async (
    key: string,
    expiresIn: number = 3600
  ): Promise<string | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/s3/download-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
        body: JSON.stringify({ key, expiresIn }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get download URL');
      }

      const data = await response.json();
      return data.downloadUrl;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get download URL';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    listFiles,
    deleteFile,
    getFileMetadata,
    getDownloadUrl,
    isLoading,
    error,
  };
} 