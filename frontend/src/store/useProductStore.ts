import { create } from 'zustand';
import axios from 'axios';
import type { FormData, Product } from '../types/types';
import { toast } from 'react-hot-toast';

const BASE_URL = import.meta.env.MODE === 'development' ? 'http://localhost:3000' : '';

type ProductStore = {
    products: Product[];
    loading: boolean;
    error: string | null;
    currentProduct: Product | null;
    fetchProducts: () => Promise<void>;
    fetchProduct: (id: number) => Promise<void>;
    deleteProduct: (id: number) => Promise<void>;
    formData: FormData;
    setFormData: (formData: FormData) => void;
    resetFormData: () => void;
    addProduct: (e: React.FormEvent<HTMLFormElement>) => void;
    updateProduct: (id: number) => void;
};

export const useProductStore = create<ProductStore>((set, get) => ({
    //products state
    products: [],
    loading: false,
    error: null,
    currentProduct: null,

    formData: {
        name: '',
        price: '',
        image: '',
    },

    setFormData: (formData) => set({ formData }),
    resetFormData: () => set({ formData: { name: '', price: '', image: '' } }),

    addProduct: async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const modal = document.getElementById('add_product_modal') as HTMLDialogElement;
        set({ loading: true });
        try {
            const { formData } = get();
            await axios.post(`${BASE_URL}/api/products`, formData);
            await get().fetchProducts();
            get().resetFormData();
            toast.success('Product added successfully.');
            modal?.close();
        } catch (error) {
            console.log('Error adding product');
            toast.error('Something went wrong.');
        } finally {
            set({ loading: false });
        }
    },

    fetchProducts: async () => {
        set({ loading: true });
        try {
            const response = await axios.get(`${BASE_URL}/api/products`);
            set({ products: response.data.data, error: null });
        } catch (err: any) {
            if (err.status === 429) set({ error: 'Rate limit exceeded', products: [] });
            else set({ error: 'Something went wrong fetching products', products: [] });
        } finally {
            set({ loading: false });
        }
    },

    deleteProduct: async (id: number) => {
        set({ loading: true });
        try {
            await axios.delete(`${BASE_URL}/api/products/${id}`);
            set((state) => ({ products: state.products.filter((product) => product.id !== id) }));
            toast.success('Product deleted successfully');
        } catch (error) {
            console.log('Error deleting product');
            toast.error('Something went wrong');
        } finally {
            set({ loading: false });
        }
    },

    fetchProduct: async (id: number) => {
        set({ loading: true });
        try {
            const response = await axios.get(`${BASE_URL}/api/products/${id}`);
            set({
                currentProduct: response.data.data,
                formData: response.data.data, // prefill form with current product data
                error: null,
            });
        } catch (error: any) {
            console.log('Error in fetchProduct function', error);
            set({ error: 'Something went wrong fetching the product', currentProduct: null });
        } finally {
            set({ loading: false });
        }
    },

    updateProduct: async (id: number) => {
        set({ loading: true });
        try {
            const { formData } = get();
            const response = await axios.put(`${BASE_URL}/api/products/${id}`, formData);
            set({ currentProduct: response.data.data });
            toast.success('Product updated successfully');
        } catch (error) {
            console.log('Error updating product');
            toast.error('Something went wrong');
        } finally {
            set({ loading: false });
        }
    },
}));
