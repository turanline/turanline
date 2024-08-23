//Components
import { CategoryPageComponent } from "@/components/CategoryPageComponent/CategoryPageComponent";
import { CategoryComponent } from "@/components/CategoryComponent/CategoryComponent";

//Services
import { getCategoryById, getAllCategories } from "@/services/categoriesAPI";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  try {
    const categories = await getAllCategories();

    return categories.map(({ id }: { id: number }) => ({
      id: id.toString(),
    }));
  } catch (error) {
    console.log(error);
  }
}

export async function generateMetadata({ params }: { params: { id: number } }) {
  try {
    const categoriesObject = await getCategoryById(params?.id);
    const categoryName = Object.keys(categoriesObject)[0];

    return {
      title: `${categoryName}`,
    };
  } catch (error) {
    console.log(error);
  }
}

export default async function Category({ params }: { params: { id: number } }) {
  try {
    const categoriesObject = await getCategoryById(params?.id);
    if (!categoriesObject) return notFound();
    return (
      <main className="container mx-auto mt-[30px] px-[15px] lg:px-[30px]">
        <CategoryComponent
          categoryObject={categoriesObject}
          categoryId={+params?.id}
        />
        <CategoryPageComponent />
      </main>
    );
  } catch (error) {
    console.log(error);
    return notFound();
  }
}
