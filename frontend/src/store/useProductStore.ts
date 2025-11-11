import { create } from 'zustand';
import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

type ProductStore = {
    products: [];
    loading: boolean;
    error: string | null;
    fetchProducts: () => Promise<void>;
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
}));
