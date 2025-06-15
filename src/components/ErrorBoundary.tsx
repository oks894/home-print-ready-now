
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ errorInfo });
    
    // Log additional context for debugging
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      userAgent: navigator.userAgent,
      url: window.location.href
    });
  }

  handleRefresh = () => {
    // Clear the error state first
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
    // Then reload the page
    setTimeout(() => window.location.reload(), 100);
  };

  handleGoHome = () => {
    // Clear the error state first
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
    // Navigate to home
    setTimeout(() => window.location.href = '/', 100);
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-gradient-to-b from-red-50 to-white flex items-center justify-center p-4">
          <div className="text-center max-w-md w-full">
            <div className="mb-6">
              <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Something went wrong
              </h2>
              <p className="text-gray-600 mb-4 text-sm">
                The app encountered an unexpected error. This might be due to a connection issue or temporary problem.
              </p>
              {this.state.error && (
                <details className="text-xs text-gray-500 mb-4 text-left bg-gray-100 p-3 rounded">
                  <summary className="cursor-pointer font-medium">Error details</summary>
                  <div className="mt-2 font-mono break-all">
                    {this.state.error.message}
                  </div>
                </details>
              )}
            </div>
            
            <div className="space-y-3">
              <button
                onClick={this.handleRefresh}
                className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh Page
              </button>
              
              <button
                onClick={this.handleGoHome}
                className="w-full inline-flex items-center justify-center gap-2 bg-gray-500 text-white px-4 py-3 rounded-lg hover:bg-gray-600 transition-colors font-medium"
              >
                <Home className="w-4 h-4" />
                Go to Home
              </button>
            </div>
            
            <p className="text-xs text-gray-400 mt-4">
              If this problem persists, please contact support
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
