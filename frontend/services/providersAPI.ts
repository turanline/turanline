//Hosts
import { $host } from ".";

//Types
import { IPostRegistrationProvider } from "@/types/types";

export const postProviderRegistration = async (
  providerData: IPostRegistrationProvider
) => {
  try {
    const { data } = await $host.post("/api/provider/", providerData);

    return data;
  } catch (error) {
    throw new Error(`${error}`);
  }
};
