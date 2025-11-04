import { apiClient, ApiResponse } from './apiClient';
import { Question, AssessmentAttempt, AssessmentAnswerInput, AssessmentResult } from '@types';

export interface QuestionsResponse {
  questions: Question[];
}

export interface AttemptResponse {
  attempt: AssessmentAttempt;
}

export interface ResultsResponse {
  results: AssessmentResult[];
}

export interface ScoreResponse {
  score: {
    score: number;
    total: number;
    percentage: number;
  };
}

export class AssessmentService {
  async getQuestions(params?: {
    difficulty?: 'easy' | 'medium' | 'hard';
    count?: number;
  }): Promise<ApiResponse<QuestionsResponse>> {
    const searchParams = new URLSearchParams();
    if (params?.difficulty) searchParams.append('difficulty', params.difficulty);
    if (params?.count) searchParams.append('count', params.count.toString());
    
    const query = searchParams.toString();
    const endpoint = `/assessment/questions${query ? `?${query}` : ''}`;
    
    return apiClient.get<QuestionsResponse>(endpoint);
  }

  async getQuestion(id: string): Promise<ApiResponse<{ question: Question }>> {
    return apiClient.get<{ question: Question }>(`/assessment/questions/${id}`);
  }

  async startAttempt(userId: string, context?: AssessmentAttempt['context']): Promise<ApiResponse<AttemptResponse>> {
    return apiClient.post<AttemptResponse>('/assessment/attempts', {
      userId,
      context: context || 'initial'
    });
  }

  async submitAnswer(answer: AssessmentAnswerInput): Promise<ApiResponse<{ success: boolean }>> {
    return apiClient.post<{ success: boolean }>('/assessment/answers', answer);
  }

  async getAttemptResults(attemptId: string): Promise<ApiResponse<ResultsResponse>> {
    return apiClient.get<ResultsResponse>(`/assessment/attempts/${attemptId}/results`);
  }

  async getAttemptScore(attemptId: string): Promise<ApiResponse<ScoreResponse>> {
    return apiClient.get<ScoreResponse>(`/assessment/attempts/${attemptId}/score`);
  }

  async getUserAssessments(userId: string): Promise<ApiResponse<{ attempts: AssessmentAttempt[] }>> {
    return apiClient.get<{ attempts: AssessmentAttempt[] }>(`/assessment/users/${userId}/attempts`);
  }
}

export const assessmentService = new AssessmentService();