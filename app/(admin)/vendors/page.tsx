"use client";

import { useEffect, useState } from "react";
import PageHeader from "@/components/ui/PageHeader";
import StatusChip from "@/components/ui/StatusChip";
import Modal from "@/components/ui/Modal";
import UserAvatar from "@/components/ui/UserAvatar";
import { listVendors, reviewVendorKyc } from "@/lib/admin-api";
import type { AdminVendor } from "@/types";
import Button from "@/components/ui/Button";
import FilterTabs from "@/components/ui/FilterTabs";
import Card from "@/components/ui/Card";
import FormField, { Input, Select } from "@/components/ui/FormField";

// ── Types ────────────────────────────────────────────────────────────────────

type TabKey = "pending" | "approved" | "rejected" | "all";

interface TabConfig {
  key: TabKey;
  label: string;
  count: number;
}

type RejectReason =
  | ""
  | "Incomplete Documents"
  | "Fraudulent Information"
  | "Invalid Business Registration"
  | "Other";

// ── PDF file tile ─────────────────────────────────────────────────────────────

function FileTile({ name, url }: { name: string; url?: string | null }) {
  const hasDoc = !!url;
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-border">
      <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#FEF2F2" }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="#EF4444">
          <path d="M20 2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8.5 7.5c0 .83-.67 1.5-1.5 1.5H9v2H7.5V7H10c.83 0 1.5.67 1.5 1.5v1zm5 2c0 .83-.67 1.5-1.5 1.5h-2.5V7H15c.83 0 1.5.67 1.5 1.5v3zm4-3H19v1h1.5V11H19v2h-1.5V7h3v1.5zM9 9.5h1v-1H9v1zM4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm10 5.5h1v-3h-1v3z" />
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-text-primary truncate">{name}</p>
        <p className="text-xs text-text-secondary">{hasDoc ? "Uploaded document" : "Not provided"}</p>
      </div>
      {hasDoc ? (
        <a
          href={url!}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-semibold flex-shrink-0 hover:underline"
          style={{ color: "#5B50F0" }}
        >
          View
        </a>
      ) : (
        <span className="text-xs font-semibold flex-shrink-0 text-text-secondary opacity-50">
          View
        </span>
      )}
    </div>
  );
}

// ── Review Vendor Modal ───────────────────────────────────────────────────────

interface ReviewModalProps {
  vendor: AdminVendor;
  onClose: () => void;
  onApprove: () => void;
  onReject: () => void;
}

function ReviewVendorModal({ vendor, onClose, onApprove, onReject }: ReviewModalProps) {
  return (
    <Modal open title="Review Vendor Application" onClose={onClose} width="max-w-lg">
      {/* Vendor info card */}
      <Card padding="p-4">
        <div className="flex items-center gap-4">
          <UserAvatar text={vendor.avatarText} color={vendor.avatarColor} size={48} />
          <div>
            <p className="font-bold text-text-primary">{vendor.name}</p>
            <p className="text-sm text-text-secondary">{vendor.category}</p>
            <div className="flex items-center gap-3 mt-1 text-xs text-text-secondary">
              <span>{vendor.location}</span>
              <span>·</span>
              <span>Submitted {vendor.submittedDate}</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Contact info */}
      <div className="grid grid-cols-2 gap-3 mb-5 mt-5">
        <div>
          <p className="text-xs text-text-secondary mb-0.5">Email</p>
          <p className="text-sm font-medium text-text-primary">{vendor.email}</p>
        </div>
        <div>
          <p className="text-xs text-text-secondary mb-0.5">Phone</p>
          <p className="text-sm font-medium text-text-primary">{vendor.phone}</p>
        </div>
      </div>

      {/* Documents */}
      <div className="mb-6">
        <p className="text-sm font-semibold text-text-primary mb-2">Documents</p>
        <div className="space-y-3">
          <FileTile name="NIN Document" url={vendor.ninDocumentUrl} />
          <FileTile name="CAC / Business Registration" url={vendor.cacDocumentUrl} />
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button variant="danger" fullWidth onClick={onReject}>Reject</Button>
        <Button variant="success" fullWidth onClick={onApprove}>Approve</Button>
      </div>
    </Modal>
  );
}

// ── Reject Vendor Modal ───────────────────────────────────────────────────────

interface RejectModalProps {
  vendor: AdminVendor;
  onClose: () => void;
  onConfirm: (reason: string) => void;
}

function RejectVendorModal({ vendor, onClose, onConfirm }: RejectModalProps) {
  const [reason, setReason] = useState<RejectReason>("");
  const [otherText, setOtherText] = useState("");

  const handleConfirm = () => {
    const finalReason = reason === "Other" ? otherText : reason;
    onConfirm(finalReason);
  };

  return (
    <Modal open title="" onClose={onClose} width="max-w-md">
      {/* Warning icon + heading */}
      <div className="flex flex-col items-center text-center mb-6 -mt-2">
        <div className="w-14 h-14 rounded-full flex items-center justify-center mb-3" style={{ backgroundColor: "#FFFBEB" }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="#F59E0B">
            <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-text-primary">Reject Vendor Application</h3>
        <p className="text-sm text-text-secondary mt-1">
          This action will notify <span className="font-semibold">{vendor.name}</span> via email
        </p>
      </div>

      {/* Reason select */}
      <div className="mb-4">
        <FormField label="Select Reason">
          <Select
            value={reason}
            onChange={(e) => setReason(e.target.value as RejectReason)}
          >
            <option value="">— Select a reason —</option>
            <option value="Incomplete Documents">Incomplete Documents</option>
            <option value="Fraudulent Information">Fraudulent Information</option>
            <option value="Invalid Business Registration">Invalid Business Registration</option>
            <option value="Other">Other</option>
          </Select>
        </FormField>
      </div>

      {/* Other reason textarea */}
      {reason === "Other" && (
        <div className="mb-4">
          <FormField label="Other Reason">
            <textarea
              value={otherText}
              onChange={(e) => setOtherText(e.target.value)}
              rows={3}
              placeholder="Describe the reason for rejection…"
              className="w-full border border-border rounded-xl px-3 py-2.5 text-sm text-text-primary bg-white focus:outline-none resize-none"
            />
          </FormField>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 mt-2">
        <Button variant="outline" fullWidth onClick={onClose}>Cancel</Button>
        <Button
          variant="danger"
          fullWidth
          onClick={handleConfirm}
          disabled={!reason || (reason === "Other" && !otherText.trim())}
        >
          Reject Application
        </Button>
      </div>
    </Modal>
  );
}

// ── Vendor Details Modal ──────────────────────────────────────────────────────

interface DetailsModalProps {
  vendor: AdminVendor;
  onClose: () => void;
  onRereview?: () => void;
}

function VendorDetailsModal({ vendor, onClose, onRereview }: DetailsModalProps) {
  const isRejected = vendor.status === "rejected";

  return (
    <Modal open title="Vendor Details" onClose={onClose} width="max-w-lg">
      {/* Vendor info card */}
      <Card padding="p-4">
        <div className="flex items-center gap-4">
          <UserAvatar text={vendor.avatarText} color={vendor.avatarColor} size={48} />
          <div className="flex-1">
            <div className="flex items-start justify-between gap-2">
              <p className="font-bold text-text-primary">{vendor.name}</p>
              {isRejected ? (
                <StatusChip status="rejected - awaiting response" />
              ) : (
                <StatusChip status={vendor.status} />
              )}
            </div>
            <p className="text-sm text-text-secondary">{vendor.category}</p>
            <div className="flex items-center gap-3 mt-1 text-xs text-text-secondary">
              <span>{vendor.location}</span>
              <span>·</span>
              <span>Submitted {vendor.submittedDate}</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Contact info */}
      <div className="grid grid-cols-2 gap-3 mb-5 mt-5">
        <div>
          <p className="text-xs text-text-secondary mb-0.5">Email</p>
          <p className="text-sm font-medium text-text-primary">{vendor.email}</p>
        </div>
        <div>
          <p className="text-xs text-text-secondary mb-0.5">Phone</p>
          <p className="text-sm font-medium text-text-primary">{vendor.phone}</p>
        </div>
      </div>

      {/* Documents */}
      <div className="mb-6">
        <p className="text-sm font-semibold text-text-primary mb-2">Documents</p>
        <div className="space-y-3">
          <FileTile name="NIN Document" url={vendor.ninDocumentUrl} />
          <FileTile name="CAC / Business Registration" url={vendor.cacDocumentUrl} />
        </div>
      </div>

      {/* Actions */}
      {isRejected ? (
        <div className="flex gap-3">
          <Button variant="outline" fullWidth onClick={onClose}>Close</Button>
          <Button variant="outline" size="sm" fullWidth onClick={onRereview}>Re-review</Button>
        </div>
      ) : (
        <Button variant="outline" fullWidth onClick={onClose}>Close</Button>
      )}
    </Modal>
  );
}

// ── Toast ─────────────────────────────────────────────────────────────────────

function Toast({ message, visible }: { message: string; visible: boolean }) {
  return (
    <div
      className="fixed bottom-6 right-6 z-[100] flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-semibold text-white transition-all duration-300"
      style={{
        backgroundColor: "#10B981",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(12px)",
        pointerEvents: "none",
      }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
      </svg>
      {message}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function VendorsPage() {
  const [vendors, setVendors] = useState<AdminVendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>("pending");
  const [selectedVendor, setSelectedVendor] = useState<AdminVendor | null>(null);
  const [modalMode, setModalMode] = useState<"review" | "reject" | "details" | null>(null);
  const [toast, setToast] = useState({ visible: false, message: "" });

  const reload = () => {
    setLoading(true);
    setError(null);
    listVendors()
      .then(setVendors)
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load vendors"))
      .finally(() => setLoading(false));
  };

  useEffect(reload, []);

  // Tab counts
  const pendingCount = vendors.filter((v) => v.status === "pending").length;
  const approvedCount = vendors.filter((v) => v.status === "approved").length;
  const rejectedCount = vendors.filter((v) => v.status === "rejected").length;

  const tabs: TabConfig[] = [
    { key: "pending",  label: "Pending",     count: pendingCount  },
    { key: "approved", label: "Approved",    count: approvedCount },
    { key: "rejected", label: "Rejected",    count: rejectedCount },
    { key: "all",      label: "All Vendors", count: vendors.length },
  ];

  const filteredVendors =
    activeTab === "all" ? vendors : vendors.filter((v) => v.status === activeTab);

  // Helpers
  const showToast = (message: string) => {
    setToast({ visible: true, message });
    setTimeout(() => setToast({ visible: false, message: "" }), 2800);
  };

  const closeModals = () => {
    setSelectedVendor(null);
    setModalMode(null);
  };

  const handleViewVendor = (vendor: AdminVendor) => {
    setSelectedVendor(vendor);
    setModalMode(vendor.status === "pending" ? "review" : "details");
  };

  const handleApprove = async () => {
    if (!selectedVendor) return;
    const v = selectedVendor;
    try {
      await reviewVendorKyc(v.id, "APPROVE");
      setVendors((prev) =>
        prev.map((x) => (x.id === v.id ? { ...x, status: "approved" } : x))
      );
      closeModals();
      showToast(`${v.name} has been approved`);
    } catch (e) {
      showToast(e instanceof Error ? e.message : "Approve failed");
    }
  };

  const handleOpenReject = () => {
    setModalMode("reject");
  };

  const handleConfirmReject = async (reason: string) => {
    if (!selectedVendor) return;
    const v = selectedVendor;
    try {
      await reviewVendorKyc(v.id, "REJECT", reason || "Rejected by admin");
      setVendors((prev) =>
        prev.map((x) => (x.id === v.id ? { ...x, status: "rejected" } : x))
      );
      closeModals();
      showToast(`${v.name} application rejected`);
    } catch (e) {
      showToast(e instanceof Error ? e.message : "Reject failed");
    }
  };

  const handleRereview = async () => {
    if (!selectedVendor) return;
    // Re-review = re-approve a previously rejected vendor.
    const v = selectedVendor;
    try {
      await reviewVendorKyc(v.id, "APPROVE");
      setVendors((prev) =>
        prev.map((x) => (x.id === v.id ? { ...x, status: "approved" } : x))
      );
      closeModals();
      showToast(`${v.name} re-approved`);
    } catch (e) {
      showToast(e instanceof Error ? e.message : "Action failed");
    }
  };

  return (
    <div className="min-h-screen bg-page-bg p-6">
      {/* Header */}
      <PageHeader
        title="Vendor Verification"
        subtitle="Review and approve vendor applications"
      />

      {/* Filter Tabs */}
      <div className="mb-6">
        <FilterTabs
          tabs={tabs}
          active={activeTab}
          onChange={(key) => setActiveTab(key as TabKey)}
        />
      </div>

      {/* Vendor Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left text-xs text-text-secondary font-semibold border-b border-border">
                <th className="px-5 py-4">Business</th>
                <th className="px-5 py-4 hidden md:table-cell">Location</th>
                <th className="px-5 py-4 hidden lg:table-cell">Submitted</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr style={{ borderBottom: '1px solid #F3F4F6' }}>
                  <td colSpan={5} className="px-5 py-10 text-center text-text-secondary text-sm">
                    Loading vendors…
                  </td>
                </tr>
              ) : error ? (
                <tr style={{ borderBottom: '1px solid #F3F4F6' }}>
                  <td colSpan={5} className="px-5 py-10 text-center text-sm" style={{ color: "#DC2626" }}>
                    {error} · <button className="font-semibold underline" onClick={reload}>Retry</button>
                  </td>
                </tr>
              ) : filteredVendors.length === 0 ? (
                <tr style={{ borderBottom: '1px solid #F3F4F6' }}>
                  <td colSpan={5} className="px-5 py-10 text-center text-text-secondary text-sm">
                    No vendors in this category
                  </td>
                </tr>
              ) : (
                filteredVendors.map((vendor) => (
                  <tr
                    key={vendor.id}
                    className="hover:bg-gray-50 transition-colors"
                    style={{ borderBottom: '1px solid #F3F4F6' }}
                  >
                    {/* Business */}
                    <td className="px-5 py-5">
                      <div className="flex items-center gap-3">
                        <UserAvatar
                          text={vendor.avatarText}
                          color={vendor.avatarColor}
                          size={38}
                        />
                        <div>
                          <p className="font-semibold text-text-primary">{vendor.name}</p>
                          <p className="text-xs text-text-secondary">{vendor.category}</p>
                        </div>
                      </div>
                    </td>

                    {/* Location */}
                    <td className="px-5 py-5 text-text-secondary hidden md:table-cell">
                      {vendor.location}
                    </td>

                    {/* Submitted */}
                    <td className="px-5 py-5 text-text-secondary hidden lg:table-cell">
                      {vendor.submittedDate}
                    </td>

                    {/* Status */}
                    <td className="px-5 py-5">
                      <StatusChip status={vendor.status} />
                    </td>

                    {/* Action */}
                    <td className="px-5 py-5">
                      <Button variant="outline" size="sm" onClick={() => handleViewVendor(vendor)}>
                        View
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {selectedVendor && modalMode === "review" && (
        <ReviewVendorModal
          vendor={selectedVendor}
          onClose={closeModals}
          onApprove={handleApprove}
          onReject={handleOpenReject}
        />
      )}

      {selectedVendor && modalMode === "reject" && (
        <RejectVendorModal
          vendor={selectedVendor}
          onClose={closeModals}
          onConfirm={handleConfirmReject}
        />
      )}

      {selectedVendor && modalMode === "details" && (
        <VendorDetailsModal
          vendor={selectedVendor}
          onClose={closeModals}
          onRereview={handleRereview}
        />
      )}

      {/* Toast */}
      <Toast visible={toast.visible} message={toast.message} />
    </div>
  );
}
