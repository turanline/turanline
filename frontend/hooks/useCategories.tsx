//Global
import Link from "next/link";

//Actions
import { fetchCategories } from "@/redux/reducers/categoriesSlice";

//Hooks
import { useAppDispatch } from "./useAppDispatch";
import { useTypedSelector } from "./useTypedSelector";

const useCategories = () => {
  const { status, categories } = useTypedSelector(state => state.categories);

  const dispatch = useAppDispatch();

  const onSetCategories = () => {
    dispatch(fetchCategories());
  };

  const mapCategoriesOnDesktop = () => {
    if (status === "fulfilled")
      return (
        <div
          style={{ height: "50px" }}
          className="flex justify-center bg-tiffani items-center"
        >
          <div className="w-full container flex justify-between text-white">
            {categories.map(category => (
              <Link key={category.id} href={`/category/${category.id}`}>
                {category.name}
              </Link>
            ))}
          </div>
        </div>
      );
  };

  const mapCategoriesOnPhone = () => {
    if (status === "fulfilled")
      return (
        <div className="flex flex-col gap-[20px] row-span-4">
          {categories.map(category => (
            <Link key={category.id} href={`/category/${category.id}`}>
              {category.name}
            </Link>
          ))}
        </div>
      );
  };

  return { onSetCategories, mapCategoriesOnDesktop, mapCategoriesOnPhone };
};

export { useCategories };
