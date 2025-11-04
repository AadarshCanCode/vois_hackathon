import { env } from '../../config/env';

class AiService {
  private readonly geminiModel = 'gemini-2.0-flash';
  private readonly geminiBaseUrl = 'https://generativelanguage.googleapis.com/v1beta';

  private get apiKey() {
    return env.geminiApiKey;
  }

  isEnabled(): boolean {
    return Boolean(this.apiKey);
  }

  private assertApiKey() {
    if (!this.apiKey) {
      throw new Error('Gemini API key missing. Set GEMINI_API_KEY in your environment.');
    }
  }

  private async chatGemini(prompt: string, systemPrompt?: string): Promise<string> {
    this.assertApiKey();

    const endpoint = `${this.geminiBaseUrl}/models/${this.geminiModel}:generateContent?key=${this.apiKey}`;
    const contents = {
      contents: [
        ...(systemPrompt ? [{ role: 'user', parts: [{ text: `System: ${systemPrompt}` }] }] : []),
        { role: 'user', parts: [{ text: prompt }] }
      ],
      generationConfig: { temperature: 0.6, maxOutputTokens: 1200 }
    };

    const resp = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contents)
    });

    if (!resp.ok) {
      let errText = await resp.text();
      try {
        const json = JSON.parse(errText) as Record<string, unknown>;
        if (json.error && typeof json.error === 'object') {
          const errorObj = json.error as Record<string, unknown>;
          if (errorObj.message) {
            errText = String(errorObj.message);
          }
        }
      } catch {
        // ignore parse errors; use raw text
      }
      throw new Error(`Gemini error ${resp.status}: ${errText}`);
    }

    const data = (await resp.json()) as Record<string, unknown>;
    const candidates = data.candidates;
    if (Array.isArray(candidates) && candidates.length > 0) {
      const first = candidates[0] as Record<string, unknown>;
      const content = first.content as Record<string, unknown> | undefined;
      const parts = content?.parts;
      if (Array.isArray(parts)) {
        return parts
          .map(part => {
            if (part && typeof part === 'object' && 'text' in part) {
              return String((part as Record<string, unknown>).text ?? '');
            }
            return '';
          })
          .join('')
          .trim();
      }
    }
    return '';
  }

  async chat(prompt: string, systemPrompt?: string): Promise<string> {
    return this.chatGemini(prompt, systemPrompt);
  }

  async generateQuestions(topics: string[], difficulty: 'easy' | 'medium' | 'hard', count = 5) {
    const system = 'You generate high-quality cybersecurity multiple-choice questions. Return a strict JSON array of objects: {id, question, options, correctAnswer, explanation}. Do not include prose.';
    const prompt = `Topics: ${topics.join(', ')}\nDifficulty: ${difficulty}\nCount: ${count}\nReturn JSON only.`;
    const text = await this.chat(prompt, system);

    try {
      const start = text.indexOf('[');
      const end = text.lastIndexOf(']');
      const json = text.slice(start, end + 1);
      return JSON.parse(json);
    } catch {
      return topics.slice(0, count).map((t, i) => ({
        id: `gen-${i}`,
        question: `Placeholder question about ${t}?`,
        options: ['A', 'B', 'C', 'D'],
        correctAnswer: 0,
        explanation: `Review topic ${t}.`
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
    const {
      title,
      description,
      category = '',
      difficulty = 'beginner',
      estimated_hours = 0,
      module_count = 5,
      detailLevel = 'comprehensive'
    } = params;

    const system = 'You are an expert course designer. Given the course metadata, produce a detailed JSON structure only (no prose) describing a full course outline suitable for teaching students. Return a JSON object with a `modules` array. Each module should be an object with: title, description, learningObjectives (array), sections (array of {heading,text}), examples (array), exercises (array). Do not return any additional text outside the JSON block.';
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
          const titleText = String(m.title ?? '').trim();
          const descriptionText = String(m.description ?? '').trim();
          const parts: string[] = [];

          if (Array.isArray(m.learningObjectives) && m.learningObjectives.length) {
            parts.push('Learning objectives:\n' + m.learningObjectives.map(o => `- ${o}`).join('\n'));
          }
          if (Array.isArray(m.sections) && m.sections.length) {
            parts.push(
              m.sections
                .map(section => `${section.heading ? `\n${section.heading}\n` : ''}${section.text ?? ''}`)
                .join('\n\n')
            );
          }
          if (Array.isArray(m.examples) && m.examples.length) {
            parts.push('\nExamples:\n' + m.examples.map(e => `- ${e}`).join('\n'));
          }
          if (Array.isArray(m.exercises) && m.exercises.length) {
            parts.push('\nExercises:\n' + m.exercises.map(ex => `- ${ex}`).join('\n'));
          }

          const content = [descriptionText, ...parts].filter(Boolean).join('\n\n');

          return {
            title: titleText,
            description: descriptionText,
            content: content || `Detailed material for ${titleText}`
          };
        });
      }
    } catch (error) {
      console.error('AI parse error in generateCourseOutline', error);
    }

    return Array.from({ length: params.module_count ?? 5 }).map((_, i) => ({
      title: `${params.title} - Module ${i + 1}`,
      description: `In-depth overview of topic ${i + 1} for ${params.title}.`,
      content: `Learning objectives:\n- Understand core idea ${i + 1}\n\nSections:\nIntroduction\nExplain the core concepts in detail with examples and step-by-step explanations.\n\nExamples:\n- Example demonstrating concept ${i + 1}.\n\nExercises:\n- Practice problem for concept ${i + 1} with suggested solution approach.`
    }));
  }
}

export const aiService = new AiService();
