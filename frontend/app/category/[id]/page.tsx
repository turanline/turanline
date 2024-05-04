//Global
import { notFound } from "next/navigation";

//Components
import { CategoryPageComponent } from "@/components/CategoryPageComponent/CategoryPageComponent";
import { CategoryComponent } from "@/components/CategoryComponent/CategoryComponent";

//Services
import { getCategoryById, getCategories } from "@/services/categoriesAPI";
import { getAllProducts } from "@/services/productsAPI";

export async function generateStaticParams() {
  try {
    const categories = await getCategories();

    return categories.map(({ id }: { id: string }) => ({
      id: id.toString(),
    }));
  } catch (error) {
    notFound();
  }
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  try {
    const categoriesObject = await getCategoryById(params.id.toString());
    const categoryName = Object.keys(categoriesObject)[0];

    return {
      title: `${categoryName}`,
      icons: {
        icon: "/favicon.ico",
      },
    };
  } catch (error) {
    notFound();
  }
}

export default async function Category({ params }: { params: { id: string } }) {
  async function getCategoryByParams() {
    try {
      const categoriesObject = await getCategoryById(params.id.toString());

      if (!categoriesObject) notFound();

      return <CategoryComponent categoriesObject={categoriesObject} />;
    } catch (error) {
      notFound();
    }
  }

  const products = await getAllProducts("Все категории", {
    brand: null,
    color: null,
    hbprice: null,
    lbprice: null,
    size: null,
  });

  return (
    <main className="container mx-auto mt-[30px] px-[28px] sm:px-0">
      {getCategoryByParams()}

      <CategoryPageComponent products={products} />
    </main>
  );
}
