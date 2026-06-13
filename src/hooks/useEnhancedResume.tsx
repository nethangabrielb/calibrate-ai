import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";

import { useCallback, useEffect, useState } from "react";

import { EnhancedResumeInputSchema } from "@/schemas/resume";

import { EnhancedResumeInput } from "@/types/resume";

type UseEnhancedResumeProps = {
  onSubmit?: SubmitHandler<EnhancedResumeInput>;
};

export const useEnhancedResume = ({ onSubmit }: UseEnhancedResumeProps) => {
  const [hasCompleteFields, setHasCompleteFields] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    getValues,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<EnhancedResumeInput>({
    resolver: zodResolver(EnhancedResumeInputSchema),
    mode: "onChange",
    defaultValues: {
      resume: null,
      resumeName: "",
      jobDescription: "",
    },
  });

  useEffect(() => {
    const resume = getValues("resume");
    const jobDescription = getValues("jobDescription");
    if (resume && jobDescription && !errors.resume && !errors.jobDescription) {
      setHasCompleteFields(true);
    } else {
      setHasCompleteFields(false);
    }
  }, [watch("jobDescription"), watch("resume")]);

  const syncResumeName = useCallback(
    (file: File) => {
      setValue("resumeName", file.name);
    },
    [setValue],
  );

  const resumeField = register("resume");

  const onResumeChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      resumeField.onChange(event);
      const file = event.target.files?.[0];
      if (file) {
        syncResumeName(file);
      }
    },
    [resumeField, syncResumeName],
  );

  const renameResumeFile = useCallback(() => {
    const resumeName = getValues("resumeName");
    const resumeFile = getValues("resume")?.[0];
    if (!resumeFile) return;

    const newName = resumeName?.trim() || resumeFile.name;
    const renamedFile = new File([resumeFile], newName, {
      type: resumeFile.type,
    });

    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(renamedFile);

    setValue("resume", dataTransfer.files, {
      shouldDirty: true,
      shouldValidate: true,
    });
    syncResumeName(renamedFile);
  }, [getValues, setValue, syncResumeName]);

  return {
    register,
    reset,
    renameResumeFile,
    resumeField,
    onResumeChange,
    errors,
    handleSubmit,
    isSubmitting,
    getValues,
    watch,
    hasCompleteFields,
  };
};
