//Hosts
import { $authHost,$host } from ".";


export const postToOrder = async (obj: any) => {
    try {
      const { data,status } = await $authHost.post("/api/order/", obj);
  
      return { data,status } ;
    } catch (error:any) {
      console.error("Failed to post order: " + error);
      return error;
    }
};

export const postToPayByDetails = async () => {
  try {
    const { data, status } = await $authHost.post("/api/card-payments/process_payment_by_company_details/");

    return { data, status };
  } catch (error: any) {
    console.error("Failed to post order: " + error);
    return error;
  }
};


export const postToPay = async (obj: any) => {
  try {
    const { data, status } = await $authHost.post("/api/card-payments/process_payment/", obj);

    return { data, status };
  } catch (error: any) {
    console.error("Failed to post order: " + error);
    return error;
  }
};
export const getAllTariffies = async () => {
  try {
    const { data, status } = await $authHost.get('/api/tariff/');

    return { data, status };
  } catch (error:any) {
    console.error("Failed to get tariffies: " + error);
    return error;
  }
};