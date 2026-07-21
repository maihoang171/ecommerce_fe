import type { ICategory, IParentCategory } from "@/services/category";
import { useNavigate } from "react-router-dom";

interface IParentCategoryDetailProps {
  category: IParentCategory;
}

export const ParentCategoryDetail = ({
  category,
}: IParentCategoryDetailProps) => {
  const navigate = useNavigate();

  const handleClickBtn = (child: ICategory) => {
    navigate(`/${category.slug}/${child.slug}`);
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
      {category.children.map((c) => (
        <button
          onClick={() => handleClickBtn(c)}
          key={c.id}
          className="flex flex-col items-start gap-2 group hover:cursor-pointer"
          aria-label={c.name}
        >
          <img
            src={c.imageUrl}
            alt={c.name}
            className="object-cover object-between"
          />
          <div className="group-hover:underline">{c.name}</div>
        </button>
      ))}
    </div>
  );
};
