import { create } from 'zustand';
import axios from 'axios';
import type { Product } from '../types/types';
import { toast } from 'react-hot-toast';

const BASE_URL = 'http://localhost:3000';

type ProductStore = {
    products: Product[];
    loading: boolean;
    error: string | null;
    fetchProducts: () => Promise<void>;
    deleteProduct: (id: number) => Promise<void>;
};

export const useProductStore = create<ProductStore>((set, get) => ({
    //products state
    products: [],
    loading: false,
    error: null,

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
}));
