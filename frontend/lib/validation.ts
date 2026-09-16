import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});
export type LoginFormValues = z.infer<typeof loginSchema>;

export const siteContentSchema = z.object({
  enactusDescription: z.string().min(1, "This field is required"),
  enactusEnsiDescription: z.string().min(1, "This field is required"),
  mission: z.string().min(1, "This field is required"),
  vision: z.string().min(1, "This field is required"),
  mainConcept: z.string().min(1, "This field is required"),
});
export type SiteContentFormValues = z.infer<typeof siteContentSchema>;

export const valueSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  icon: z.string().optional(),
  displayOrder: z.coerce.number().int().default(0),
  active: z.boolean().default(true),
});
export type ValueFormValues = z.infer<typeof valueSchema>;

export const teamMemberSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  role: z.string().min(1, "Role is required"),
  photoUrl: z.string().optional(),
  displayOrder: z.coerce.number().int().default(0),
  active: z.boolean().default(true),
});
export type TeamMemberFormValues = z.infer<typeof teamMemberSchema>;

export const projectSchema = z.object({
  name: z.string().min(1, "Name is required"),
  shortDescription: z.string().optional(),
  fullDescription: z.string().optional(),
  context: z.string().optional(),
  solution: z.string().optional(),
  impact: z.string().optional(),
  objectives: z.string().optional(),
  coverImage: z.string().optional(),
  logo: z.string().optional(),
  category: z.string().optional(),
  status: z.enum(["IDEA", "IN_PROGRESS", "ACTIVE", "COMPLETED", "ARCHIVED"]),
  phase: z.enum(["PROBLEMATIQUE", "IDEA_STEP_1", "IDEA_STEP_2", "PILOT_STEP_1", "PILOT_STEP_2"]),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  featured: z.boolean().default(false),
  displayOrder: z.coerce.number().int().default(0),
});
export type ProjectFormValues = z.infer<typeof projectSchema>;

export const eventSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  coverImage: z.string().optional(),
  featured: z.boolean().default(false),
});
export type EventFormValues = z.infer<typeof eventSchema>;

export const eventEditionSchema = z.object({
  editionName: z.string().min(1, "Edition name is required"),
  year: z.coerce.number().int().min(2000).max(2100),
  description: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  location: z.string().optional(),
  coverImage: z.string().optional(),
  displayOrder: z.coerce.number().int().default(0),
});
export type EventEditionFormValues = z.infer<typeof eventEditionSchema>;

export const memberSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
  phone: z.string().optional(),
  photoUrl: z.string().optional(),
  department: z
    .enum(["", "SPONSORING", "MARKETING"])
    .transform((v) => (v === "" ? undefined : v)),
  role: z.string().optional(),
  active: z.boolean().default(true),
  projectIds: z.array(z.number()).default([]),
});
export type MemberFormValues = z.output<typeof memberSchema>;
/** Pre-transform shape actually held by the form fields (department can be the blank "" option). */
export type MemberFormInput = z.input<typeof memberSchema>;

export const activitySchema = z
  .object({
    type: z.enum(["FORMATION", "WORKSHOP", "MEETING"]),
    title: z.string().min(1, "Title is required"),
    activityDate: z.string().min(1, "Date is required"),
    description: z.string().optional(),
    scopeType: z.enum(["ALL", "DEPARTMENT", "PROJECT"]),
    scopeDepartment: z.enum(["SPONSORING", "MARKETING"]).optional(),
    scopeProjectId: z.coerce.number().optional(),
  })
  .refine((data) => data.scopeType !== "DEPARTMENT" || !!data.scopeDepartment, {
    message: "Select a department for this audience",
    path: ["scopeDepartment"],
  })
  .refine((data) => data.scopeType !== "PROJECT" || !!data.scopeProjectId, {
    message: "Select a project team for this audience",
    path: ["scopeProjectId"],
  });
export type ActivityFormValues = z.infer<typeof activitySchema>;

export const partnerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  logo: z.string().min(1, "Logo is required"),
  websiteUrl: z.string().optional(),
  description: z.string().optional(),
  partnerType: z.enum(["SPONSOR", "ACADEMIC", "INSTITUTIONAL", "MEDIA", "TECHNOLOGY", "OTHER"]),
  displayOrder: z.coerce.number().int().default(0),
  active: z.boolean().default(true),
});
export type PartnerFormValues = z.infer<typeof partnerSchema>;

export const documentSchema = z.object({
  title: z.string().min(1, "Title is required"),
  fileUrl: z.string().min(1, "A file is required"),
  description: z.string().optional(),
});
export type DocumentFormValues = z.infer<typeof documentSchema>;

export const pmPasswordSchema = z.object({
  password: z.string().min(4, "Password must be at least 4 characters"),
});
export type PmPasswordFormValues = z.infer<typeof pmPasswordSchema>;
