import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";

import { useEffect } from "react";

import { ResumeInputSchema } from "@/schemas/resume";

import { ResumeInput } from "@/types/resume";

type UseResumeProps = {
  onSubmit: SubmitHandler<ResumeInput>;
};

export const useResume = ({ onSubmit }: UseResumeProps) => {
  const {
    register,
    handleSubmit,
    watch,
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

  useEffect(() => {
    const resume = getValues("resume")?.[0];
    const resumeName = resume?.name;

    setValue("resumeName", resumeName);

    if (resume && !isSubmitting) {
      handleSubmit(onSubmit)();
    }
  }, [watch("resume")]);

  const renameResumeFile = () => {
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

    handleSubmit(onSubmit)();
  };

  return {
    register,
    reset,
    renameResumeFile,
    errors,
    handleSubmit,
    isSubmitting,
    getValues,
  };
};
