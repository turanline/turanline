import {$authHost,$host} from "./index";

export const getSubTypes  = async () => {

    const {data} = await $host.get('/api/subtypes/');
    
    return data;
}
export const postSubtype  = async (subtype: object) => {

    const {data} = await $authHost.post('/api/subtypes/',subtype);
    
    return data;
}
export const putSubtypeById  = async (id: number, subtype:object) => {

    const {data} = await $authHost.put(`/api/subtypes/${id}/`,subtype);
    
    return data;
}
export const patchSubtypeById = async (id: number, subtype:object) => {
    const { data } = await $authHost.patch(`/api/subtypes/${id}/`, subtype);
    return data;
}
export const deleteReviewById = async (id: number) => {
    const {data} = await $authHost.delete(`/api/subtypes/${id}/`);

    return data;
}

