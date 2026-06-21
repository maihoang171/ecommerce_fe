import { NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useCategoryStore } from "@/stores/useCategoryStore";
import { useEffect, useState } from "react";
import { useGetCategoryList } from "@/hooks/useCategory";
import { useNavigate } from "react-router-dom";
import type { IParentCategory } from "@/services/category";

export const CategoryNav = () => {
  const { handleGetCategoryList } = useGetCategoryList();

  useEffect(() => {
    handleGetCategoryList();
  }, []);

  const { categoryList, activeCategory, setActiveCategory } =
    useCategoryStore();

  const navigate = useNavigate();

  const [isOpenMenu, setIsOpenMenu] = useState(false);

  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);

  const displayCategory = hoveredSlug
    ? categoryList.find((c) => c.slug === hoveredSlug)
    : activeCategory;

  const handleSelectCategory = (category: IParentCategory) => {
    setActiveCategory(category);
    navigate(`/category/${category.slug}`);
  };

  return (
    <>
      {/* =======MOBILE ONLY: Dropdown Menu */}
      <div className="md:hidden flex items-center">
        <button
          aria-label={isOpenMenu ? "Close menu" : "Open menu"}
          onClick={() => setIsOpenMenu(!isOpenMenu)}
        >
          {isOpenMenu ? (
            <X className="w-6 h-6"></X>
          ) : (
            <Menu className="w-6 h-6"></Menu>
          )}
        </button>

        <div
          className={`fixed top-14 left-0 border-b h-full w-full bg-white ${isOpenMenu ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-2"} duration-300 ease-in-out`}
        >
          <div className="flex flex-row justify-between px-5 py-2 gap-2 border-b border-gray-300">
            {categoryList.map((c) => {
              const isSelected = activeCategory?.slug === c.slug;
              return (
                <button
                  key={c.id}
                  onClick={() => handleSelectCategory(c)}
                  className={`border-b-2 -mb-2.5 ${isSelected ? "text-black border-black" : "text-gray-500 border-transparent hover:text-black"} cursor-pointer`}
                >
                  {c.name}
                </button>
              );
            })}
          </div>

          <div className="flex flex-col p-5 gap-2">
            {activeCategory?.campaigns.map((c) => (
              <NavLink
                key={c.id}
                className="hover:text-gray-500"
                to={c.linkUrl}
                onClick={() => setIsOpenMenu(false)}
              >
                <span className="font-semibold lowercase">
                  New Collection:{" "}
                </span>{" "}
                {c.title}
              </NavLink>
            ))}

            {activeCategory?.children.map((child) => (
              <NavLink
                key={child.id}
                className="hover:text-gray-500"
                to={`/category/${activeCategory.slug}/${child.slug}`}
                onClick={() => setIsOpenMenu(false)}
              >
                {child.name}
              </NavLink>
            ))}
          </div>
        </div>
      </div>

      {/* =======DESKTOP ONLY: Tabs */}
      <div className="hidden md:flex flex-row gap-3">
        {categoryList.map((c) => {
          const isSelected = activeCategory?.slug === c.slug;
          return (
            <div
              key={c.id}
              className="py-5 group"
              onMouseEnter={() => setHoveredSlug(c.slug)}
              onMouseLeave={() => setHoveredSlug(null)}
            >
              <button
                className={`transition-colors duration-300 text-lg font-medium
          ${isSelected ? "text-black" : "text-gray-400"} cursor-pointer 
          `}
                onClick={() => handleSelectCategory(c)}
              >
                {c.name}
              </button>

              <div
                className={`fixed top-16 bg-black/50 bg- w-full h-full  ${hoveredSlug === c.slug ? "opacity-100" : "opacity-0"} transition-opacity duration-300 pointer-events-none`}
              ></div>

              <div
                className="fixed top-14 left-0 flex flex-col z-50 p-5 gap-2 h-full w-120 bg-white  
            // close 
              opacity-0  invisible -translate-x-full transition-all duration-300 ease-in-out
              // open 
               group-hover:opacity-100 group-hover:visible group-hover:translate-x-0 
        
            "
              >
                {displayCategory?.campaigns.map((campaign) => (
                  <NavLink
                    key={campaign.id}
                    className="hover:text-gray-500"
                    to={campaign.linkUrl}
                  >
                    <span className="font-semibold lowercase">
                      New Collection:{" "}
                    </span>{" "}
                    {campaign.title}
                  </NavLink>
                ))}

                {displayCategory?.children.map((child) => (
                  <NavLink
                    key={child.id}
                    className="hover:text-gray-500"
                    to={`/category/${displayCategory.slug}/${child.slug}`}
                  >
                    {child.name}
                  </NavLink>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};
