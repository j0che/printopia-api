
import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  // Anpassung der baseURL für das Rust-Backend
  baseURL: 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
    // CORS Headers für Rust Backend
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  },
});

export interface PrintParameters {
  layerHeight: number;
  infill: number;
  scale: number;
}

export interface PrintJobRequest {
  file: File;
  parameters: PrintParameters;
}

export interface PrintJobResponse {
  id: string;
  tempFolderId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
}

export interface PriceResponse {
  cost: number;
  currency: string;
}

export const printingApi = {
  // Submit print job and create temp folder
  submitPrintJob: async (data: PrintJobRequest) => {
    const formData = new FormData();
    formData.append('file', data.file);
    formData.append('parameters', JSON.stringify(data.parameters));

    try {
      const response = await api.post<PrintJobResponse>('/api/print-jobs', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error submitting print job:', error);
      throw error;
    }
  },

  // Get price from price.json
  getPrice: async (tempFolderId: string) => {
    try {
      const response = await api.get<PriceResponse>(`/api/print-jobs/${tempFolderId}/price`);
      return response.data;
    } catch (error) {
      console.error('Error getting price:', error);
      throw error;
    }
  },

  // Get job status
  getPrintJobStatus: async (jobId: string) => {
    try {
      const response = await api.get<PrintJobResponse>(`/api/print-jobs/${jobId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting job status:', error);
      throw error;
    }
  },
};
