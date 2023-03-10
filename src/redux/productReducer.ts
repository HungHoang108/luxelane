import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { Product } from "../types/ProductType";
import { FileAndNewProductForm } from "../types/NewProductType";

const initialState: Product[] = [];

export const fetchAllProducts = createAsyncThunk(
  "fetchAllProducts",
  async () => {
    try {
      const products = await axios.get(
        "https://api.escuelajs.co/api/v1/products"
      );
      return products.data;
      console.log(products.data)
    } catch (error) {
      const err = error as AxiosError;
      return err;
    }
  }
);
export const deleteProduct = createAsyncThunk(
  "deleteProduct",
  async (product: number) => {
    try {
      const response = await axios.delete(
        `https://api.escuelajs.co/api/v1/products/${product}`
      );
      const data = response.data;
      return data;
    } catch (error) {
      const err = error as AxiosError;
      console.log(err);
    }
  }
);
export const editProductThunk = createAsyncThunk(
  "editProduct",
  async (product: Partial<Product>) => {
    try {
      const response = await axios.put(
        `https://api.escuelajs.co/api/v1/products/${product.id}`,
        {
          title: product.title,
          price: product.price,
          description: product.description,
        }
      );
      const data = response.data;
      return data;
    } catch (error) {
      const err = error as AxiosError;
      return err;
    }
  }
);

export const createProduct = createAsyncThunk(
  "createProduct",
  async ({ file, product }: FileAndNewProductForm) => {
    try {
      const response = await axios.post(
        "https://api.escuelajs.co/api/v1/files/upload",
        { file: file },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const data = response.data.location;
      const newProduct = { ...product, images: [data] };
      const newItemResponse = await axios.post(
        "https://api.escuelajs.co/api/v1/products/",
        newProduct
      );
      return newItemResponse.data;
    } catch (error) {
      const err = error as AxiosError;
      return err;
    }
  }
);

const ProductsSlice = createSlice({
  name: "productSlice",
  initialState: initialState,
  reducers: {
    deleteItem: (
      state: Product[],
      action: {
        payload: any;
      }
    ): Product[] | undefined => {
      if (action.payload) {
        return state.filter((item) => item.id !== action.payload);
      }
    },
    sortByPrice: (state, action) => {
      if (action.payload === "price-up") {
        state.sort((a, b) => a.price - b.price);
      } else if (action.payload === "price-down") {
        state.sort((a, b) => b.price - a.price);
      }
    },

  },
  extraReducers: (build) => {
    build
      .addCase(
        fetchAllProducts.fulfilled,
        (state, action: PayloadAction<Product[] | AxiosError>) => {
          if (action.payload && "message" in action.payload) {
            return state;
          } else if (!action.payload) {
            return state;
          }
          return action.payload;
        }
      )
      .addCase(
        editProductThunk.fulfilled,
        (state, action: PayloadAction<Product>) => {
          return state.map((product) => {
            if (product.id === action.payload.id) {
              return action.payload;
            }
            return product;
          });
        }
      )
      .addCase(
        createProduct.fulfilled,
        (state, action: PayloadAction<Product>) => {
          if (action.payload) {
            state.push(action.payload);
          } else {
            return state;
          }
        }
      );
  },
});
export const productReducer = ProductsSlice.reducer;
export const { deleteItem, sortByPrice } =
  ProductsSlice.actions;
export default ProductsSlice;
