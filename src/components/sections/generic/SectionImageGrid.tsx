import React from "react";

import type { GenericImageGrid } from "@/types/generic-page";

interface SectionImageGridProps {
  imageGrid: GenericImageGrid;
  pageTitle: string;
}

export const SectionImageGrid: React.FC<SectionImageGridProps> = ({
  imageGrid,
  pageTitle,
}) => {
  const columns = imageGrid.columns || 2;
  const aspectRatio = imageGrid.aspectRatio || "video";

  const gridColsClass =
    columns === 3
      ? "grid-cols-1 md:grid-cols-3"
      : columns === 4
        ? "grid-cols-2 md:grid-cols-4"
        : "grid-cols-1 md:grid-cols-2";

  const aspectClass =
    aspectRatio === "square"
      ? "aspect-square"
      : aspectRatio === "portrait"
        ? "aspect-[3/4]"
        : "aspect-video";

  return (
    <div className="mt-8">
      <div className={`grid gap-4 ${gridColsClass}`}>
        {imageGrid.images.map((img, idx) => (
          <div
            key={idx}
            className={`overflow-hidden rounded-2xl shadow-lg ${aspectClass}`}
          >
            <img
              src={img}
              alt={`${pageTitle} - Image ${idx + 1}`}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </div>
  );
};
