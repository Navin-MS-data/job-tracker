import { FilterStatus } from "../types";

interface EmptyStateProps {
  activeFilter: FilterStatus;
  searchQuery: string;
  onClearFilters: () => void;
  onAddNew: () => void;
}

export default function EmptyState({
  activeFilter,
  searchQuery,
  onClearFilters,
  onAddNew,
}: EmptyStateProps) {
  const hasFilters = activeFilter !== "All" || searchQuery.trim() !== "";

  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      {/* Illustration */}
      <div className="flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-5">
        {hasFilters ? (
          <svg
            className="w-10 h-10 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M21 21l-4.35-4.35M17 11A6 6 0 105 11a6 6 0 0012 0z"
            />
          </svg>
        ) : (
          <svg
            className="w-10 h-10 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12h6m-3-3v6M4 6h16M4 10h4M4 14h4M4 18h16"
            />
          </svg>
        )}
      </div>

      {/* Text */}
      {hasFilters ? (
        <>
          <h3 className="text-base font-semibold text-gray-900 mb-1">No results found</h3>
          <p className="text-sm text-gray-500 max-w-xs mb-6">
            {searchQuery && activeFilter !== "All"
              ? `No "${activeFilter}" applications match "${searchQuery}".`
              : searchQuery
              ? `No applications match "${searchQuery}".`
              : `You have no applications with the status "${activeFilter}".`}
          </p>
          <button
            onClick={onClearFilters}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:border-gray-400"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            Clear filters
          </button>
        </>
      ) : (
        <>
          <h3 className="text-base font-semibold text-gray-900 mb-1">No applications yet</h3>
          <p className="text-sm text-gray-500 max-w-xs mb-6">
            Start tracking your job search by adding your first application.
          </p>
          <button
            onClick={onAddNew}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add your first application
          </button>
        </>
      )}
    </div>
  );
}
