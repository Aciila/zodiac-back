/**
 * Simple in-memory session cache for storing conversation context
 */

export interface SessionData {
  zodiacSign?: string;
  birthDate?: string;
  walletAddress?: string;
  conversationHistory: Array<{
    role: 'user' | 'assistant' | 'system';
    content: string;
  }>;
  language?: 'en' | 'uk' | 'ru';
  lastUpdated: number;
}

class SessionCache {
  private cache: Map<string, SessionData> = new Map();
  private readonly TTL = 30 * 60 * 1000; // 30 minutes

  /**
   * Get session data by ID
   */
  get(sessionId: string): SessionData | null {
    const session = this.cache.get(sessionId);
    
    if (!session) {
      return null;
    }

    // Check if session expired
    if (Date.now() - session.lastUpdated > this.TTL) {
      this.cache.delete(sessionId);
      return null;
    }

    return session;
  }

  /**
   * Set or update session data
   */
  set(sessionId: string, data: Partial<SessionData>): void {
    const existing = this.cache.get(sessionId);
    
    const sessionData: SessionData = {
      zodiacSign: data.zodiacSign || existing?.zodiacSign,
      birthDate: data.birthDate || existing?.birthDate,
      walletAddress: data.walletAddress || existing?.walletAddress,
      conversationHistory: data.conversationHistory || existing?.conversationHistory || [],
      language: data.language || existing?.language || 'en',
      lastUpdated: Date.now(),
    };

    this.cache.set(sessionId, sessionData);
  }

  /**
   * Update conversation history
   */
  addMessage(sessionId: string, role: 'user' | 'assistant', content: string): void {
    const session = this.get(sessionId) || {
      conversationHistory: [],
      lastUpdated: Date.now(),
    };

    session.conversationHistory.push({ role, content });
    session.lastUpdated = Date.now();
    
    this.cache.set(sessionId, session);
  }

  /**
   * Delete session
   */
  delete(sessionId: string): void {
    this.cache.delete(sessionId);
  }

  /**
   * Clear all expired sessions
   */
  clearExpired(): void {
    const now = Date.now();
    for (const [sessionId, session] of this.cache.entries()) {
      if (now - session.lastUpdated > this.TTL) {
        this.cache.delete(sessionId);
      }
    }
  }

  /**
   * Get cache stats
   */
  getStats() {
    return {
      totalSessions: this.cache.size,
      sessions: Array.from(this.cache.entries()).map(([id, session]) => ({
        id,
        hasZodiac: !!session.zodiacSign,
        hasWallet: !!session.walletAddress,
        messageCount: session.conversationHistory.length,
        language: session.language,
        age: Math.floor((Date.now() - session.lastUpdated) / 1000),
      })),
    };
  }
}

// Export singleton instance
export const sessionCache = new SessionCache();

// Clean up expired sessions every 5 minutes
setInterval(() => {
  sessionCache.clearExpired();
}, 5 * 60 * 1000);
