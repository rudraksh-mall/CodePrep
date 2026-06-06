import { useReducer, useCallback } from 'react';
import * as aiApi from '../api/ai.api';

const initialState = {
  messages: [],
  isLoading: false,
};

function reducer(state, action) {
  switch (action.type) {
    case 'ADD_MESSAGE':
      return { ...state, messages: [...state.messages, action.payload] };
    case 'UPDATE_LAST_MESSAGE':
      if (state.messages.length === 0) return state;
      const messages = state.messages.map((msg, i) => {
        if (i === state.messages.length - 1) {
          return { ...msg, content: msg.content + action.payload };
        }
        return msg;
      });
      return { ...state, messages };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'CLEAR':
      return { ...initialState };
    default:
      return state;
  }
}

export default function useChat() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const sendMessage = useCallback(async (text) => {
    const userMsg = { role: 'user', content: text, timestamp: new Date() };
    dispatch({ type: 'ADD_MESSAGE', payload: userMsg });

    const assistantPlaceholder = { role: 'assistant', content: '', timestamp: new Date() };
    dispatch({ type: 'ADD_MESSAGE', payload: assistantPlaceholder });
    dispatch({ type: 'SET_LOADING', payload: true });

    const chatHistory = state.messages.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    try {
      const { reader, decoder } = await aiApi.sendChatMessageStream({
        message: text,
        chatHistory,
      });

      let buffer = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || !trimmed.startsWith('data: ')) continue;

          const data = trimmed.slice(6);
          if (data === '[DONE]') continue;

          try {
            const parsed = JSON.parse(data);
            if (parsed.chunk) {
              dispatch({ type: 'UPDATE_LAST_MESSAGE', payload: parsed.chunk });
            }
          } catch {
            /* skip malformed chunk */
          }
        }
      }
    } catch {
      dispatch({
        type: 'UPDATE_LAST_MESSAGE',
        payload: '\n\n_Sorry, I encountered an error. Please try again._',
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [state.messages]);

  const clearChat = useCallback(() => {
    dispatch({ type: 'CLEAR' });
  }, []);

  return { ...state, sendMessage, clearChat };
}
