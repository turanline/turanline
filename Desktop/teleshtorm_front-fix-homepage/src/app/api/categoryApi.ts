const BASE_URL = process.env.BASE_URL;

interface CategoryResponse {
    id: string
    name: string
    translit_name: string
    channels_count: number
}

const request = async (url: string): Promise<CategoryResponse[]> => {
  try {
    const res = await fetch(`${BASE_URL}/${url}`);
    if (!res.ok) {
        throw new Error("Failed to fetch data");
    }
    return res.json();
  } catch(error) {
    console.log(error);
  }

  return [];
};

export async function getCategory() {
    return request('channels/categories')
}