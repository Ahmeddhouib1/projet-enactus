"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Pencil, Plus, Trash2 } from "lucide-react";
import DataTable, { type DataTableColumn } from "@/components/admin/DataTable";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import PartnerFormModal from "@/components/admin/PartnerFormModal";
import { isUploadedMedia, resolveMediaUrl } from "@/lib/utils";
import { createPartner, deletePartner, listAdminPartners, updatePartner } from "@/services/admin/partners";
import type { AdminPartner } from "@/types/partner";
import type { PartnerFormValues } from "@/lib/validation";

export default function AdminPartnersPage() {
  const [partners, setPartners] = useState<AdminPartner[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<AdminPartner | null>(null);
  const [pendingDelete, setPendingDelete] = useState<AdminPartner | null>(null);

  async function refresh() {
    setPartners(await listAdminPartners());
  }

  useEffect(() => {
    listAdminPartners()
      .then(setPartners)
      .finally(() => setLoading(false));
  }, []);

  async function handleSubmit(values: PartnerFormValues) {
    if (editingPartner) {
      await updatePartner(editingPartner.id, values);
    } else {
      await createPartner(values);
    }
    setModalOpen(false);
    setEditingPartner(null);
    await refresh();
  }

  async function handleDeleteConfirmed() {
    if (!pendingDelete) return;
    await deletePartner(pendingDelete.id);
    setPendingDelete(null);
    await refresh();
  }

  const columns: DataTableColumn<AdminPartner>[] = [
    {
      header: "Logo",
      cell: (partner) => (
        <div className="relative h-10 w-16">
          <Image
            src={resolveMediaUrl(partner.logo)}
            alt={partner.name}
            fill
            unoptimized={isUploadedMedia(partner.logo)}
            className="object-contain"
          />
        </div>
      ),
    },
    { header: "Name", cell: (partner) => <span className="font-semibold">{partner.name}</span> },
    { header: "Type", cell: (partner) => partner.partnerType },
    {
      header: "Status",
      cell: (partner) =>
        partner.active ? (
          <span className="text-xs font-semibold text-green-700">Active</span>
        ) : (
          <span className="text-xs font-semibold text-enactus-dark-gray">Inactive</span>
        ),
    },
    {
      header: "Actions",
      cell: (partner) => (
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Edit partner"
            onClick={() => {
              setEditingPartner(partner);
              setModalOpen(true);
            }}
            className="rounded-md p-2 text-enactus-navy hover:bg-enactus-light-gray/15"
          >
            <Pencil size={16} />
          </button>
          <button
            type="button"
            aria-label="Delete partner"
            onClick={() => setPendingDelete(partner)}
            className="rounded-md p-2 text-red-600 hover:bg-red-50"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  if (loading) {
    return <p className="text-sm text-enactus-dark-gray">Loading partners...</p>;
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-enactus-dark-gray">Manage partner logos shown on the public site.</p>
        <button
          type="button"
          onClick={() => {
            setEditingPartner(null);
            setModalOpen(true);
          }}
          className="inline-flex items-center gap-2 rounded-full bg-enactus-yellow px-5 py-2.5 text-sm font-bold text-enactus-navy hover:-translate-y-0.5"
        >
          <Plus size={16} />
          Add Partner
        </button>
      </div>

      <div className="mt-8">
        <DataTable
          columns={columns}
          rows={partners}
          keyExtractor={(p) => p.id}
          emptyTitle="No partners yet"
          emptyDescription="Add the first partner to display it on the public site."
        />
      </div>

      <PartnerFormModal
        open={modalOpen}
        initialValue={editingPartner}
        onSubmit={handleSubmit}
        onClose={() => {
          setModalOpen(false);
          setEditingPartner(null);
        }}
      />

      <ConfirmDialog
        open={pendingDelete !== null}
        title={`Delete "${pendingDelete?.name}"?`}
        description="This partner will be permanently removed from the public site."
        confirmLabel="Delete"
        onConfirm={handleDeleteConfirmed}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
