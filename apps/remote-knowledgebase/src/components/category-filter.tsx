import React from "react";
import { Button, Badge } from "@mf-enterprise/ui-components";
import { ArticleCategory } from "../types";

interface CategoryFilterProps {
  categories: ArticleCategory[];
  selectedCategory: string | null;
  onSelect: (category: string | null) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onSelect
}) => {
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant={selectedCategory === null ? "default" : "outline"}
        size="sm"
        onClick={() => onSelect(null)}
      >
        All
      </Button>
      {categories.map((category) => (
        <Button
          key={category.id}
          variant={selectedCategory === category.slug ? "default" : "outline"}
          size="sm"
          onClick={() => onSelect(category.slug)}
        >
          {category.name}
          <Badge variant="secondary" className="ml-2">
            {category.articleCount}
          </Badge>
        </Button>
      ))}
    </div>
  );
};
