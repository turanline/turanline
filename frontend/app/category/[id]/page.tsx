//Components
import { CategoryPageComponent } from "@/components/CategoryPageComponent/CategoryPageComponent";
import { CategoryComponent } from "@/components/CategoryComponent/CategoryComponent";

//Services
import { getCategoryById, getCategories } from "@/services/categoriesAPI";

export async function generateStaticParams() {
  try {
    const categories = await getCategories();

    return categories.map(({ id }: { id: number }) => ({
      id: id.toString(),
    }));
  } catch (error) {
    console.log(error);
  }
}

export async function generateMetadata({ params }: { params: { id: number } }) {
  try {
    const categoriesObject = await getCategoryById(params.id),
      categoryName = Object.keys(categoriesObject)[0];

    return {
      title: `${categoryName}`,
    };
  } catch (error) {
    console.log(error);
  }
}

export default async function Category({ params }: { params: { id: number } }) {
  async function getCategoryByParams() {
    try {
      const categoriesObject = await getCategoryById(params.id);

      return (
        <CategoryComponent
          categoryObject={categoriesObject}
          categoryId={+params.id}
        />
      );
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="container mx-auto mt-[30px] px-[28px] sm:px-0">
      {getCategoryByParams()}

      <CategoryPageComponent />
    </div>
  );
}
