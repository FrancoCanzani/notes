import React, { useState } from "react";

export default function SearchNotesForm({
  onSearch,
}: {
  onSearch: (query: string) => void;
}) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <input
      type="text"
      placeholder="Search notes..."
      value={searchQuery}
      onChange={handleChange}
      className="w-full px-3 py-2 mb-1 rounded-sm border border-bermuda-gray-100"
    />
  );
}
