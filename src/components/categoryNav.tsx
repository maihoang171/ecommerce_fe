import { NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useCategoryListStore } from "../stores/useCategoryStore";
import { useEffect, useState } from "react";
import type { IParentCategory } from "../services/auth";

export const CategoryNav = () => {
  const {
    categoryList,
    clickedCategoryId,
    setClickedCategoryId,
    activeCategory,
    setActiveCategory,
  } = useCategoryListStore();

  const handleClickCategory = (category: IParentCategory) => {
    setActiveCategory(category);
    setClickedCategoryId(category.id);
  };

  const [isOpenMenu, setIsOpenMenu] = useState(false);

  useEffect(() => {
    if (categoryList.length > 0 && !clickedCategoryId) {
      setActiveCategory(categoryList[0]);
      setClickedCategoryId(categoryList[0].id);
    }
  }, [
    categoryList,
    clickedCategoryId,
    setClickedCategoryId,
    setActiveCategory,
  ]);

  return (
    <>
      {/* =======MOBILE ONLY: Dropdown Menu */}
      <div className="md:hidden flex items-center">
        <button 
        aria-label={isOpenMenu ? "Close menu" : "Open menu"}
         onClick={() => setIsOpenMenu(!isOpenMenu)}>
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
              const isSelected = activeCategory?.id === c.id;
              return (
                <div
                  key={c.id}
                  className={`border-b-2 -mb-2.5 ${isSelected ? "text-black hover:text-black border-black" : "text-gray-500 border-transparent"} hover:cursor-pointer `}
                  onClick={() => handleClickCategory(c)}
                >
                  {c.name}
                </div>
              );
            })}
          </div>
          <div className="flex flex-col p-5 gap-2">
            {activeCategory?.campaigns.map((c) => (
              <NavLink
                key={c.id}
                className="hover:text-gray-500"
                to={c.linkUrl}
              >
                {c.title}
              </NavLink>
            ))}

            {activeCategory?.children.map((c) => (
              <div className="">
                <NavLink
                  key={c.id}
                  className="hover:text-gray-500"
                  to={`/category/${c.slug}`}
                >
                  {c.name}
                </NavLink>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* =======DESKTOP ONLY: Tabs */}
      <div className="hidden md:flex flex-row gap-3">
        {categoryList.map((c) => {
          return (
            <div
              key={c.id}
              className="group py-5"
              onClick={() => handleClickCategory(c)}
            >
              <div className="text-gray-500 transition-colors hover:cursor-pointer border-b-2 border-transparent group-hover:text-black group-hover:border-black">
                {c.name}
              </div>
              <div
                className="fixed top-14 left-0 flex flex-col p-5 gap-2 h-full w-80 bg-white  
            // close 
              opacity-0  invisible -translate-x-full transition-all duration-300 ease-in-out
              // open 
               group-hover:opacity-100 group-hover:visible group-hover:translate-x-0 
            "
              >
                {c.children.map((child) => (
                  <NavLink
                    key={child.id}
                    className=" hover:text-gray-500"
                    to={`/category/${child.slug}`}
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
