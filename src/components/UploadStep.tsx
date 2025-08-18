import React, { useCallback } from 'react';
import { Upload, FileText, Download, Users } from 'lucide-react';

interface UploadStepProps {
  data: any;
  updateData: (data: any) => void;
}

const UploadStep: React.FC<UploadStepProps> = ({ data, updateData }) => {
  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Handle CSV parsing logic here
      console.log('File uploaded:', file.name);
    }
  }, []);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      // Handle dropped file
      console.log('File dropped:', files[0].name);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-4">Upload Recipients</h2>
        <p className="text-gray-300">Import your recipient list via CSV file or enter addresses manually</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* File Upload */}
        <div className="glass-card rounded-2xl p-8">
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
            <Upload className="w-6 h-6 mr-3 text-purple-400" />
            Upload CSV File
          </h3>

          <div
            className="border-2 border-dashed border-gray-600 rounded-xl p-8 text-center hover:border-purple-500 transition-colors"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-white font-medium mb-2">Drop your CSV file here</p>
            <p className="text-gray-400 text-sm mb-6">or click to browse</p>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
              id="csv-upload"
            />
            <label
              htmlFor="csv-upload"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl font-medium hover:shadow-lg transition-all cursor-pointer"
            >
              <Upload className="w-5 h-5 mr-2" />
              Select File
            </label>
          </div>

          <div className="mt-6">
            <button className="flex items-center text-purple-400 hover:text-purple-300 text-sm">
              <Download className="w-4 h-4 mr-2" />
              Download CSV Template
            </button>
          </div>
        </div>

        {/* Manual Entry */}
        <div className="glass-card rounded-2xl p-8">
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
            <Users className="w-6 h-6 mr-3 text-blue-400" />
            Manual Entry
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Recipients (one per line)
              </label>
              <textarea
                rows={8}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:bg-white/10 transition-all resize-none"
                placeholder="0x1234567890123456789012345678901234567890
0x2345678901234567890123456789012345678901
0x3456789012345678901234567890123456789012"
              />
            </div>

            <div className="text-sm text-gray-400">
              <p>Format: One Ethereum address per line</p>
              <p>Supports up to 10,000 addresses per distribution</p>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Summary */}
      <div className="glass-card rounded-2xl p-6 mt-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mr-4">
              <Users className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white">Recipients Loaded</h4>
              <p className="text-gray-300">0 addresses ready for distribution</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-white">0</div>
            <div className="text-sm text-gray-400">Total Recipients</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadStep;