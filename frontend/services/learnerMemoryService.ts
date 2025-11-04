import { get, post } from '@lib/apiClient';

export interface MemoryFact {
  kind: 'strength' | 'gap' | 'preference' | 'note';
  topic?: string;
  text: string;
}

class LearnerMemoryService {
  async upsertFacts(userId: string, facts: MemoryFact[]) {
    await post('/memory', { userId, facts });
    return true;
  }

  async getContext(userId: string, limit: number = 10) {
    const { context } = await get<{ context: string }>(`/memory/${userId}?limit=${limit}`);
    return context;
  }
}

export const learnerMemoryService = new LearnerMemoryService();
