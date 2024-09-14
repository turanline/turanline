import { $authHost, $host } from "./index";

export const getAllProvidersGoods = async () => {
  try {
    const { data } = await $authHost.get(`/api/provider/products`);
    return data;
    
  } catch (error) {
    console.error(error);
  }
};

export const getProductBySlug = async (slug: string, language: string) => {
  try {
    const { data } = await $host.get("/api/catalog/" + slug, {headers: {'Accept-Language': language}});

    return data;
  } catch (error) {
    console.error(error);
  }
};

export const deleteProductBySlug = async (slug: string) => {
  try {
    const { data } = await $authHost.delete(`/api/catalog/${slug}/`);

    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const patchProductBySlug = async (slug: string,body: { status: string }) => {
  try {
    const { data } = await $authHost.patch(`/api/catalog/${slug}/`, body);

    return data;
  } catch (error) {
    console.error(error);
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
    const { data } = await $authHost.get("/api/superusernews/");

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

export const putProductBySlug = async (slug: string,changes: any) => {
  try {
    const { data } = await $authHost.put(`/api/catalog/${slug}/`, changes);

    return data;
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


