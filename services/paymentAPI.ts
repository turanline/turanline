//Hosts
import { $authHost } from ".";

export const getDeliveryCost = async (category: string, city: string, tariff: string) => {
    try {
      const params = new URLSearchParams();
      if (category) params.append('category', category);
      if (city) params.append('city', city);
      if (tariff) params.append('tariff', tariff);
  
      const { data, status } = await $authHost.get(`/api/delivery/?${params.toString()}`);
  
      return { data, status };
    } catch (error:any) {
      console.error("Failed to get delivery cost: " + error);
      return error;
    }
  };

export const postToOrder = async (obj: any) => {
    try {
      const { data,status } = await $authHost.post("/api/order/", obj);
  
      return { data,status } ;
    } catch (error:any) {
      console.error("Failed to post order: " + error);
      return error;
    }
};