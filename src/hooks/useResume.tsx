import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";

import { useCallback } from "react";

import { ResumeInputSchema } from "@/schemas/resume";

import { ResumeInput } from "@/types/resume";

type UseResumeProps = {
  onSubmit: SubmitHandler<ResumeInput>;
};

export const useResume = ({ onSubmit }: UseResumeProps) => {
  const {
    register,
    handleSubmit,
    getValues,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ResumeInput>({
    resolver: zodResolver(ResumeInputSchema),
    defaultValues: {
      resume: null,
      resumeName: "",
    },
  });

  const submitIfValid = useCallback(() => {
    void handleSubmit(onSubmit)();
  }, [handleSubmit, onSubmit]);

  const syncResumeName = useCallback(
    (file: File) => {
      setValue("resumeName", file.name);
    },
    [setValue],
  );

  const resumeField = register("resume");

  const onResumeChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      resumeField.onChange(event);
      const file = event.target.files?.[0];
      if (file) {
        syncResumeName(file);
        submitIfValid();
      }
    },
    [resumeField, syncResumeName, submitIfValid],
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
    submitIfValid();
  }, [getValues, setValue, syncResumeName, submitIfValid]);

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
  };
};
