"use client";

import {
  FormState,
  UseFormRegister,
  UseFormRegisterReturn,
} from "react-hook-form";

import { useRef } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export function CreateAnalysisDialog({
  register,
  resumeField,
  onResumeChange,
  errors,
  handleSubmit,
  isSubmitting,
  buttonText,
  isOpen,
  setIsOpen,
  reset,
  resumeName,
  renameResume,
}: Readonly<{
  register: UseFormRegister<{
    resume: FileList | null;
    resumeName?: string;
  }>;
  resumeField: UseFormRegisterReturn<"resume">;
  onResumeChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  errors: FormState<{
    resume: FileList | null;
    resumeName?: string;
  }>["errors"];
  handleSubmit: React.SubmitEventHandler<HTMLFormElement>;
  isSubmitting: boolean;
  buttonText?: string;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  reset: () => void;
  resumeName?: string;
  renameResume: () => void;
}>) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const uploadHandler = () => {
    reset();
    fileInputRef.current?.click();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-fit cursor-pointer">
          {buttonText || "Run AI Analysis"}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-sm">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <DialogHeader>
            <DialogTitle>Run AI Analysis</DialogTitle>
            <DialogDescription>
              Upload your resume to get personalized insights and
              recommendations on how to improve your job application.
            </DialogDescription>
          </DialogHeader>
          <Field className="flex flex-col gap-2">
            {errors?.resume?.message ===
            "Resume with this name already exists." ? (
              <>
                <Input
                  placeholder="Enter a new name for your resume"
                  {...register("resumeName")}
                  defaultValue={resumeName ?? ""}
                />
                <p className="text-destructive text-sm">
                  A resume with this name already exists. Please rename your
                  file and try again.
                </p>
                <Button
                  type="button"
                  disabled={isSubmitting}
                  onClick={renameResume}
                >
                  {isSubmitting ? "Uploading..." : "Upload Resume"}
                </Button>
              </>
            ) : (
              <>
                <p className="text-muted-foreground text-xs">
                  Supported formats: PDF
                </p>
                <Button
                  type="button"
                  onClick={uploadHandler}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Uploading..." : "Upload Resume"}
                </Button>
                <input
                  type="file"
                  placeholder="Enter your resume here"
                  name={resumeField.name}
                  onBlur={resumeField.onBlur}
                  onChange={onResumeChange}
                  className="invisible absolute h-0 w-0"
                  accept=".pdf"
                  ref={(element) => {
                    resumeField.ref(element);
                    fileInputRef.current = element;
                  }}
                />
              </>
            )}
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            {errors?.resume &&
              errors?.resume?.message !==
                "Resume with this name already exists." && (
                <p className="text-destructive text-sm">
                  {errors?.resume?.message}
                </p>
              )}
          </Field>
        </form>
      </DialogContent>
    </Dialog>
  );
}
