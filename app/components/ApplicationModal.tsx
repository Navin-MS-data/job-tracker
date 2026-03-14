"use client";

import { useState, useEffect } from "react";
import { JobApplication, ApplicationStatus } from "../types";

const STATUSES: ApplicationStatus[] = [
  "Applied",
  "Phone Screen",
  "Interview",
  "Offer",
  "Rejected",
  "Withdrawn",
];

type FormData = {
  company: string;
  position: string;
  location: string;
  status: ApplicationStatus;
  dateApplied: string;
  salary: string;
  url: string;
  notes: string;
};

const getToday = () => new Date().toISOString().split("T")[0];

const defaultFormData: FormData = {
  company: "",
  position: "",
  location: "",
  status: "Applied",
  dateApplied: getToday(),
  salary: "",
  url: "",
  notes: "",
};

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<JobApplication, "id" | "createdAt" | "updatedAt">) => void;
  editApplication?: JobApplication | null;
}

export default function ApplicationModal({
  isOpen,
  onClose,
  onSave,
  editApplication,
}: ApplicationModalProps) {
  const [formData, setFormData] = useState<FormData>({
    ...defaultFormData,
    dateApplied: getToday(),
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  useEffect(() => {
    if (!isOpen) return;
    if (editApplication) {
      setFormData({
        company: editApplication.company,
        position: editApplication.position,
        location: editApplication.location ?? "",
        status: editApplication.status,
        dateApplied: editApplication.dateApplied,
        salary: editApplication.salary ?? "",
        url: editApplication.url ?? "",
        notes: editApplication.notes ?? "",
      });
    } else {
      setFormData({ ...defaultFormData, dateApplied: getToday() });
    }
    setErrors({});
  }, [editApplication, isOpen]);

  if (!isOpen) return null;

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    if (!formData.company.trim()) newErrors.company = "Company name is required.";
    if (!formData.position.trim()) newErrors.position = "Position is required.";
    if (!formData.dateApplied) newErrors.dateApplied = "Date applied is required.";
    if (formData.url && !/^https?:\/\/.+/.test(formData.url.trim())) {
      newErrors.url = "Please enter a valid URL starting with http:// or https://";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSave({
      company: formData.company.trim(),
      position: formData.position.trim(),
      location: formData.location.trim(),
      status: formData.status,
      dateApplied: formData.dateApplied,
      salary: formData.salary.trim() || undefined,
      url: formData.url.trim() || undefined,
      notes: formData.notes.trim() || undefined,
    });
    onClose();
  };

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const inputBase =
    "w-full rounded-lg border px-3.5 py-2.5 text-sm text-stone-800 placeholder-stone-300 outline-none transition-all focus:ring-2";
  const inputNormal = "border-stone-200 bg-white focus:border-stone-400 focus:ring-stone-100";
  const inputError = "border-rose-300 bg-rose-50 focus:border-rose-300 focus:ring-rose-100";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Panel */}
      <div className="relative w-full max-w-lg max-h-[92vh] flex flex-col rounded-2xl bg-white shadow-xl border border-stone-200">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between border-b border-stone-100 bg-white px-6 py-4 shrink-0">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {editApplication ? "Edit Application" : "Add Application"}
            </h2>
            <p className="text-xs text-stone-400 mt-0.5">
              {editApplication
                ? "Update the details for this application."
                : "Fill in the details for your new job application."}
            </p>
          </div>
          <button
            onClick={onClose}
            className="ml-4 rounded-lg p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-600 transition-colors"
            aria-label="Close modal"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto px-6 py-5 space-y-4" noValidate>
          {/* Company */}
          <div>
            <label className="block text-sm font-medium text-stone-600 mb-1.5">
              Company <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              value={formData.company}
              onChange={(e) => handleChange("company", e.target.value)}
              placeholder="e.g. Acme Corp"
              className={`${inputBase} ${errors.company ? inputError : inputNormal}`}
            />
            {errors.company && <p className="mt-1 text-xs text-rose-400">{errors.company}</p>}
          </div>

          {/* Position */}
          <div>
            <label className="block text-sm font-medium text-stone-600 mb-1.5">
              Position <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              value={formData.position}
              onChange={(e) => handleChange("position", e.target.value)}
              placeholder="e.g. Software Engineer"
              className={`${inputBase} ${errors.position ? inputError : inputNormal}`}
            />
            {errors.position && <p className="mt-1 text-xs text-rose-400">{errors.position}</p>}
          </div>

          {/* Location + Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-600 mb-1.5">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleChange("location", e.target.value)}
                placeholder="e.g. Remote"
                className={`${inputBase} ${inputNormal}`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-600 mb-1.5">Status</label>
              <select
                value={formData.status}
                onChange={(e) => handleChange("status", e.target.value)}
                className={`${inputBase} ${inputNormal} cursor-pointer`}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date Applied + Salary */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-600 mb-1.5">
                Date Applied <span className="text-rose-400">*</span>
              </label>
              <input
                type="date"
                value={formData.dateApplied}
                onChange={(e) => handleChange("dateApplied", e.target.value)}
                className={`${inputBase} ${errors.dateApplied ? inputError : inputNormal}`}
              />
              {errors.dateApplied && (
                <p className="mt-1 text-xs text-rose-400">{errors.dateApplied}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-600 mb-1.5">
                Salary <span className="text-stone-400 font-normal">(LPA)</span>
              </label>
              <input
                type="text"
                value={formData.salary}
                onChange={(e) => handleChange("salary", e.target.value)}
                placeholder="e.g. 12 LPA"
                className={`${inputBase} ${inputNormal}`}
              />
            </div>
          </div>

          {/* Job URL */}
          <div>
            <label className="block text-sm font-medium text-stone-600 mb-1.5">Job URL</label>
            <input
              type="url"
              value={formData.url}
              onChange={(e) => handleChange("url", e.target.value)}
              placeholder="https://example.com/jobs/123"
              className={`${inputBase} ${errors.url ? inputError : inputNormal}`}
            />
            {errors.url && <p className="mt-1 text-xs text-rose-400">{errors.url}</p>}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-stone-600 mb-1.5">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              placeholder="Recruiter contact, interview rounds, anything relevant..."
              rows={3}
              className={`${inputBase} ${inputNormal} resize-none`}
            />
          </div>

          {/* Footer Actions */}
          <div className="flex gap-3 pt-2 pb-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-stone-200 bg-white px-4 py-2.5 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 rounded-lg bg-stone-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-400 focus:ring-offset-2"
            >
              {editApplication ? "Save Changes" : "Add Application"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
