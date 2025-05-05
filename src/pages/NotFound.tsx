
import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
        <p className="text-xl text-muted-foreground mb-8">The page you are looking for does not exist.</p>
        <Link to="/" className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors">
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
