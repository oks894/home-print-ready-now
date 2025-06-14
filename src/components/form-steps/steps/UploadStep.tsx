
import React from 'react';
import { motion } from 'framer-motion';
import { FileText, CheckCircle } from 'lucide-react';
import FileUpload from '../../FileUpload';

interface UploadStepProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
}

const UploadStep = ({ files, onFilesChange }: UploadStepProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center"
        >
          <FileText className="w-10 h-10 text-white" />
        </motion.div>
        <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
          Upload Your Documents
        </h3>
        <p className="text-gray-600 max-w-md mx-auto">
          Drag and drop your files or click to browse. We support PDF, DOC, DOCX, and image formats.
        </p>
      </div>
      
      <FileUpload 
        files={files} 
        onFilesChange={onFilesChange}
      />
      
      {files.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-50 p-4 rounded-lg"
        >
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="font-medium text-blue-900">
              {files.length} file{files.length > 1 ? 's' : ''} ready for printing
            </span>
          </div>
          <p className="text-sm text-blue-700">
            Total size: {(files.reduce((sum, file) => sum + file.size, 0) / 1024 / 1024).toFixed(2)} MB
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default UploadStep;
