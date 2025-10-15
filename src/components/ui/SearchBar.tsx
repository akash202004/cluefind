import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
  value?: string;
}

export default function SearchBar({
  onSearch,
  placeholder = "Search by name, skills, bio, projects, or technologies...",
  className = "",
  value = "",
}: SearchBarProps) {
  const [query, setQuery] = useState(value);

  // Update internal state when external value changes
  useEffect(() => {
    setQuery(value);
  }, [value]);

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onSearch(query);
    }, 300); // 300ms debounce delay

    return () => clearTimeout(timeoutId);
  }, [query, onSearch]);

  const handleClear = () => {
    setQuery("");
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-muted-foreground" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="block w-full pl-10 pr-10 py-3 border-3 border-primary rounded-lg bg-background text-foreground placeholder-muted-foreground font-bold uppercase text-sm tracking-wide shadow-brutalist-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
}
