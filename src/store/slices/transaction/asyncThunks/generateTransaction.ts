import { createAsyncThunk } from '@reduxjs/toolkit';
import { post } from '../../../../../api';

const generateTransaction = createAsyncThunk<any, { paymentId: any, email?: string }, any>(
  'generateTransaction',
  async (data, { rejectWithValue, getState }) => {
    try {
      const token = (getState() as any).auth?.data?.token;
      const result = await post('/transaction/generateWallet', data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return result.data;
    } catch (error: any) {
      if (error.response) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue('Server error');
    }
  },
);

export {  generateTransaction };
