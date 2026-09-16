import { publicApi } from "@/lib/api-client";
import type { SiteContent, Value } from "@/types/content";

export async function getSiteContent(): Promise<SiteContent> {
  const { data } = await publicApi.get<SiteContent>("/content");
  return data;
}

export async function getValues(): Promise<Value[]> {
  const { data } = await publicApi.get<Value[]>("/values");
  return data;
}
