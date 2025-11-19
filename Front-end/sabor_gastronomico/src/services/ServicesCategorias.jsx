import axiosInstance from './AxiosConfig';

export const getCategorias = async () => {
    try {
        const response = await axiosInstance.get('categorias/'); 
        return response.data; 
    } catch (error) {
        throw error;
    }
};