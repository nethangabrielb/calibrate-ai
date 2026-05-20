export const uploadResumeFile = async (
  file: File,
): Promise<{
  success: boolean;
  resume: string;
  error?: string;
  status?: number;
}> => {
  const formData = new FormData();
  formData.append("resume", file);

  const res = await fetch(`/api/resume`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json();
    return {
      success: false,
      resume: "",
      error: errorData.error || "Failed to upload resume.",
      status: res.status,
    };
  }

  const data = await res.json();

  return data;
};
