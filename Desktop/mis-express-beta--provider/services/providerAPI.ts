import { $authHost, $host } from "./index";
import { IProductEditPage } from "@/types/additionalTypes";


export const getProvidersOrdersPeriodPrice = async (startDate?: Date | null | string) => {
  try {
    const { data } = await $authHost.get(`/api/provider/get_orders/?start_date=${startDate}` );

    return data;
    
  } catch (error) {
    console.error(error);
  }
};

export const getAllProvidersGoods = async () => {
  try {
    const { data } = await $authHost.get('/api/provider/products/');
    return data;
    
  } catch (error) {
    console.error(error);
  }
};

export const getProductBySlug = async (article_number: string, language: string) => {
  try {
    const { data } = await $host.get("/api/catalog/" + article_number, {headers: {'Accept-Language': language}});

    return data;
  } catch (error) {
    console.error(error);
  }
};

export const deleteProductBySlug = async (article_number: string) => {
  try {
    const { data,status } = await $authHost.delete(`/api/catalog/${article_number}/`);

    return { data,status };
  } catch (error: any) {
    console.error(error);
    return error;
  }
};


export const patchProductBySlug = async (article_number: string,body:{status: string}) => {
  try {
    const { data, status } = await $authHost.patch(`/api/catalog/${article_number}/`,body);

    return { data, status };
  } catch (error: any) {
    console.error(error);
    return error;
  }
};

export const getAllNotificationsByUserID = async () => {
  try {
    const { data } = await $authHost.get(`/api/provider/status_change_archive/`);
    return data;
  }catch(error){
    console.error(error);
  };
}
    
export const postProviderImport = async (tableData: any) => {
  try {
    const { data } = await $authHost.post("/api/import_xlsx/", tableData);

    return data;
  } catch (error) {
    console.error(error);
  }
};

export const getProviderExport = async () => {
  try {
    const { data: dataImport } = await $authHost.get("/api/import_xlsx/");

    if ("message" in dataImport && dataImport.message) {
      const { data } = await $authHost.get("/api/provider/get_last_downloaded_file/");

      return data;
    }
  } catch (error) {
    console.error(error);
  }
};

export const getProviderTimeLeft = async () => {
  try {
    const { data } = await $authHost.get(`/api/provider/time_left/`);

    return data?.time_left;
  } catch (error) {
    console.error(error);
  }
};

export const getProvidersOrders = async () => {
  try {
    const { data } = await $authHost.get("/api/provider/get_orders");

    return data;
    
  } catch (error) {
    console.error(error);
  }
};

export const getProviderNews = async () => {
  try {
    const { data } = await $authHost.get("/api/news/");

    return data;
  } catch (error) {
    console.error(error);
  }
};

export const getProviderReviews = async () => {
  try {
    const { data } = await $authHost.get(`/api/provider/reviews/`);

    return data;
  } catch (error) {
    console.error(error);
  }
};

export const getAllCountries = async (language :string) => {
  try {
    const { data } = await $authHost.get("/api/country/",{headers: {'Accept-Language': language}});

    return data;
  } catch (error) {
    console.error(error);
  }
};

export const putProductBySlug = async (article_number: string,changes: any,language:string) => {
  try {
    const { data,status } = await $authHost.put(`/api/catalog/${article_number}/`, changes,{headers: {'Accept-Language': language}});

    return { data,status };
  } catch (error) {
    console.error(error);
  }
};

export const getColorsAPI = async () => {
  try {
    const { data } = await $authHost.get("/api/color/");

    return data;
  } catch (error) {
    console.error("Failed get colors: " + error);
    throw error;
  }
};

export const getSizesClothes = async () => {
  try {
    const { data,status } = await $authHost.get("/api/size/");

    return { data,status };
  } catch (error) {
    console.error("Failed get colors: " + error);
    throw error;
  }
};


export const getAllCategories = async () => {
  try {
    const { data, status } = await $host.get('/api/categories/?level=0');

    return { data, status };
  } catch (error: any) {
    if(error) return error;
    console.error("Failed to get categories: " + error);
  }
};

export const getTypesByChildren = async (children: number) => {
  try {
    const { data, status } = await $host.get('/api/categories/', {params: { children }});

    return { data, status };
  } catch (error: any) {
    if(error) return error;
    console.error("Failed to get categories: " + error);
  }
};


export const createNewProduct = async (productParameters: any,language: string) => {
  try {
    const { data,status } = await $authHost.post("/api/catalog/", productParameters,{headers: {'Accept-Language': language}});

    return { data,status };
  } catch (error:any) {
    if(error){
      return error;
    }
    console.error(error);
  }
}


