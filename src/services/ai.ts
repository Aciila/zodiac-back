import OpenAI from "openai";

export interface AIConfig {
  apiKey: string;
  model?: string;
  temperature?: number;
  max_completion_tokens?: number;
  systemPrompt?: string;
}

export interface ChatRequest {
  prompt: string;
  conversationHistory?: Array<{
    role: "user" | "assistant" | "system";
    content: string;
  }>;
}

export interface ChatResponse {
  response: string;
  model: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export class AIService {
  private openai: OpenAI;
  private config: Required<Omit<AIConfig, "apiKey">>;

  constructor(config: AIConfig) {
    this.openai = new OpenAI({
      apiKey: config.apiKey,
    });

    // Default settings
    this.config = {
      model: config.model || "gpt-3.5-turbo",
      temperature: config.temperature ?? 0.7,
      max_completion_tokens: config.max_completion_tokens || 4000,
      systemPrompt: config.systemPrompt || "You are a helpful AI assistant.",
    };
  }

  /**
   * Update initial knowledge (system prompt)
   */
  setSystemPrompt(systemPrompt: string): void {
    this.config.systemPrompt = systemPrompt;
  }

  /**
   * Get current system prompt
   */
  getSystemPrompt(): string {
    return this.config.systemPrompt;
  }

  /**
   * Update AI model
   */
  setModel(model: string): void {
    this.config.model = model;
  }

  /**
   * Update temperature (creativity of responses)
   */
  setTemperature(temperature: number): void {
    this.config.temperature = temperature;
  }

  /**
   * Main method for chatting with AI
   */
  async chat(request: ChatRequest): Promise<ChatResponse> {
    const messages: Array<{
      role: "user" | "assistant" | "system";
      content: string;
    }> = [
      {
        role: "system",
        content: this.config.systemPrompt,
      },
    ];

    // Add conversation history if exists
    if (request.conversationHistory && request.conversationHistory.length > 0) {
      messages.push(...request.conversationHistory);
    }

    // Add current prompt
    messages.push({
      role: "user",
      content: request.prompt,
    });

    const completion = await this.openai.chat.completions.create({
      model: this.config.model,
      messages,
      temperature: this.config.temperature,
      max_completion_tokens: this.config.max_completion_tokens,
    });

    const response =
      completion.choices[0]?.message?.content || "No response generated";

    return {
      response,
      model: completion.model,
      usage: completion.usage
        ? {
            prompt_tokens: completion.usage.prompt_tokens,
            completion_tokens: completion.usage.completion_tokens,
            total_tokens: completion.usage.total_tokens,
          }
        : undefined,
    };
  }

  /**
   * Simple request without history
   */
  async simpleChat(prompt: string): Promise<string> {
    const result = await this.chat({ prompt });
    return result.response;
  }
}
