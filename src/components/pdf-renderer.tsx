"use client";

import { useState } from "react";
import PDFDragDropInput from "./pdf-dd-input";
import PDFViewer from "./pdf-viewer";
import { PDFFile } from "../lib/types";
import Chat from "./chat";

export default function PdfRenderer() {
  const [file, setFile] = useState<PDFFile | null>(null);

  return (
    <main className="flex flex-col h-screen">
      <header className="w-full p-3 font-medium capitalize">pdf.ai</header>
      <div className="flex flex-grow">
        <div className="w-1/2 bg-bermuda-gray-50">
          {file ? (
            <PDFViewer file={file} />
          ) : (
            <PDFDragDropInput file={file} setFile={setFile} />
          )}
        </div>
        <div className="w-1/2">
          <Chat file={file}/>
        </div>
      </div>
    </main>
  );
}
