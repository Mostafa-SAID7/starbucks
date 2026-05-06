import React from "react";
import { GenericPage, type GenericPageData } from "@/pages/GenericPage";
import { privacyStatement } from "@/data";

export const PrivacyStatementPage: React.FC = () => {
  // Remove the sidebar object since GenericPage expects a React component
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { sidebar, ...dataWithoutSidebar } = privacyStatement;

  return (
    <GenericPage
      data={dataWithoutSidebar as unknown as GenericPageData}
      seoTitle="Privacy Statement - Starbucks Egypt"
      showAccordion={true}
      accordionSectionIndices={[1, 2, 3, 4]}
    />
  );
};

export default PrivacyStatementPage;
