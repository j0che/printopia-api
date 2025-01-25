import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
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

    const response = await api.post<PrintJobResponse>('/api/print-jobs', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Get price from price.json
  getPrice: async (tempFolderId: string) => {
    const response = await api.get<PriceResponse>(`/api/print-jobs/${tempFolderId}/price`);
    return response.data;
  },

  // Get job status
  getPrintJobStatus: async (jobId: string) => {
    const response = await api.get<PrintJobResponse>(`/api/print-jobs/${jobId}`);
    return response.data;
  },
};