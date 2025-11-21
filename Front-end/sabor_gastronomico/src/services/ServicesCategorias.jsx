import axiosInstance from './AxiosConfig';

export const getCategorias = async () => {
    try {
        const response = await axiosInstance.get('categorias/');
        console.log(response.data.results);
        return response.data.results; 
    } catch (error) {
        throw error;
    }
};