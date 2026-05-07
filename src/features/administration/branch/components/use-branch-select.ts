import { useEffect, useState } from "react";
import { useBranchList } from "../api/branch-queries";

export function useBranchSelect() {
  const [searchInput, setSearchInput] = useState("");
  const [debounced, setDebounced] = useState("");

  useEffect(() => {
    const id = setTimeout(() => setDebounced(searchInput.trim()), 400);
    return () => clearTimeout(id);
  }, [searchInput]);

  const { data: branches = [], isLoading } = useBranchList({
    per_page: 100,
    search: debounced || undefined,
  });

  return {
    branches,
    isLoading,
    onSearchChange: setSearchInput,
  };
}
