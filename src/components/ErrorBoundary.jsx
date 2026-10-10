import React from 'react';

/**
 * Global ErrorBoundary to protect against uncaught React render crashes.
 * Displays a luxury Nailsbyhelina styled fallback card and reload options.
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Atelier ErrorBoundary caught an unhandled error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-[#FFFDFC] border border-[#D8C6C3] rounded-3xl p-8 sm:p-10 shadow-lg text-center space-y-6">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-[#F4ECE6] border border-[#D8C6C3] flex items-center justify-center p-3 shadow-2xs">
              <img src="/helinart-logo.png" alt="Nailsbyhelina Logo" className="w-10 h-10 object-contain" />
            </div>

            <div className="space-y-2">
              <h2 className="font-heading text-2xl font-medium text-[#313851]">
                Something went wrong
              </h2>
              <p className="text-xs text-[#786866] leading-relaxed">
                The atelier encountered an unexpected display issue. Please reload the page to continue your session.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={this.handleReload}
                className="flex-1 py-3 px-5 rounded-full bg-gradient-to-r from-[#B26661] via-[#9C5550] to-[#8A4743] text-[#FFFDFC] text-xs font-semibold tracking-wide shadow-xs hover:shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all"
              >
                Reload Page
              </button>
              <button
                onClick={this.handleGoHome}
                className="flex-1 py-3 px-5 rounded-full bg-[#F6F3ED] text-[#313851] text-xs font-semibold hover:bg-[#EFE9DF] transition-all border border-[#D8C6C3]"
              >
                Atelier Home
              </button>
            </div>

            {process.env.NODE_ENV !== 'production' && this.state.error && (
              <details className="text-left mt-4 p-3 bg-[#F6F3ED] rounded-xl text-[11px] text-[#9C5550] overflow-x-auto">
                <summary className="cursor-pointer font-semibold mb-1">Developer Error Details</summary>
                <pre className="whitespace-pre-wrap">{this.state.error.toString()}</pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
