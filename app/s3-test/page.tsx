'use client';

import { useState, useRef, useEffect } from 'react';
import { useS3Upload, useS3FileManager, S3File, UploadProgress } from '@/hooks/useS3Upload';

export default function S3TestPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFolder, setSelectedFolder] = useState<string>('uploads');
  const [files, setFiles] = useState<S3File[]>([]);
  const [uploadStatus, setUploadStatus] = useState<string>('');
  const [downloadUrl, setDownloadUrl] = useState<string>('');

  // S3 hooks
  const { uploadFile, uploadWithProgress, isUploading, uploadProgress, error: uploadError } = useS3Upload();
  const { listFiles, deleteFile, getDownloadUrl, isLoading, error: managerError } = useS3FileManager();

  // File input handler
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUploadStatus('');
      setDownloadUrl('');
    }
  };

  // Upload file handler
  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploadStatus('Uploading...');
    const key = await uploadWithProgress(
      selectedFile,
      selectedFolder,
      (progress: UploadProgress) => {
        setUploadStatus(`Uploading... ${progress.percentage}%`);
      }
    );

    if (key) {
      setUploadStatus(`Upload successful! Key: ${key}`);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      await loadFiles(); // Refresh file list
    } else {
      setUploadStatus('Upload failed');
    }
  };

  // Load files from S3
  const loadFiles = async () => {
    const fileList = await listFiles(selectedFolder === 'all' ? undefined : selectedFolder);
    if (fileList) {
      setFiles(fileList);
    }
  };

  // Delete file handler
  const handleDelete = async (key: string) => {
    if (confirm('Are you sure you want to delete this file?')) {
      const success = await deleteFile(key);
      if (success) {
        await loadFiles(); // Refresh file list
      }
    }
  };

  // Get download URL handler
  const handleGetDownloadUrl = async (key: string) => {
    const url = await getDownloadUrl(key);
    if (url) {
      setDownloadUrl(url);
    }
  };

  // Download file handler
  const handleDownload = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Load files on component mount and folder change
  useEffect(() => {
    loadFiles();
  }, [selectedFolder]);

  const folders = [
    { value: 'all', label: 'All Files' },
    { value: 'uploads', label: 'Uploads' },
    { value: 'company-logos', label: 'Company Logos' },
    { value: 'job-images', label: 'Job Images' },
    { value: 'user-profiles', label: 'User Profiles' },
    { value: 'documents', label: 'Documents' },
    { value: 'reports', label: 'Reports' },
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">S3 Integration Test</h1>
        <p className="text-gray-600 mb-6">
          Test AWS S3 integration with file upload, management, and download functionality.
        </p>

        {/* File Upload Section */}
        <div className="border-b pb-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">File Upload</h2>
          
          <div className="space-y-4">
            {/* Folder Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Folder
              </label>
              <select
                value={selectedFolder}
                onChange={(e) => setSelectedFolder(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 w-full max-w-xs"
              >
                {folders.filter(f => f.value !== 'all').map(folder => (
                  <option key={folder.value} value={folder.value}>
                    {folder.label}
                  </option>
                ))}
              </select>
            </div>

            {/* File Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select File
              </label>
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileSelect}
                className="border border-gray-300 rounded-md px-3 py-2 w-full"
                accept="image/*,application/pdf,.doc,.docx"
              />
            </div>

            {/* Selected File Info */}
            {selectedFile && (
              <div className="bg-gray-50 p-4 rounded-md">
                <p><strong>Name:</strong> {selectedFile.name}</p>
                <p><strong>Type:</strong> {selectedFile.type}</p>
                <p><strong>Size:</strong> {(selectedFile.size / 1024).toFixed(2)} KB</p>
                <p><strong>Target Folder:</strong> {selectedFolder}</p>
              </div>
            )}

            {/* Upload Button */}
            <button
              onClick={handleUpload}
              disabled={!selectedFile || isUploading}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {isUploading ? 'Uploading...' : 'Upload File'}
            </button>

            {/* Upload Progress */}
            {uploadProgress && (
              <div className="bg-blue-50 p-4 rounded-md">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-blue-700">Upload Progress</span>
                  <span className="text-sm text-blue-600">{uploadProgress.percentage}%</span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress.percentage}%` }}
                  />
                </div>
              </div>
            )}

            {/* Status Messages */}
            {uploadStatus && (
              <div className={`p-4 rounded-md ${
                uploadStatus.includes('successful') ? 'bg-green-50 text-green-800' : 
                uploadStatus.includes('failed') ? 'bg-red-50 text-red-800' : 
                'bg-blue-50 text-blue-800'
              }`}>
                {uploadStatus}
              </div>
            )}

            {/* Upload Error */}
            {uploadError && (
              <div className="bg-red-50 p-4 rounded-md">
                <p className="text-red-800 font-medium">Upload Error:</p>
                <p className="text-red-700">{uploadError}</p>
              </div>
            )}
          </div>
        </div>

        {/* File Management Section */}
        <div>
          <h2 className="text-xl font-semibold mb-4">File Management</h2>
          
          <div className="space-y-4">
            {/* Folder Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                View Files From
              </label>
              <select
                value={selectedFolder}
                onChange={(e) => setSelectedFolder(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 w-full max-w-xs"
              >
                {folders.map(folder => (
                  <option key={folder.value} value={folder.value}>
                    {folder.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Refresh Button */}
            <button
              onClick={loadFiles}
              disabled={isLoading}
              className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 disabled:bg-gray-300"
            >
              {isLoading ? 'Loading...' : 'Refresh Files'}
            </button>

            {/* Files List */}
            {files.length > 0 ? (
              <div className="bg-gray-50 rounded-md overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        File Key
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Size
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Modified
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {files.map((file) => (
                      <tr key={file.key}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                          {file.key}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {(file.size / 1024).toFixed(2)} KB
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(file.lastModified).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                          <button
                            onClick={() => handleGetDownloadUrl(file.key)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            Get URL
                          </button>
                          <button
                            onClick={() => handleDelete(file.key)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-gray-500 text-center py-8">
                {isLoading ? 'Loading files...' : 'No files found'}
              </div>
            )}

            {/* Manager Error */}
            {managerError && (
              <div className="bg-red-50 p-4 rounded-md">
                <p className="text-red-800 font-medium">File Manager Error:</p>
                <p className="text-red-700">{managerError}</p>
              </div>
            )}
          </div>
        </div>

        {/* Download URL Section */}
        {downloadUrl && (
          <div className="mt-6 border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">Download URL Generated</h3>
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="text-sm text-gray-700 mb-2">URL (expires in 1 hour):</p>
              <p className="text-xs font-mono bg-white p-2 rounded border break-all">
                {downloadUrl}
              </p>
              <div className="mt-4 space-x-2">
                <button
                  onClick={() => window.open(downloadUrl, '_blank')}
                  className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                >
                  Open in New Tab
                </button>
                <button
                  onClick={() => navigator.clipboard.writeText(downloadUrl)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                >
                  Copy URL
                </button>
                <button
                  onClick={() => setDownloadUrl('')}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 