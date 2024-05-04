//Global
import { showToastMessage } from "@/app/toastsChange";

//Services
import { postToCart } from "@/services/cartAPI";

//Types
import { IPostCartApi } from "@/types/types";

export const addToCart = async ({ amount, product }: IPostCartApi) => {
  try {
    await postToCart({ amount, product });
    showToastMessage("success", "Товар добавлен в корзину");
  } catch (error: any) {
    if (error.response && error.response.data) {
      const responseData = error.response.data;
      console.error(responseData);
    } else {
      showToastMessage(
        "error",
        "Произошла ошибка, но не удалось получить дополнительные данные об ошибке"
      );
    }
  }
};
