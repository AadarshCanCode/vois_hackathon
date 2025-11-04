import type { AnalysisSummary } from './ragService';
import { post } from '@lib/apiClient';

class LearningPathService {
  async allocateInitialPath(userId: string, courseId: string, analysis: AnalysisSummary) {
    const response = await post<{ modules: string[] }>('/learning-path/allocate', {
      userId,
      courseId,
      analysis
    });
    return response.modules;
  }

  async rebalance(userId: string, courseId: string) {
    const response = await post<{ progress: unknown[] }>('/learning-path/rebalance', {
      userId,
      courseId
    });
    return response.progress;
  }
}

export const learningPathService = new LearningPathService();
