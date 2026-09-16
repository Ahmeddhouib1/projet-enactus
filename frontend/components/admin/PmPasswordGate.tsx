"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { KeyRound, User } from "lucide-react";
import { pmPasswordSchema, type PmPasswordFormValues } from "@/lib/validation";
import FormField, { inputClassName } from "@/components/admin/FormField";
import { listMembers, setPmPassword, verifyPmPassword } from "@/services/admin/members";
import { canAccessProjectSpace } from "@/lib/space-access";
import type { Member } from "@/types/member";

const SESSION_KEY_PREFIX = "enactus_pm_unlocked_";

interface PmPasswordGateProps {
  onUnlock: (member: Member) => void;
  /** Which members may open this space. Defaults to the Project Space rule (assigned PMs + Team/Vice Team Leader). */
  filter?: (member: Member) => boolean;
  heading?: string;
  subheading?: string;
  emptyMessage?: string;
}

export default function PmPasswordGate({
  onUnlock,
  filter = canAccessProjectSpace,
  heading = "Who are you?",
  subheading = 'Select your name to open your Project Space. Only members whose role is set to "Project Manager" (and are assigned to a project team), or the Team Leader / Vice Team Leader, appear here.',
  emptyMessage = 'No member is eligible yet - set their role from the Members page, and assign Project Managers to a project team.',
}: PmPasswordGateProps) {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Member | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PmPasswordFormValues>({ resolver: zodResolver(pmPasswordSchema) });

  useEffect(() => {
    listMembers()
      .then((all) => setMembers(all.filter(filter)))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function selectMember(member: Member) {
    setServerError(null);
    reset({ password: "" });
    try {
      if (sessionStorage.getItem(SESSION_KEY_PREFIX + member.id) === "1") {
        onUnlock(member);
        return;
      }
    } catch {
      // sessionStorage unavailable - fall through to asking for the password.
    }
    setSelected(member);
  }

  async function submit(values: PmPasswordFormValues) {
    if (!selected) return;
    setServerError(null);
    try {
      if (selected.hasPmPassword) {
        const valid = await verifyPmPassword(selected.id, values.password);
        if (!valid) {
          setServerError("Incorrect password.");
          return;
        }
      } else {
        await setPmPassword(selected.id, values.password);
      }
      try {
        sessionStorage.setItem(SESSION_KEY_PREFIX + selected.id, "1");
      } catch {
        // ignore - unlock still works for this page load
      }
      onUnlock(selected);
    } catch {
      setServerError("Something went wrong. Please try again.");
    }
  }

  if (loading) {
    return <p className="text-sm text-enactus-dark-gray">Loading...</p>;
  }

  if (!selected) {
    return (
      <div className="mx-auto max-w-xl">
        <h2 className="text-base font-bold text-enactus-navy">{heading}</h2>
        <p className="mt-1 text-sm text-enactus-dark-gray">{subheading}</p>
        {members.length === 0 ? (
          <p className="mt-6 text-sm text-enactus-dark-gray">{emptyMessage}</p>
        ) : (
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {members.map((member) => (
              <li key={member.id}>
                <button
                  type="button"
                  onClick={() => selectMember(member)}
                  className="flex w-full items-center gap-3 rounded-xl border border-enactus-light-gray/40 bg-white p-4 text-left transition-colors hover:border-enactus-yellow hover:bg-enactus-yellow/5"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-enactus-navy text-enactus-yellow">
                    <User size={16} />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-enactus-navy">{member.fullName}</span>
                    <span className="block text-xs text-enactus-dark-gray">
                      {member.role || `${member.projects.length} project team${member.projects.length > 1 ? "s" : ""}`}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-sm">
      <button
        type="button"
        onClick={() => setSelected(null)}
        className="text-xs font-semibold text-enactus-dark-gray hover:underline"
      >
        &larr; Not {selected.fullName}?
      </button>

      <div className="mt-4 flex items-center gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-enactus-navy text-enactus-yellow">
          <KeyRound size={18} />
        </span>
        <div>
          <h2 className="text-base font-bold text-enactus-navy">{selected.fullName}</h2>
          <p className="text-xs text-enactus-dark-gray">
            {selected.hasPmPassword ? "Enter your password to continue." : "First time here - set a password."}
          </p>
        </div>
      </div>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit(submit)} noValidate>
        <FormField
          label={selected.hasPmPassword ? "Password" : "Choose a password"}
          htmlFor="pm-password"
          error={errors.password?.message}
          required
        >
          <input
            id="pm-password"
            type="password"
            autoComplete={selected.hasPmPassword ? "current-password" : "new-password"}
            className={inputClassName}
            {...register("password")}
          />
        </FormField>

        {serverError && (
          <p className="rounded-lg bg-red-50 px-4 py-2.5 text-sm font-medium text-red-700" role="alert">
            {serverError}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-full bg-enactus-yellow px-6 py-2.5 text-sm font-bold uppercase tracking-wide text-enactus-navy disabled:opacity-60"
        >
          {isSubmitting ? "Please wait..." : selected.hasPmPassword ? "Unlock" : "Set password & continue"}
        </button>
      </form>
    </div>
  );
}
