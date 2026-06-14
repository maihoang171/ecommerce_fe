import { Link } from "react-router-dom";
import { ArrowRightIcon } from "lucide-react";
import { useCategoryListStore } from "../stores/useCategoryStore";

export const Body = () => {
  const { activeCategory } = useCategoryListStore();
  const campaigns = activeCategory?.campaigns ?? [];

  return (
    <div className="w-full flex flex-col pt-14 md:pt-16">
      {campaigns.map((c) => (
        <Link
          key={c.id}
          to={c.linkUrl}
          className="block w-full group overflow-hidden hover:text-gray-500"
        >
          <img
            src={c.imageUrl}
            className="w-full h-120 md:h-[calc(100vh-120px)]  object-center object-cover"
            alt={c.title}
          />
          <div className="flex flex-row items-center justify-between mb-5 px-5 py-2">
            <span>{c.subTitle}</span>
            <ArrowRightIcon className="h-8 w-auto min-h-8  transition-transform duration-300 ease-in-out group-hover:translate-x-2 " />
          </div>
        </Link>
      ))}
    </div>
  );
};
