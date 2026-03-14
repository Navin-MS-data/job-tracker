"use client";

import { useState } from "react";
import { useApplications } from "./hooks/useApplications";
import { JobApplication, FilterStatus } from "./types";
import StatsRow from "./components/StatsRow";
import ApplicationTable from "./components/ApplicationTable";
import ApplicationModal from "./components/ApplicationModal";
import DeleteConfirmModal from "./components/DeleteConfirmModal";

export default function Home() {
  const { applications, isLoaded, addApplication, updateApplication, deleteApplication } =
    useApplications();

  const [activeFilter, setActiveFilter] = useState<FilterStatus>("All");

  // Add / Edit modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingApplication, setEditingApplication] = useState<JobApplication | null>(null);

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState<JobApplication | null>(null);

  // --- Handlers ---
  const handleOpenAdd = () => {
    setEditingApplication(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (app: JobApplication) => {
    setEditingApplication(app);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingApplication(null);
  };

  const handleSave = (data: Omit<JobApplication, "id" | "createdAt" | "updatedAt">) => {
    if (editingApplication) {
      updateApplication(editingApplication.id, data);
    } else {
      addApplication(data);
    }
    handleCloseModal();
  };

  const handleDeleteRequest = (app: JobApplication) => {
    setDeleteTarget(app);
  };

  const handleDeleteConfirm = () => {
    if (deleteTarget) {
      deleteApplication(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteTarget(null);
  };

  return (
    <div className="min-h-screen bg-[#f9f8f6]">
      {/* ── Header ── */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Brand */}
            <div className="flex items-center gap-3">
              <img src="/logoipsum-415.svg" alt="Job Tracker logo" width={32} height={32} />
              <div>
                <h1 className="text-base font-semibold text-gray-900 leading-tight">Job Tracker</h1>
                <p className="text-xs text-stone-400 leading-tight hidden sm:block">
                  Job Application Tracker
                </p>
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3">
              {isLoaded && applications.length > 0 && (
                <p className="text-xs text-stone-400 hidden sm:block">
                  {applications.length} application{applications.length !== 1 ? "s" : ""} tracked
                </p>
              )}
              <button
                onClick={handleOpenAdd}
                className="inline-flex items-center gap-2 rounded-lg bg-stone-900 px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-400 focus:ring-offset-2 shadow-sm"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                <span>Add Application</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── Main Content ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page title */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-stone-800">Dashboard</h2>
          <p className="text-sm text-stone-400 mt-1">
            Track and manage all your job applications in one place.
          </p>
        </div>

        {/* Loading skeleton */}
        {!isLoaded ? (
          <div className="animate-pulse space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
              {Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className="h-20 rounded-xl bg-stone-200" />
              ))}
            </div>
            <div className="h-10 rounded-xl bg-stone-200 w-full" />
            <div className="h-64 rounded-xl bg-stone-200 w-full" />
          </div>
        ) : (
          <>
            {/* Stats Row */}
            <StatsRow
              applications={applications}
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
            />

            {/* Applications Table */}
            {applications.length === 0 ? (
              /* Full empty state when there are zero applications */
              <div className="rounded-2xl border border-dashed border-stone-300 bg-white flex flex-col items-center justify-center py-24 px-8 text-center">
                <div className="flex items-center justify-center w-20 h-20 rounded-full bg-stone-100 mb-6">
                  <svg
                    className="w-10 h-10 text-stone-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-stone-800 mb-2">No applications yet</h3>
                <p className="text-sm text-stone-500 max-w-sm mb-8">
                  Start tracking your job search by adding your first application. Keep tabs on
                  every company, position, and status all in one place.
                </p>
                <button
                  onClick={handleOpenAdd}
                  className="inline-flex items-center gap-2 rounded-lg bg-stone-900 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-400 focus:ring-offset-2 shadow-sm"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  Add your first application
                </button>
              </div>
            ) : (
              <ApplicationTable
                applications={applications}
                activeFilter={activeFilter}
                onEdit={handleOpenEdit}
                onDelete={handleDeleteRequest}
              />
            )}
          </>
        )}
      </main>

      {/* ── Footer ── */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-8 border-t border-stone-200">
        <p className="text-xs text-stone-400 text-center">
          Job Tracker · Data is stored locally in your browser.
        </p>
      </footer>

      {/* ── Modals ── */}
      <ApplicationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
        editApplication={editingApplication}
      />

      <DeleteConfirmModal
        isOpen={deleteTarget !== null}
        companyName={deleteTarget?.company ?? ""}
        position={deleteTarget?.position ?? ""}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </div>
  );
}
