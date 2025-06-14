
import { Printer, FileText, Clock, CheckCircle } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="pt-20 pb-12 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
          <Printer className="w-4 h-4" />
          Professional Print Services
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
          Fast, Reliable <span className="text-blue-600">Print Solutions</span>
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Upload your documents, choose your services, and get professional printing done quickly and efficiently.
        </p>
        
        <div className="grid sm:grid-cols-3 gap-6 max-w-2xl mx-auto text-center">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Upload Files</h3>
            <p className="text-sm text-gray-600">PDF, Word, Images (Max 20MB)</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Choose Services</h3>
            <p className="text-sm text-gray-600">Select what you need</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
              <CheckCircle className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Get Printed</h3>
            <p className="text-sm text-gray-600">High-quality results</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
