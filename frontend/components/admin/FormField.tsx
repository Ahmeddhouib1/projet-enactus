interface FormFieldProps {
  label: string;
  htmlFor?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}

export default function FormField({ label, htmlFor, error, hint, required, children }: FormFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-semibold text-enactus-navy">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-enactus-dark-gray">{hint}</p>}
      {error && (
        <p className="text-xs font-medium text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export const inputClassName =
  "w-full rounded-lg border border-enactus-light-gray/50 bg-white px-4 py-2.5 text-sm text-enactus-navy placeholder:text-enactus-light-gray focus:border-enactus-navy focus:outline-none focus:ring-2 focus:ring-enactus-yellow/40";
