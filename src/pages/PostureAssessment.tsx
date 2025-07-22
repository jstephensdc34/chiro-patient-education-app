
import { Navbar } from "@/components/layout/Navbar";

const PostureAssessment = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Navbar />
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center space-y-8 text-center">
          <div className="space-y-3">
            <h1 className="text-4xl font-bold tracking-tight text-medical-800 sm:text-5xl">
              Posture Assessment
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Comprehensive posture analysis and reporting tool coming soon.
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200 w-full max-w-4xl">
            <h2 className="text-2xl font-semibold text-medical-700 mb-4">Features Coming Soon</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div className="flex items-start">
                <div className="flex-shrink-0 bg-green-100 p-2 rounded-full">
                  <svg className="h-5 w-5 text-green-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-md font-medium text-gray-800">Digital Posture Analysis</h3>
                  <p className="text-sm text-gray-600">Advanced digital assessment tools</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 bg-green-100 p-2 rounded-full">
                  <svg className="h-5 w-5 text-green-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-md font-medium text-gray-800">Photo Analysis</h3>
                  <p className="text-sm text-gray-600">Upload and analyze posture photos</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 bg-green-100 p-2 rounded-full">
                  <svg className="h-5 w-5 text-green-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-md font-medium text-gray-800">Detailed Reports</h3>
                  <p className="text-sm text-gray-600">Generate comprehensive posture reports</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 bg-green-100 p-2 rounded-full">
                  <svg className="h-5 w-5 text-green-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-md font-medium text-gray-800">Treatment Recommendations</h3>
                  <p className="text-sm text-gray-600">Customized corrective exercise plans</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostureAssessment;
