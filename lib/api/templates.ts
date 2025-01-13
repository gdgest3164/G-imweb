import { Template } from "@/lib/types";
import { supabase } from "@/lib/supabase";
import { cache } from "react";

export const getTemplate = cache(async (slug: string) => {
  const { data, error } = await supabase.from("templates").select("*").eq("id", slug).single();

  if (error) throw error;
  if (!data) throw new Error("Template not found");

  return data;
});

export async function createTemplate(data: Pick<Template, "title" | "description" | "content">) {
  const { data: template, error: templateError } = await supabase.from("templates").insert(data).select().single();

  if (templateError) {
    throw new Error("Failed to create template");
  }

  const response = await fetch(`/api/templates/${template.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ template: data }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create template files");
  }

  return template;
}

export async function updateTemplate(id: string, data: Partial<Template>) {
  const response = await fetch(`/api/templates/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ template: data }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to update template");
  }

  return { message: "Template updated successfully" };
}

export async function deleteTemplate(id: string) {
  const response = await fetch(`/api/templates/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to delete template");
  }

  return { message: "Template deleted successfully" };
}
