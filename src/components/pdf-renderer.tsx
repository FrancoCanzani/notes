"use client";

import { useState } from "react";
import PDFDragDropInput from "./pdf-dd-input";
import PDFViewer from "./pdf-viewer";
import { PDFFile } from "../lib/types";

export default function PdfRenderer() {
  const [file, setFile] = useState<PDFFile | null>(null);

  return (
    <main>
      <header className="w-full p-3 font-medium capitalize">pdf.ai</header>
      <div className="flex items-center justify-center">
        <div className="w-1/2">
          {file ? (
            <PDFViewer file={file} />
          ) : (
            <PDFDragDropInput file={file} setFile={setFile} />
          )}
        </div>
        <p className="w-1/2">Other half</p>
      </div>
    </main>
  );
}
