import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, Image } from 'lucide-react';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
  acceptedTypes: string[];
  title: string;
  description: string;
}

export function FileUpload({ onFileUpload, acceptedTypes, title, description }: FileUploadProps) {
  const [isDragActive, setIsDragActive] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileUpload(acceptedFiles[0]);
    }
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragAccept, isDragReject } = useDropzone({
    onDrop,
    accept: acceptedTypes.reduce((acc, type) => ({ ...acc, [type]: [] }), {}),
    multiple: false,
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
  });

  return (
    <div
      {...getRootProps()}
      className={`p-8 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-300 transform
        ${isDragActive ? 'scale-105 border-blue-500 bg-blue-50' : 'hover:scale-102 border-gray-300 hover:border-blue-400'}
        ${isDragAccept ? 'border-green-500 bg-green-50' : ''}
        ${isDragReject ? 'border-red-500 bg-red-50' : ''}`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center text-center">
        <div className="relative">
          {acceptedTypes.includes('image/*') ? (
            <Image className="w-16 h-16 text-blue-500 transition-transform hover:scale-110" />
          ) : (
            <File className="w-16 h-16 text-blue-500 transition-transform hover:scale-110" />
          )}
          <Upload className="w-6 h-6 text-green-500 absolute -right-2 -bottom-2 animate-bounce" />
        </div>
        <h3 className="text-xl font-semibold mt-4 mb-2">{title}</h3>
        <p className="text-gray-500">{description}</p>
        <div className="mt-4 text-sm text-gray-400">
          {acceptedTypes.map((type, index) => (
            <span key={type} className="inline-block px-2 py-1 bg-gray-100 rounded-full mx-1">
              {type.replace('*', 'files')}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}