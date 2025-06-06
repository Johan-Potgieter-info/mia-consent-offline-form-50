import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Globe, Shield, Clock } from 'lucide-react';
import ResumeDraftDialog from '../components/ResumeDraftDialog';

console.log("Index component loaded");

const Index = () => {
  console.log("Index component rendering");
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white">
      {/* Header */}
      <header className="bg-[#ef4805] text-white">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center space-x-4">
            <div className="bg-white p-2 rounded-lg">
              <img 
                src="https://emiyxuareujqneuyewzq.supabase.co/storage/v1/object/public/email-assets//logoWeb-ezgif.com-optiwebp.webp" 
                alt="Mia Healthcare Logo"
                className="h-8 w-auto"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Mia Healthcare</h1>
              <p className="text-orange-100">Digital Consent Form System</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Complete Your Dental Consent Form
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            A secure, offline-capable digital consent form system designed for Mia Healthcare patients. 
            Complete your form online or offline with automatic synchronization.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/consent-form"
              className="inline-flex items-center px-8 py-4 bg-[#ef4805] text-white font-semibold rounded-lg hover:bg-[#d63d04] transition-colors shadow-lg text-lg"
            >
              <FileText className="w-6 h-6 mr-3" />
              Start New Form
            </Link>
            <ResumeDraftDialog />
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100">
            <div className="bg-blue-100 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
              <Globe className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Online & Offline</h3>
            <p className="text-gray-600">
              Works seamlessly both online and offline. Your data is automatically synchronized when you're back online.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100">
            <div className="bg-green-100 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
              <Shield className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Secure & Private</h3>
            <p className="text-gray-600">
              Your medical information is encrypted and securely stored. We follow strict healthcare privacy standards.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100">
            <div className="bg-purple-100 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
              <Clock className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Save Progress</h3>
            <p className="text-gray-600">
              Your progress is automatically saved. You can close the form and resume where you left off anytime.
            </p>
          </div>
        </div>

        {/* Office Locations */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-8">
          <h3 className="text-2xl font-semibold text-gray-900 mb-6 text-center">Our Locations</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <h4 className="text-lg font-semibold text-[#ef4805] mb-2">Cape Town</h4>
              <p className="text-gray-600">Dr. Soni</p>
              <p className="text-sm text-gray-500">Practice Number: CPT001</p>
            </div>
            <div className="text-center">
              <h4 className="text-lg font-semibold text-[#ef4805] mb-2">Pretoria</h4>
              <p className="text-gray-600">Dr. Vorster</p>
              <p className="text-sm text-gray-500">Practice Number: PTA001</p>
            </div>
            <div className="text-center">
              <h4 className="text-lg font-semibold text-[#ef4805] mb-2">Johannesburg</h4>
              <p className="text-gray-600">Dr. Essop</p>
              <p className="text-sm text-gray-500">Practice Number: JHB001</p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-gray-50 rounded-xl p-8 border border-gray-100">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Ready to Begin?</h3>
            <p className="text-gray-600 mb-6">
              The form takes approximately 5-10 minutes to complete and can be saved at any time.
            </p>
            <Link
              to="/consent-form"
              className="inline-flex items-center px-6 py-3 bg-[#ef4805] text-white font-semibold rounded-lg hover:bg-[#d63d04] transition-colors"
            >
              Begin Consent Form
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-gray-400">
            © 2024 Mia Healthcare Services. All rights reserved.
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Secure digital healthcare solutions
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
