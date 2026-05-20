"use client";

import { FormState, UseFormRegister } from "react-hook-form";

import { useRef } from "react";

import { TextField } from "@/components/input";
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

export function CreateAnalysisDialog({
  register,
  errors,
  handleSubmit,
  isSubmitting,
  buttonText,
  isOpen,
  setIsOpen,
  reset,
}: Readonly<{
  register: UseFormRegister<{ resume: FileList | null }>;
  errors: FormState<{ resume: FileList | null }>["errors"];
  handleSubmit: React.SubmitEventHandler<HTMLFormElement>;
  isSubmitting: boolean;
  buttonText?: string;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  reset: () => void;
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
      <DialogContent className="sm:max-w-sm max-h-[85vh] overflow-y-auto">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <DialogHeader>
            <DialogTitle>Run AI Analysis</DialogTitle>
            <DialogDescription>
              Upload your resume to get personalized insights and
              recommendations on how to improve your job application.
            </DialogDescription>
          </DialogHeader>
          <Field className="flex flex-col gap-2">
            <p className="text-xs text-muted-foreground">
              Supported formats: PDF
            </p>
            <Button onClick={uploadHandler} disabled={isSubmitting}>
              {isSubmitting ? "Uploading..." : "Upload Resume"}
            </Button>
            <input
              type="file"
              placeholder="Enter your resume here"
              {...register("resume")}
              className="invisible h-0 w-0 absolute"
              accept=".pdf"
              ref={(e) => {
                register("resume").ref(e);
                fileInputRef.current = e;
              }}
            />
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            {errors.resume && (
              <p className="text-sm text-destructive">
                {errors.resume.message}
              </p>
            )}
          </Field>

          {/* <DialogFooter className="pt-0">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Analyzing..." : "Analyze"}
            </Button>
          </DialogFooter> */}
        </form>
      </DialogContent>
    </Dialog>
  );
}
