import { post } from '@lib/apiClient';

export interface TopicScore {
  topic: string;
  accuracy: number;
  confidenceAvg: number;
}

export interface AnalysisSummary {
  strengths: TopicScore[];
  gaps: TopicScore[];
}

class RagService {
  async analyzeAssessment(responses: { question_id: string; is_correct: boolean; confidence_level: number }[]): Promise<AnalysisSummary> {
    return post('/rag/analyze', { responses });
  }
}

export const ragService = new RagService();
