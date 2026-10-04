import React, { useState, useEffect } from "react";
import { Input } from "@mf-enterprise/ui-components";
import { Search, X } from "lucide-react";
import { useArticleSearch } from "../hooks/use-articles";
import { useNavigate } from "react-router-dom";

interface SearchBoxProps {
  onSearch?: (query: string) => void;
  showResults?: boolean;
}

export const SearchBox: React.FC<SearchBoxProps> = ({ onSearch, showResults = true }) => {
  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();
  const { data: searchResults } = useArticleSearch(query);

  useEffect(() => {
    if (onSearch) {
      onSearch(query);
    }
  }, [query, onSearch]);

  const handleSearch = (q: string) => {
    setQuery(q);
  };

  const handleResultClick = (slug: string) => {
    navigate(`/articles/${slug}`);
    setQuery("");
    setShowSuggestions(false);
  };

  const clearSearch = () => {
    setQuery("");
    setShowSuggestions(false);
  };

  return (
    <div className="relative w-full max-w-2xl">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search knowledge base articles..."
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          className="pl-10 pr-4"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {showSuggestions && showResults && query.length >= 2 && searchResults?.articles && searchResults.articles.length > 0 && (
        <div className="absolute top-full mt-2 w-full rounded-md border bg-popover shadow-lg z-50">
          {searchResults.articles.slice(0, 5).map((article) => (
            <button
              key={article.id}
              className="w-full text-left p-3 hover:bg-accent rounded-md"
              onMouseDown={(e) => {
                e.preventDefault();
                handleResultClick(article.slug);
              }}
            >
              <p className="font-medium">{article.title}</p>
              <p className="text-sm text-muted-foreground line-clamp-1">
                {article.excerpt}
              </p>
            </button>
          ))}
          {searchResults.total > 5 && (
            <button
              className="w-full text-center p-2 text-sm text-primary hover:bg-accent rounded-b-md"
              onMouseDown={(e) => {
                e.preventDefault();
                navigate("/knowledge");
                setShowSuggestions(false);
              }}
            >
              View all {searchResults.total} results
            </button>
          )}
        </div>
      )}
    </div>
  );
};
