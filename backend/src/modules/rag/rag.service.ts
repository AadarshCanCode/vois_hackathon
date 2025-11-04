import { aiService } from '../ai/ai.service';

export interface RagAnalysisRequest {
  responses: Array<{ question_id: string; is_correct: boolean; confidence_level: number }>;
}

export interface TopicScore {
  topic: string;
  accuracy: number;
  confidenceAvg: number;
}

export interface AnalysisSummary {
  strengths: TopicScore[];
  gaps: TopicScore[];
}

export const ragService = {
  async analyzeAssessment(responses: RagAnalysisRequest['responses']): Promise<AnalysisSummary> {
    const prompt = `Given the following Q/A results with confidence, produce a JSON with strengths and gaps grouped by OWASP-ish topics.
Return {"strengths":[{"topic":"...","accuracy":0.0,"confidenceAvg":0}],"gaps":[...]}
Data: ${JSON.stringify(responses)}`;
    const text = await aiService.chat(prompt, 'Return strict JSON only.');
    try {
      const firstBrace = text.indexOf('{');
      const lastBrace = text.lastIndexOf('}');
      const json = text.slice(firstBrace, lastBrace + 1);
      return JSON.parse(json) as AnalysisSummary;
    } catch {
      const totals: Record<string, { c: number; ok: number; confSum: number }> = {};
      for (const r of responses) {
        const topic = r.question_id.split(':')[0] || 'general';
        totals[topic] ??= { c: 0, ok: 0, confSum: 0 };
        totals[topic].c += 1;
        totals[topic].confSum += r.confidence_level;
        if (r.is_correct) totals[topic].ok += 1;
      }
      const scores = Object.entries(totals).map(([topic, t]) => ({
        topic,
        accuracy: t.ok / t.c,
        confidenceAvg: t.confSum / t.c
      }));
      const strengths = scores.filter(s => s.accuracy >= 0.7 && s.confidenceAvg >= 3.5);
      const gaps = scores.filter(s => s.accuracy < 0.7 || s.confidenceAvg < 3.0);
      return { strengths, gaps };
    }
  }
};
