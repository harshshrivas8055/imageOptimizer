import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api";

// Upload image
export const uploadImage = createAsyncThunk(
  "image/upload",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post("/api/images/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      return response.data.files;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Upload failed");
    }
  }
);

// Fetch user's images
export const fetchImages = createAsyncThunk(
  "image/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/api/images/my-images", { withCredentials: true });
      return response.data.images;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to fetch images");
    }
  }
);

// Delete image
export const deleteImage = createAsyncThunk(
  "image/delete",
  async (filename, { rejectWithValue }) => {
    try {
      await api.delete(`/api/images/delete/${filename}`, { withCredentials: true });
      return filename;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Delete failed");
    }
  }
);

const imageSlice = createSlice({
  name: "image",
  initialState: {
    images: [],
    loading: false,
    error: null,
  },
  reducers: {
    resetImageState: (state) => {
      state.images = [];
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Upload
      .addCase(uploadImage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadImage.fulfilled, (state, action) => {
        state.loading = false;
        state.images.push(...action.payload);
      })
      .addCase(uploadImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch
      .addCase(fetchImages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchImages.fulfilled, (state, action) => {
        state.loading = false;
        state.images = action.payload;
      })
      .addCase(fetchImages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete
      .addCase(deleteImage.fulfilled, (state, action) => {
        state.images = state.images.filter(img => img.filename !== action.payload);
      })
      .addCase(deleteImage.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { resetImageState } = imageSlice.actions;
export default imageSlice.reducer;
