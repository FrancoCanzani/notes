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
    <div className="">
      <input
        type="text"
        placeholder="Search notes..."
        value={searchQuery}
        onChange={handleChange}
        className="w-full px-3 py-1 rounded-sm border border-gray-300"
      />
    </div>
  );
}
