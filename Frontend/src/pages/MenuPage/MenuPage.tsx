import { MenuSkeleton } from "@/components/skeletons";
import { useMenuData } from "@/hooks/queries";
import { MenuPageContent } from "./MenuPageContent";

/**
 * Page shell — responsible only for data fetching and loading/error states.
 * All UI logic lives in MenuPageContent and its sub-components.
 */
export const MenuPage = () => {
  const { data: menuData, isLoading } = useMenuData();

  if (isLoading) {
    return <MenuSkeleton />;
  }

  if (!menuData?.categories?.length) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        <p>No menu data available.</p>
      </div>
    );
  }

  return <MenuPageContent categories={menuData.categories} />;
};

export default MenuPage;
