import { apiClient, ApiResponse } from './apiClient';
import { Lab, TechnicalQuestion } from '@types';

export interface LabsResponse {
  labs: Lab[];
}

export interface LabResponse {
  lab: Lab;
}

export interface TechnicalQuestionsResponse {
  questions: TechnicalQuestion[];
}

export class DataService {
  // Lab-related methods
  async getLabs(params?: {
    difficulty?: 'beginner' | 'intermediate' | 'advanced';
    count?: number;
  }): Promise<ApiResponse<LabsResponse>> {
    const searchParams = new URLSearchParams();
    if (params?.difficulty) searchParams.append('difficulty', params.difficulty);
    if (params?.count) searchParams.append('count', params.count.toString());
    
    const query = searchParams.toString();
    const endpoint = `/data/labs${query ? `?${query}` : ''}`;
    
    return apiClient.get<LabsResponse>(endpoint);
  }

  async getLab(id: string): Promise<ApiResponse<LabResponse>> {
    return apiClient.get<LabResponse>(`/data/labs/${id}`);
  }

  // Technical questions methods
  async getTechnicalQuestions(params?: {
    company?: string;
    difficulty?: 'junior' | 'mid' | 'senior' | 'principal';
    category?: string;
    count?: number;
  }): Promise<ApiResponse<TechnicalQuestionsResponse>> {
    const searchParams = new URLSearchParams();
    if (params?.company) searchParams.append('company', params.company);
    if (params?.difficulty) searchParams.append('difficulty', params.difficulty);
    if (params?.category) searchParams.append('category', params.category);
    if (params?.count) searchParams.append('count', params.count.toString());
    
    const query = searchParams.toString();
    const endpoint = `/data/technical-questions${query ? `?${query}` : ''}`;
    
    return apiClient.get<TechnicalQuestionsResponse>(endpoint);
  }
}

export const dataService = new DataService();