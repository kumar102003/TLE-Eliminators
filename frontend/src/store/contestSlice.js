import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Fetch all contests
export const fetchContests = createAsyncThunk(
  'contests/fetchContests',
  async ({ status, platform }) => {
    const response = await axios.get(`${API_URL}/contests`, {
      params: { status, platform }
    });
    return response.data;
  }
);

// Fetch bookmarked contests
export const fetchBookmarkedContests = createAsyncThunk(
  'contests/fetchBookmarkedContests',
  async () => {
    const response = await axios.get(`${API_URL}/contests/bookmarked`);
    return response.data;
  }
);

// Toggle bookmark
export const toggleBookmark = createAsyncThunk(
  'contests/toggleBookmark',
  async (contestId) => {
    const response = await axios.patch(`${API_URL}/contests/${contestId}/bookmark`);
    return response.data;
  }
);

const initialState = {
  contests: [],
  status: 'idle',
  error: null,
  selectedPlatforms: [],
};

const contestSlice = createSlice({
  name: 'contests',
  initialState,
  reducers: {
    setSelectedPlatforms: (state, action) => {
      state.selectedPlatforms = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch contests
      .addCase(fetchContests.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchContests.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.contests = action.payload;
      })
      .addCase(fetchContests.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      // Fetch bookmarked contests
      .addCase(fetchBookmarkedContests.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchBookmarkedContests.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.contests = action.payload;
      })
      .addCase(fetchBookmarkedContests.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      // Toggle bookmark
      .addCase(toggleBookmark.fulfilled, (state, action) => {
        const index = state.contests.findIndex(
          (contest) => contest._id === action.payload._id
        );
        if (index !== -1) {
          state.contests[index] = action.payload;
        }
      });
  },
});

export const { setSelectedPlatforms } = contestSlice.actions;
export default contestSlice.reducer; 