"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowDown, ArrowUp, Pencil, Plus, Trash2 } from "lucide-react";
import { siteContentSchema, type SiteContentFormValues, type ValueFormValues } from "@/lib/validation";
import FormField, { inputClassName } from "@/components/admin/FormField";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import ValueFormModal from "@/components/admin/ValueFormModal";
import EmptyState from "@/components/admin/EmptyState";
import {
  createValue,
  deleteValue,
  getAdminContent,
  listAdminValues,
  reorderValues,
  updateAdminContent,
  updateValue,
} from "@/services/admin/content";
import type { AdminValue } from "@/types/content";

export default function AdminContentPage() {
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [values, setValues] = useState<AdminValue[]>([]);
  const [editingValue, setEditingValue] = useState<AdminValue | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<AdminValue | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SiteContentFormValues>({ resolver: zodResolver(siteContentSchema) });

  useEffect(() => {
    Promise.all([getAdminContent(), listAdminValues()])
      .then(([content, valuesList]) => {
        reset(content);
        setValues(valuesList);
      })
      .finally(() => setLoading(false));
  }, [reset]);

  async function onSubmitContent(values: SiteContentFormValues) {
    setSaved(false);
    await updateAdminContent(values);
    setSaved(true);
  }

  async function refreshValues() {
    setValues(await listAdminValues());
  }

  async function handleValueSubmit(formValues: ValueFormValues) {
    if (editingValue) {
      await updateValue(editingValue.id, formValues);
    } else {
      await createValue(formValues);
    }
    setModalOpen(false);
    setEditingValue(null);
    await refreshValues();
  }

  async function handleDeleteConfirmed() {
    if (!pendingDelete) return;
    await deleteValue(pendingDelete.id);
    setPendingDelete(null);
    await refreshValues();
  }

  async function moveValue(index: number, direction: -1 | 1) {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= values.length) return;
    const reordered = [...values];
    [reordered[index], reordered[targetIndex]] = [reordered[targetIndex], reordered[index]];
    setValues(reordered);
    await reorderValues(reordered.map((v) => v.id));
  }

  if (loading) {
    return <p className="text-sm text-enactus-dark-gray">Loading content...</p>;
  }

  return (
    <div className="space-y-10">
      <section className="rounded-2xl border border-enactus-light-gray/30 bg-white p-6 sm:p-8">
        <h2 className="text-lg font-bold text-enactus-navy">Site Content</h2>
        <p className="mt-1 text-sm text-enactus-dark-gray">
          This text powers the Home and About pages across the public site.
        </p>

        <form className="mt-6 space-y-5" onSubmit={handleSubmit(onSubmitContent)} noValidate>
          <FormField label="What is Enactus?" htmlFor="enactusDescription" error={errors.enactusDescription?.message} required>
            <textarea id="enactusDescription" rows={3} className={inputClassName} {...register("enactusDescription")} />
          </FormField>
          <FormField label="Enactus ENSI" htmlFor="enactusEnsiDescription" error={errors.enactusEnsiDescription?.message} required>
            <textarea id="enactusEnsiDescription" rows={3} className={inputClassName} {...register("enactusEnsiDescription")} />
          </FormField>
          <FormField label="Mission" htmlFor="mission" error={errors.mission?.message} required>
            <textarea id="mission" rows={3} className={inputClassName} {...register("mission")} />
          </FormField>
          <FormField label="Vision" htmlFor="vision" error={errors.vision?.message} required>
            <textarea id="vision" rows={3} className={inputClassName} {...register("vision")} />
          </FormField>
          <FormField label="Main concept" htmlFor="mainConcept" error={errors.mainConcept?.message} required>
            <textarea id="mainConcept" rows={3} className={inputClassName} {...register("mainConcept")} />
          </FormField>

          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-full bg-enactus-navy px-6 py-2.5 text-sm font-semibold text-white hover:bg-enactus-navy/90 disabled:opacity-60"
            >
              {isSubmitting ? "Saving..." : "Save changes"}
            </button>
            {saved && <span className="text-sm font-medium text-green-700">Saved successfully.</span>}
          </div>
        </form>
      </section>

      <section className="rounded-2xl border border-enactus-light-gray/30 bg-white p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-enactus-navy">Values</h2>
            <p className="mt-1 text-sm text-enactus-dark-gray">Shown on the Home and About pages.</p>
          </div>
          <button
            type="button"
            onClick={() => {
              setEditingValue(null);
              setModalOpen(true);
            }}
            className="inline-flex items-center gap-2 rounded-full bg-enactus-yellow px-5 py-2.5 text-sm font-bold text-enactus-navy hover:-translate-y-0.5"
          >
            <Plus size={16} />
            Add Value
          </button>
        </div>

        {values.length === 0 ? (
          <div className="mt-6">
            <EmptyState title="No values yet" description="Add the first core value shown on the public site." />
          </div>
        ) : (
          <ul className="mt-6 divide-y divide-enactus-light-gray/20">
            {values.map((value, index) => (
              <li key={value.id} className="flex items-center justify-between gap-4 py-4">
                <div>
                  <p className="font-semibold text-enactus-navy">
                    {value.title}
                    {!value.active && (
                      <span className="ml-2 rounded-full bg-enactus-light-gray/30 px-2 py-0.5 text-xs font-medium text-enactus-dark-gray">
                        Inactive
                      </span>
                    )}
                  </p>
                  {value.description && (
                    <p className="mt-1 max-w-xl text-sm text-enactus-dark-gray">{value.description}</p>
                  )}
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <button
                    type="button"
                    aria-label="Move up"
                    onClick={() => moveValue(index, -1)}
                    disabled={index === 0}
                    className="rounded-md p-2 text-enactus-navy hover:bg-enactus-light-gray/15 disabled:opacity-30"
                  >
                    <ArrowUp size={16} />
                  </button>
                  <button
                    type="button"
                    aria-label="Move down"
                    onClick={() => moveValue(index, 1)}
                    disabled={index === values.length - 1}
                    className="rounded-md p-2 text-enactus-navy hover:bg-enactus-light-gray/15 disabled:opacity-30"
                  >
                    <ArrowDown size={16} />
                  </button>
                  <button
                    type="button"
                    aria-label="Edit value"
                    onClick={() => {
                      setEditingValue(value);
                      setModalOpen(true);
                    }}
                    className="rounded-md p-2 text-enactus-navy hover:bg-enactus-light-gray/15"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    type="button"
                    aria-label="Delete value"
                    onClick={() => setPendingDelete(value)}
                    className="rounded-md p-2 text-red-600 hover:bg-red-50"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <ValueFormModal
        open={modalOpen}
        initialValue={editingValue}
        onSubmit={handleValueSubmit}
        onClose={() => {
          setModalOpen(false);
          setEditingValue(null);
        }}
      />

      <ConfirmDialog
        open={pendingDelete !== null}
        title={`Delete "${pendingDelete?.title}"?`}
        description="This value will be permanently removed from the public site."
        confirmLabel="Delete"
        onConfirm={handleDeleteConfirmed}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
