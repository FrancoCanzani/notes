"use client";

import React, {
  useState,
  useRef,
  DragEvent,
  ChangeEvent,
  Dispatch,
  SetStateAction,
} from "react";
import { File } from "@phosphor-icons/react";
import { Button } from "./ui/button";
import { toast } from "sonner";

interface PDFFile extends File {
  type: "application/pdf";
}

export default function PDFDragDropInput({
  file,
  setFile,
}: {
  file: PDFFile | null;
  setFile: Dispatch<SetStateAction<PDFFile | null>>;
}) {
  const [dragActive, setDragActive] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files: FileList) => {
    if (files[0].type === "application/pdf") {
      setFile(files[0] as PDFFile);
    } else {
      toast.error("Please upload a PDF file.");
    }
  };

  const onButtonClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className="p-4 max-w-2xl w-full h-full">
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        multiple={false}
        onChange={handleChange}
        accept=".pdf"
      />
      <div
        className={`p-6 border border-dashed rounded-sm text-center cursor-pointer h-full flex-col flex items-center justify-center
          ${dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={onButtonClick}
      >
        <File className="mx-auto mb-4" size={22} />
        <p className="text-lg mb-2 text-gray-600 text-sm">
          {file ? file.name : "Drag and drop your PDF here, or click to select"}
        </p>
        {file && (
          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              File size: {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
            <Button
              size={"sm"}
              className="text-red-600 border rounded-sm bg-red-50 hover:bg-red-100 px-4"
              onClick={(e) => {
                e.stopPropagation();
                setFile(null);
              }}
            >
              Drop
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
