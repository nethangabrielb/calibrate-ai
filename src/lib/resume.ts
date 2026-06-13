import { Resume } from "@/types/resume";

export const uploadResumeFile = async (
  file: File,
  save: boolean = true,
): Promise<{
  success: boolean;
  resume: Resume | string | null;
  error?: string;
  status?: number;
}> => {
  const formData = new FormData();
  formData.append("resume", file);

  const res = await fetch(`/api/resume?save=${save}`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json();
    return {
      success: false,
      resume: null,
      error: errorData.error || "Failed to upload resume.",
      status: res.status,
    };
  }

  const data = await res.json();

  return data;
};
