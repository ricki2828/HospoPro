import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
          404
        </h1>
        <p className="mt-2 text-lg font-medium text-gray-600">
          Page not found
        </p>
        <p className="mt-2 text-base text-gray-500">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <Home className="-ml-1 mr-2 h-5 w-5" />
            Go back home
          </Link>
        </div>
      </div>
    </div>
  );
}