import { get, post } from '@lib/apiClient';

class AiService {
  private statusPromise: Promise<boolean> | null = null;

  private async ensureStatus(): Promise<boolean> {
    if (!this.statusPromise) {
      this.statusPromise = get<{ enabled: boolean }>('/ai/status')
        .then(result => result.enabled)
        .catch(() => false);
    }
    return this.statusPromise;
  }

  async isGeminiEnabled(): Promise<boolean> {
    return this.ensureStatus();
  }

  async chat(prompt: string, systemPrompt?: string): Promise<string> {
    const { response } = await post<{ response: string }>('/ai/chat', { prompt, systemPrompt });
    return response;
  }

  async generateQuestions(topics: string[], difficulty: 'easy' | 'medium' | 'hard', count: number = 5) {
    const { questions } = await post<{ questions: unknown[] }>('/ai/questions', {
      topics,
      difficulty,
      count
    });
    return questions;
  }

  async generateCourseOutline(params: {
    title: string;
    description: string;
    category?: string;
    difficulty?: 'beginner' | 'intermediate' | 'advanced';
    estimated_hours?: number;
    module_count?: number;
    detailLevel?: 'brief' | 'normal' | 'comprehensive';
  }) {
    const { modules } = await post<{ modules: Array<{ title: string; description: string; content: string }> }>('/ai/course-outline', params);
    return modules;
  }
}

export const aiService = new AiService();
export default AiService;
