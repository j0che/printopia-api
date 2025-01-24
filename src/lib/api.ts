import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'http://localhost:8000', // Change this to your FastAPI server URL
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface PrintJobRequest {
  file: File;
  parameters: {
    layerHeight: number;
    infill: number;
    scale: number;
  };
}

export interface PrintJobResponse {
  id: string;
  cost: number;
  estimatedTime: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
}

export const printingApi = {
  // Calculate cost without submitting job
  calculateCost: async (parameters: PrintJobRequest['parameters']) => {
    const response = await api.post<{ cost: number }>('/api/calculate-cost', parameters);
    return response.data;
  },

  // Submit print job
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

  // Get job status
  getPrintJobStatus: async (jobId: string) => {
    const response = await api.get<PrintJobResponse>(`/api/print-jobs/${jobId}`);
    return response.data;
  },
};