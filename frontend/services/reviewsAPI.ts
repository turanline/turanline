//Hosts
import { $host, $authHost } from "./index";

export const getAllReviews = async () => {
  try {
    const { data } = await $host.get("/api/reviews/");

    return data;
  } catch (error) {
    throw new Error(`${error}`);
  }
};

export const postReview = async (review: object) => {
  try {
    const { data } = await $authHost.post("/api/reviews-proc/", review);

    return data;
  } catch (error) {
    throw new Error(`${error}`);
  }
};

export const putReviewById = async (id: number, review: object) => {
  try {
    const { data } = await $authHost.put(`/api/reviews-proc/${id}/`, review);

    return data;
  } catch (error) {
    throw new Error(`${error}`);
  }
};

export const patchReviewById = async (id: number, review: object) => {
  try {
    const { data } = await $authHost.patch(`/api/reviews-proc/${id}/`, review);

    return data;
  } catch (error) {
    throw new Error(`${error}`);
  }
};

export const deleteReviewById = async (id: number) => {
  try {
    const { data } = await $authHost.delete(`/api/reviews-proc/${id}/`);

    return data;
  } catch (error) {
    throw new Error(`${error}`);
  }
};
