"use client";

import { useState, useMemo } from "react";
import { JobApplication, SortField, SortDirection, FilterStatus } from "../types";
import StatusBadge from "./StatusBadge";

interface ApplicationTableProps {
  applications: JobApplication[];
  activeFilter: FilterStatus;
  onEdit: (application: JobApplication) => void;
  onDelete: (application: JobApplication) => void;
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "—";
  const [year, month, day] = dateStr.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

type SortIconProps = { field: SortField; sortField: SortField; sortDir: SortDirection };

function SortIcon({ field, sortField, sortDir }: SortIconProps) {
  const active = field === sortField;
  return (
    <span className="ml-1 inline-flex flex-col gap-0.5">
      <svg
        className={`w-2.5 h-2.5 transition-colors ${active && sortDir === "asc" ? "text-indigo-600" : "text-gray-300"}`}
        viewBox="0 0 10 6"
        fill="currentColor"
      >
        <path d="M5 0L10 6H0L5 0Z" />
      </svg>
      <svg
        className={`w-2.5 h-2.5 transition-colors ${active && sortDir === "desc" ? "text-indigo-600" : "text-gray-300"}`}
        viewBox="0 0 10 6"
        fill="currentColor"
      >
        <path d="M5 6L0 0H10L5 6Z" />
      </svg>
    </span>
  );
}

export default function ApplicationTable({
  applications,
  activeFilter,
  onEdit,
  onDelete,
}: ApplicationTableProps) {
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<SortField>("dateApplied");
  const [sortDir, setSortDir] = useState<SortDirection>("desc");

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const filtered = useMemo(() => {
    let result = applications;

    // Status filter
    if (activeFilter !== "All") {
      result = result.filter((a) => a.status === activeFilter);
    }

    // Search filter
    const q = search.trim().toLowerCase();
    if (q) {
      result = result.filter(
        (a) =>
          a.company.toLowerCase().includes(q) ||
          a.position.toLowerCase().includes(q) ||
          (a.location ?? "").toLowerCase().includes(q) ||
          (a.salary ?? "").toLowerCase().includes(q),
      );
    }

    // Sort
    result = [...result].sort((a, b) => {
      let valA: string;
      let valB: string;

      switch (sortField) {
        case "company":
          valA = a.company.toLowerCase();
          valB = b.company.toLowerCase();
          break;
        case "position":
          valA = a.position.toLowerCase();
          valB = b.position.toLowerCase();
          break;
        case "status":
          valA = a.status;
          valB = b.status;
          break;
        case "dateApplied":
          valA = a.dateApplied;
          valB = b.dateApplied;
          break;
        default:
          return 0;
      }

      if (valA < valB) return sortDir === "asc" ? -1 : 1;
      if (valA > valB) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [applications, activeFilter, search, sortField, sortDir]);

  const thBase =
    "px-4 py-3 text-left text-xs font-semibold text-violet-400 uppercase tracking-wider select-none";
  const thSortable = `${thBase} cursor-pointer hover:text-gray-800 transition-colors`;

  return (
    <div className="flex flex-col gap-4">
      {/* Search bar */}
      <div className="relative">
        <svg
          className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-violet-300 pointer-events-none"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0Z"
          />
        </svg>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by company, position, or location…"
          className="w-full rounded-xl border border-violet-200 bg-white pl-10 pr-4 py-2.5 text-sm text-slate-700 placeholder-violet-300 outline-none transition-all focus:border-violet-300 focus:ring-2 focus:ring-violet-100 shadow-sm"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-violet-300 hover:text-violet-500 transition-colors"
            aria-label="Clear search"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Result count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-400">
          Showing <span className="font-semibold text-slate-600">{filtered.length}</span>{" "}
          {filtered.length === 1 ? "application" : "applications"}
          {activeFilter !== "All" && (
            <span className="text-violet-300"> · filtered by {activeFilter}</span>
          )}
          {search && <span className="text-violet-300"> · matching &ldquo;{search}&rdquo;</span>}
        </p>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-violet-100 bg-white shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <svg
                className="w-7 h-7 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-700">No applications found</p>
            <p className="text-xs text-gray-400 mt-1">
              {search
                ? "Try a different search term or clear your filters."
                : "Add your first application to get started."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead className="bg-violet-50 border-b border-violet-100">
                <tr>
                  <th className={thSortable} onClick={() => handleSort("company")}>
                    <span className="inline-flex items-center">
                      Company
                      <SortIcon field="company" sortField={sortField} sortDir={sortDir} />
                    </span>
                  </th>
                  <th className={thSortable} onClick={() => handleSort("position")}>
                    <span className="inline-flex items-center">
                      Position
                      <SortIcon field="position" sortField={sortField} sortDir={sortDir} />
                    </span>
                  </th>
                  <th className={`${thBase} hidden md:table-cell`}>Location</th>
                  <th className={thSortable} onClick={() => handleSort("status")}>
                    <span className="inline-flex items-center">
                      Status
                      <SortIcon field="status" sortField={sortField} sortDir={sortDir} />
                    </span>
                  </th>
                  <th
                    className={`${thSortable} hidden sm:table-cell`}
                    onClick={() => handleSort("dateApplied")}
                  >
                    <span className="inline-flex items-center">
                      Applied
                      <SortIcon field="dateApplied" sortField={sortField} sortDir={sortDir} />
                    </span>
                  </th>
                  <th className={`${thBase} hidden lg:table-cell`}>Salary (LPA)</th>
                  <th className={`${thBase} text-right`}>Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-violet-50">
                {filtered.map((app) => (
                  <tr key={app.id} className="group hover:bg-violet-50/60 transition-colors">
                    {/* Company */}
                    <td className="px-4 py-3.5">
                      <div className="flex flex-col gap-0.5">
                        {app.url ? (
                          <a
                            href={app.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium text-sm text-violet-500 hover:text-violet-700 hover:underline transition-colors flex items-center gap-1"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {app.company}
                            <svg
                              className="w-3 h-3 opacity-60 flex-shrink-0"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                              />
                            </svg>
                          </a>
                        ) : (
                          <span className="font-medium text-sm text-gray-900">{app.company}</span>
                        )}
                        {/* Show position on mobile under company */}
                        <span className="text-xs text-slate-400 sm:hidden">{app.position}</span>
                      </div>
                    </td>

                    {/* Position */}
                    <td className="px-4 py-3.5">
                      <span className="text-sm text-slate-600">{app.position}</span>
                      {app.notes && (
                        <p
                          className="text-xs text-slate-300 mt-0.5 truncate max-w-[180px]"
                          title={app.notes}
                        >
                          {app.notes}
                        </p>
                      )}
                    </td>

                    {/* Location */}
                    <td className="px-4 py-3.5 hidden md:table-cell">
                      <span className="text-sm text-slate-500">
                        {app.location || <span className="text-violet-200">—</span>}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3.5">
                      <StatusBadge status={app.status} />
                    </td>

                    {/* Date Applied */}
                    <td className="px-4 py-3.5 hidden sm:table-cell">
                      <span className="text-sm text-slate-500">{formatDate(app.dateApplied)}</span>
                    </td>

                    {/* Salary */}
                    <td className="px-4 py-3.5 hidden lg:table-cell">
                      <span className="text-sm text-slate-500">
                        {app.salary ? (
                          <span>
                            {app.salary}{" "}
                            <span className="text-xs text-violet-400 font-medium">LPA</span>
                          </span>
                        ) : (
                          <span className="text-violet-200">—</span>
                        )}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center justify-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                        {/* Edit */}
                        <button
                          onClick={() => onEdit(app)}
                          title="Edit application"
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-violet-100 hover:text-violet-600 transition-colors"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>
                        {/* Delete */}
                        <button
                          onClick={() => onDelete(app)}
                          title="Delete application"
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-100 hover:text-rose-400 transition-colors"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
