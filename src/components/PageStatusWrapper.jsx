import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, AlertCircle, RefreshCw, ArrowLeft, Home } from 'lucide-react';

/**
 * Elegant wrapper for public informational pages.
 * Enforces requirement 25:
 * - Loading: elegant luxury skeleton.
 * - Missing/unpublished: "This page is currently unavailable."
 * - Error: "We couldn't load this page right now." (no raw errors) + retry action.
 */
export default function PageStatusWrapper({
  loading,
  error,
  page,
  onRetry,
  children
}) {
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-8 animate-pulse">
        {/* Skeleton Badge */}
        <div className="flex justify-center">
          <div className="h-7 w-40 bg-[#E8DDD8] rounded-full" />
        </div>
        {/* Skeleton Title */}
        <div className="space-y-3 text-center flex flex-col items-center">
          <div className="h-10 sm:h-12 w-3/4 sm:w-2/3 bg-[#DECFC9] rounded-2xl" />
          <div className="h-4 w-1/2 bg-[#E8DDD8] rounded-lg" />
        </div>
        {/* Skeleton Card */}
        <div className="bg-[#FFFDFC] rounded-3xl p-8 sm:p-12 border border-[#D8C6C3] space-y-6">
          <div className="h-5 w-1/3 bg-[#DECFC9] rounded-lg" />
          <div className="space-y-3">
            <div className="h-3.5 w-full bg-[#E8DDD8] rounded" />
            <div className="h-3.5 w-11/12 bg-[#E8DDD8] rounded" />
            <div className="h-3.5 w-4/5 bg-[#E8DDD8] rounded" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
            <div className="h-28 rounded-2xl bg-[#F6F3ED] border border-[#D8C6C3]/60" />
            <div className="h-28 rounded-2xl bg-[#F6F3ED] border border-[#D8C6C3]/60" />
            <div className="h-28 rounded-2xl bg-[#F6F3ED] border border-[#D8C6C3]/60" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16 sm:py-24 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-[#F4ECE6] text-[#9C5550] border border-[#D8C6C3] flex items-center justify-center mx-auto shadow-sm">
          <AlertCircle className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="font-heading font-medium text-3xl sm:text-4xl text-[#313851]">
            We couldn’t load this page right now.
          </h1>
          <p className="text-sm text-[#786866] max-w-md mx-auto leading-relaxed">
            Please check your connection or refresh the page to restore atelier information.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          {onRetry && (
            <button
              onClick={onRetry}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-semibold bg-[#9C5550] text-[#FFFDFC] hover:bg-[#8A4743] transition-colors shadow-xs"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Try Again</span>
            </button>
          )}
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-semibold bg-[#FFFDFC] text-[#313851] border border-[#D8C6C3] hover:bg-[#F6F3ED] transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Return to Home</span>
          </Link>
        </div>
      </div>
    );
  }

  // Missing or Unpublished Draft page check (Requirement 6 & 25)
  if (page && page.status !== 'published') {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16 sm:py-24 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F4ECE6] border border-[#D8C6C3] text-xs font-medium text-[#793D39]">
          <Sparkles className="w-3.5 h-3.5 text-[#A87F45]" />
          <span>Atelier Notice</span>
        </div>
        <div className="space-y-2">
          <h1 className="font-heading font-medium text-3xl sm:text-4xl text-[#313851]">
            This page is currently unavailable.
          </h1>
          <p className="text-sm text-[#786866] max-w-md mx-auto leading-relaxed">
            Our atelier curators are currently updating this section. Please check back shortly or explore our collection.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-semibold bg-[#9C5550] text-[#FFFDFC] hover:bg-[#8A4743] transition-colors shadow-xs"
          >
            <span>Explore Nail Sets</span>
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-semibold bg-[#FFFDFC] text-[#313851] border border-[#D8C6C3] hover:bg-[#F6F3ED] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Boutique</span>
          </Link>
        </div>
      </div>
    );
  }

  return children;
}
