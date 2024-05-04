import {$authHost,$host} from "./index";

export const getCategories = async () => {

    const {data} = await $host.get('/api/categories/');
    
    return data;
}
export const getCategoryById = async (id: string) => {

    const {data} = await $host.get(`/api/categories/${id}`);
    
    return data;
}
export const postCategory = async (name: string) => {

    const {data} = await $authHost.post('/api/categories/',{name});
    
    return data;
}
export const putCategoryById  = async (id: number) => {

    const {data} = await $authHost.put(`/api/categories/${id}`);
    
    return data;
}
export const patchCategoryById = async (id: number, updateData: object) => {
    const { data } = await $authHost.patch(`/api/categories/${id}`, updateData);
    return data;
}
export const deleteCategoryById  = async (id: number) => {

    const {data} = await $authHost.delete(`/api/categories/${id}`);
    
    return data;
}