import Link from 'next/link';
import { AlertCircle } from 'lucide-react';

export default function OrganizationNotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="max-w-md w-full mx-auto p-6">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Organization Not Found
          </h1>
          <p className="text-muted-foreground mb-6">
            The organization you're trying to access doesn't exist or has been deactivated.
          </p>
          <p className="text-sm text-muted-foreground mb-8">
            Please check the URL and try again, or contact your administrator.
          </p>
          
          <div className="space-y-4">
            <Link
              href="/"
              className="inline-flex items-center justify-center w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Return to Main Platform
            </Link>
            
            <div className="text-xs text-muted-foreground">
              <p>Need help? Contact support at:</p>
              <a 
                href="mailto:support@baltutech.com" 
                className="text-primary hover:underline"
              >
                support@baltutech.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 