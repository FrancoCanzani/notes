"use client";

import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  RotateCw,
  RotateCcw,
} from "lucide-react";
import { PDFFile } from "../lib/types";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function Component({ file }: { file: PDFFile }) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [rotation, setRotation] = useState<number>(0);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setPageNumber(1);
  }

  function changePage(offset: number) {
    setPageNumber((prevPageNumber) =>
      Math.min(Math.max(prevPageNumber + offset, 1), numPages)
    );
  }

  function changeScale(newScale: number) {
    setScale((prevScale) => Math.min(Math.max(prevScale + newScale, 0.5), 2));
  }

  function rotate(angle: number) {
    setRotation((prevRotation) => (prevRotation + angle) % 360);
  }

  return (
    <div className="flex flex-col items-center bg-background text-foreground">
      <div className="flex items-center justify-between w-full max-w-3xl p-4 bg-muted">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => changePage(-1)}
            disabled={pageNumber <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center space-x-1">
            <Input
              type="number"
              min={1}
              max={numPages}
              className="w-16 text-center"
              value={pageNumber}
              onChange={(e) => setPageNumber(parseInt(e.target.value))}
            />
            <span>/ {numPages}</span>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => changePage(1)}
            disabled={pageNumber >= numPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => changeScale(-0.1)}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-sm">{Math.round(scale * 100)}%</span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => changeScale(0.1)}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => rotate(-90)}>
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => rotate(90)}>
            <RotateCw className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="border rounded-lg shadow-lg overflow-auto max-h-[calc(100vh-150px)] mt-4">
        <Document
          file={file}
          onLoadSuccess={onDocumentLoadSuccess}
          className="flex flex-col items-center"
        >
          <Page
            pageNumber={pageNumber}
            scale={scale}
            rotate={rotation}
            renderAnnotationLayer={false}
            renderTextLayer={false}
          />
        </Document>
      </div>
    </div>
  );
}
