"use client";

import { useRef, useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { Send } from "lucide-react";
import { useChat } from "ai/react";
import { pdfjs } from "react-pdf";

interface PDFFile extends File {
  type: "application/pdf";
}

export default function Chat({ file }: { file: PDFFile | null }) {
  const [pdfText, setPdfText] = useState<string | null>(null);

  useEffect(() => {
    if (file) {
      convertPdfToText(file);
    } else {
      setPdfText(null);
    }
  }, [file]);

  const convertPdfToText = async (pdfFile: PDFFile) => {
    try {
      const arrayBuffer = await pdfFile.arrayBuffer();
      const pdf = await pdfjs.getDocument(arrayBuffer).promise;
      let text = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        text += content.items.map((item: any) => item.str).join(" ") + "\n";
      }
      setPdfText(text);
    } catch (error) {
      console.error("Error converting PDF to text:", error);
    }
  };

  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      api: "/api/pdfChat",
      body: { pdfContent: pdfText },
    });

  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleSubmit(event);
  };

  return (
    <div className="flex flex-col h-[600px] max-w-2xl mx-auto border rounded-lg overflow-hidden">
      <div className="bg-background p-4 border-b">
        <h2 className="text-lg font-semibold">PDF AI Chat</h2>
      </div>
      <ScrollArea className="flex-grow p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((m) => (
            <div key={m.id} className="whitespace-pre-wrap">
              {m.role === "user" ? "User: " : "AI: "}
              {m.content}
            </div>
          ))}
        </div>
      </ScrollArea>
      <div className="p-4 border-t bg-background">
        <form onSubmit={handleFormSubmit} className="flex space-x-2">
          <Input
            placeholder="Type your message..."
            value={input}
            onChange={handleInputChange}
            className="flex-grow"
          />
          <Button type="submit" size="icon" disabled={isLoading || !pdfText}>
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </div>
    </div>
  );
}
