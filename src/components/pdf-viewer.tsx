"use client";

import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Button } from "./ui/button";
import {
  CaretLeft,
  CaretRight,
  ArrowClockwise,
  ArrowCounterClockwise,
  MagnifyingGlassMinus,
  MagnifyingGlassPlus,
} from "@phosphor-icons/react";
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
    <div className="flex flex-col items-center max-w-2xl border h-full">
      <div className="flex items-center justify-between w-full text-sm py-1 border-b">
        <div className="flex items-center space-x-2">
          <Button
            variant="menu"
            size="sm"
            onClick={() => changePage(-1)}
            disabled={pageNumber <= 1}
          >
            <CaretLeft />
          </Button>
          <div className="flex items-center justify-center">
            <input
              type="number"
              min={1}
              max={numPages}
              className="text-center bg-transparent focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              value={pageNumber}
              onChange={(e) => {
                if (parseInt(e.target.value) > numPages) {
                  setPageNumber(numPages);
                }
                setPageNumber(parseInt(e.target.value));
              }}
            />
            <span>/ {numPages}</span>
          </div>
          <Button
            variant="menu"
            size="sm"
            onClick={() => changePage(1)}
            disabled={pageNumber >= numPages}
          >
            <CaretRight />
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="menu" size="sm" onClick={() => changeScale(-0.1)}>
            <MagnifyingGlassMinus />
          </Button>
          <span className="text-sm">{Math.round(scale * 100)}%</span>
          <Button variant="menu" size="sm" onClick={() => changeScale(0.1)}>
            <MagnifyingGlassPlus />
          </Button>
          <Button variant="menu" size="sm" onClick={() => rotate(-90)}>
            <ArrowClockwise />
          </Button>
          <Button variant="menu" size="sm" onClick={() => rotate(90)}>
            <ArrowCounterClockwise />
          </Button>
        </div>
      </div>
      <div className="overflow-auto max-h-[calc(100vh-115px)] max-w-2xl">
        <Document
          file={file}
          onLoadSuccess={onDocumentLoadSuccess}
          className={"py-2"}
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
