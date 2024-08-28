"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export default function NewArticleForm({
  label,
  showSubtext,
}: {
  label?: string;
  showSubtext: boolean;
}) {
  const [url, setUrl] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url) {
      router.push(`/article?url=${encodeURIComponent(url)}`);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <form onSubmit={handleSubmit} className="">
        {label && <Label>{label}</Label>}
        <div className="flex flex-1 mt-1 mb-4 rounded-md border border-bermuda-gray-50 shadow focus-within:ring-offset-0 focus-within:ring-2 focus-within:ring-bermuda-gray-200">
          <Input
            type="url"
            placeholder="https://example.com/page"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-grow border-none focus:ring-0 focus:outline-none focus:outline-0"
            required
          />
          <Button
            type="submit"
            className="px-3 bg-bermuda-gray-950 rounded-r-md rounded-l-none text-white hover:bg-bermuda-gray-900"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gray-200"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
            <span className="sr-only">Submit</span>
          </Button>
        </div>
        {showSubtext && (
          <p className="text-center text-sm text-gray-500">
            Remove paywalls, ads, and popups from any website and instantly get
            the article in a distraction free environment.
          </p>
        )}
      </form>
    </div>
  );
}
