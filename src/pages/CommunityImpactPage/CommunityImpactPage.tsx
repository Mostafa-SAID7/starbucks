import React from "react";
import { GenericPage, type GenericPageData } from "@/pages/GenericPage";
import { communityImpact } from "@/data";

export const CommunityImpactPage: React.FC = () => {
  return (
    <GenericPage
      data={communityImpact as GenericPageData}
      seoTitle="Community Impact - Starbucks Egypt"
    />
  );
};

export default CommunityImpactPage;
