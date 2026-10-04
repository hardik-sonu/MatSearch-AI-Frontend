import { SearchRequest, SearchResponse, CompareRequest, Material, SearchDetails } from '../types/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://mat-search-ai-backend.vercel.app";

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, options);
  if (!response.ok) {
    let errorMessage = 'An error occurred while fetching the data.';
    try {
      const errorData = await response.json();
      errorMessage = errorData.detail || errorMessage;
    } catch (e) {
      errorMessage = response.statusText;
    }
    throw new Error(errorMessage);
  }
  return response.json();
}

export const api = {
  getHealth: () => fetchJson<{ status: string }>(`${API_BASE_URL}/health`),
  getStatus: () => fetchJson<{ status: string }>(`${API_BASE_URL}/api/status`),

  createSearch: (data: SearchRequest) => 
    fetchJson<SearchResponse>(`${API_BASE_URL}/api/search/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }),

  getSearch: (searchId: string) => 
    fetchJson<SearchDetails>(`${API_BASE_URL}/api/search/${searchId}`),

  getMaterial: (materialId: string) => 
    fetchJson<Material>(`${API_BASE_URL}/api/material/${materialId}`),

  compareMaterials: (data: CompareRequest) => 
    fetchJson<any>(`${API_BASE_URL}/api/compare/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }),

  getReport: (searchId: string) => 
    fetchJson<any>(`${API_BASE_URL}/api/reports/${searchId}`),

  generateReport: (searchId: string) => 
    fetchJson<any>(`${API_BASE_URL}/api/reports/${searchId}/generate`, {
      method: 'POST',
    }),
};
