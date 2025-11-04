// Unified AI service using Google Gemini only
class AiService {
  private geminiApiKey: string | undefined;
  // Hardcoded per request
  private readonly geminiModel = 'gemini-2.0-flash';
  private readonly geminiBaseUrl = 'https://generativelanguage.googleapis.com/v1beta';

  constructor() {
    // Only take API key from Vite env. Ensure .env contains VITE_GEMINI_API_KEY
    this.geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY || undefined;
  }

  isGeminiEnabled(): boolean {
    return Boolean(this.geminiApiKey);
  }

  private async chatGemini(prompt: string, systemPrompt?: string): Promise<string> {
  if (!this.geminiApiKey) throw new Error('Gemini API key missing. Set VITE_GEMINI_API_KEY in your .env');

  // Hardcoded model and endpoint
  const endpoint = `${this.geminiBaseUrl}/models/${this.geminiModel}:generateContent?key=${this.geminiApiKey}`;
    const contents = {
      contents: [
        ...(systemPrompt ? [{ role: 'user', parts: [{ text: `System: ${systemPrompt}` }] }] : []),
        { role: 'user', parts: [{ text: prompt }] },
      ],
      // Ask for more tokens so Gemini can generate longer, instructional content
      generationConfig: { temperature: 0.6, maxOutputTokens: 1200 },
    };

    const resp = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contents),
    });

    if (!resp.ok) {
      let errText = await resp.text();
      try {
        const j = JSON.parse(errText) as unknown;
        if (j && typeof j === 'object' && 'error' in j) {
          const jj = j as Record<string, unknown>;
          const errField = jj.error as unknown;
          if (errField && typeof errField === 'object' && 'message' in (errField as Record<string, unknown>)) {
            errText = String((errField as Record<string, unknown>)['message']);
          } else {
            errText = JSON.stringify(jj);
          }
        } else {
          errText = JSON.stringify(j);
        }
      } catch {
        // ignore parse errors and keep raw text
      }
      const msg = `Gemini error ${resp.status}: ${errText}`;
      console.error(msg);
      throw new Error(msg);
    }

  const data: unknown = await resp.json();
    let text = '';
    try {
      if (data && typeof data === 'object') {
        const candidates = (data as Record<string, unknown>)['candidates'];
        if (Array.isArray(candidates) && candidates.length > 0) {
          const first = candidates[0] as Record<string, unknown>;
          const content = first['content'] as Record<string, unknown> | undefined;
          const parts = content ? content['parts'] as unknown[] : undefined;
          if (Array.isArray(parts)) {
            text = parts.map(p => {
              if (p && typeof p === 'object' && 'text' in (p as Record<string, unknown>)) {
                return String((p as Record<string, unknown>)['text']);
              }
              return '';
            }).join('');
          }
        }
      }
    } catch {
      // best-effort extraction only
      text = '';
    }
    return text.trim();
  }

  async chat(prompt: string, systemPrompt?: string): Promise<string> {
    if (this.isGeminiEnabled()) {
      return this.chatGemini(prompt, systemPrompt);
    }
    throw new Error('No AI provider configured. Set VITE_GEMINI_API_KEY.');
  }

  async generateQuestions(topics: string[], difficulty: 'easy' | 'medium' | 'hard', count: number = 5) {
    const system =
      'You generate high-quality cybersecurity multiple-choice questions. Return a strict JSON array of objects: {id, question, options, correctAnswer, explanation}. Do not include prose.';
    const prompt = `Topics: ${topics.join(', ')}\nDifficulty: ${difficulty}\nCount: ${count}\nReturn JSON only.`;

    const text = await this.chat(prompt, system);
    try {
      const start = text.indexOf('[');
      const end = text.lastIndexOf(']');
      return JSON.parse(text.slice(start, end + 1));
    } catch {
      return topics.slice(0, count).map((t, i) => ({
        id: `gen-${i}`,
        question: `Placeholder question about ${t}?`,
        options: ['A', 'B', 'C', 'D'],
        correctAnswer: 0,
        explanation: `Review topic ${t}.`,
      }));
    }
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
    const { title, description, category = '', difficulty = 'beginner', estimated_hours = 0, module_count = 5, detailLevel = 'comprehensive' } = params;
    const system =
      'You are an expert course designer. Given the course metadata, produce a detailed JSON structure only (no prose) describing a full course outline suitable for teaching students. Return a JSON object with a `modules` array. Each module should be an object with: \n- title (string)\n- description (string)\n- learningObjectives (array of short strings)\n- sections (array of {heading:string, text:string})\n- examples (array of strings)\n- exercises (array of strings)\nDo not return any additional text outside the JSON block.';

    const prompt = `Course Title: ${title}\nDescription: ${description}\nCategory: ${category}\nDifficulty: ${difficulty}\nEstimated Hours: ${estimated_hours}\nModuleCount: ${module_count}\nDetailLevel: ${detailLevel}\nReturn a JSON object like { "modules": [ {"title":"...","description":"...","learningObjectives":["..."],"sections":[{"heading":"...","text":"..."}],"examples":["..."],"exercises":["..."] }, ... ] }`;

    const text = await this.chat(prompt, system);
    try {
      const start = text.indexOf('{');
      const end = text.lastIndexOf('}');
      const jsonText = start !== -1 && end !== -1 ? text.slice(start, end + 1) : text;
      const parsed = JSON.parse(jsonText) as {
        modules?: Array<{
          title?: string;
          description?: string;
          learningObjectives?: string[];
          sections?: Array<{ heading?: string; text?: string }>;
          examples?: string[];
          exercises?: string[];
        }>;
      };
      if (parsed && Array.isArray(parsed.modules)) {
        return parsed.modules.map(m => {
          const titleText = String(m.title || '').trim();
          const descriptionText = String(m.description || '').trim();

          // Build long, instructional content by concatenating objectives, sections, examples, and exercises
          const parts: string[] = [];
          if (Array.isArray(m.learningObjectives) && m.learningObjectives.length) {
            parts.push('Learning objectives:\n' + m.learningObjectives.map(o => `- ${o}`).join('\n'));
          }
          if (Array.isArray(m.sections) && m.sections.length) {
            parts.push(m.sections.map(s => (s.heading ? `\n${s.heading}\n` : '') + (s.text || '')).join('\n\n'));
          }
          if (Array.isArray(m.examples) && m.examples.length) {
            parts.push('\nExamples:\n' + m.examples.map(e => `- ${e}`).join('\n'));
          }
          if (Array.isArray(m.exercises) && m.exercises.length) {
            parts.push('\nExercises:\n' + m.exercises.map(ex => `- ${ex}`).join('\n'));
          }

          const content = ([descriptionText].concat(parts)).filter(Boolean).join('\n\n');

          return {
            title: titleText,
            description: descriptionText,
            content: content || `Detailed material for ${titleText}`,
          };
        });
      }
    } catch (e) {
      // fallthrough to fallback generation
      console.error('AI parse error in generateCourseOutline', e);
    }

    // Fallback: richer placeholder modules
    return Array.from({ length: module_count }).map((_, i) => ({
      title: `${title} - Module ${i + 1}`,
      description: `In-depth overview of topic ${i + 1} for ${title}.`,
      content: `Learning objectives:\n- Understand core idea ${i + 1}\n\nSections:\nIntroduction\nExplain the core concepts in detail with examples and step-by-step explanations.\n\nExamples:\n- Example demonstrating concept ${i + 1}.\n\nExercises:\n- Practice problem for concept ${i + 1} with suggested solution approach.`,
    }));
  }
}

export const aiService = new AiService();
export default AiService;
