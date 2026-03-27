import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
    name: 'product',
    initialState: {
        products: [], // Capital 'P' ki jagah small 'p' use karein (standard convention)
        cart:[],
    },
    reducers: {
        // action
        setProducts: (state, action) => {
            // Galti: aapne statusbar.Products likha tha
            // Fix: state.products ka use karein
            state.products = action.payload; 
        },
        setCart:(state,action)=>{
            state.cart=action.payload
        }
    }
})

export const { setProducts, setCart } = productSlice.actions;
export default productSlice.reducer;