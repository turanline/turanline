import { $host, $authHost } from "./index";

export const getAllReviews = async () => {
  const { data } = await $host.get("/api/reviews/");

  return data;
};

export const postReview = async (review: object) => {
  const { data } = await $authHost.post("/api/reviews-proc/", review);

  return data;
};

export const putReviewById = async (id: number, review: object) => {
  const { data } = await $authHost.put(`/api/reviews-proc/${id}/`, review);

  return data;
};

export const patchReviewById = async (id: number, review: object) => {
  const { data } = await $authHost.patch(`/api/reviews-proc/${id}/`, review);
  return data;
};

export const deleteReviewById = async (id: number) => {
  const { data } = await $authHost.delete(`/api/reviews-proc/${id}/`);

  return data;
};
