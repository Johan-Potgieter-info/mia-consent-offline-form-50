
import { useState, useEffect } from 'react';

const FORM_SESSION_KEY = 'formSessionId';

export const useFormSession = () => {
  const [sessionId, setSessionId] = useState<string>(() => {
    // Try to get existing session ID from localStorage
    const existingSessionId = localStorage.getItem(FORM_SESSION_KEY);
    if (existingSessionId) {
      return existingSessionId;
    }
    
    // Generate new session ID if none exists
    const newSessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    return newSessionId;
  });

  useEffect(() => {
    // Persist session ID to localStorage whenever it changes
    localStorage.setItem(FORM_SESSION_KEY, sessionId);
  }, [sessionId]);

  const clearSession = () => {
    localStorage.removeItem(FORM_SESSION_KEY);
    const newSessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    setSessionId(newSessionId);
  };

  const startNewSession = () => {
    const newSessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    setSessionId(newSessionId);
  };

  return {
    sessionId,
    clearSession,
    startNewSession
  };
};
