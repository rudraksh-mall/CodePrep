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
    dispatch({ type: 'SET_LOADING', payload: true });

    const chatHistory = state.messages.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    try {
      const data = await aiApi.sendChatMessage({ message: text, chatHistory });
      const assistantMsg = {
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
      };
      dispatch({ type: 'ADD_MESSAGE', payload: assistantMsg });
    } catch {
      const errorMsg = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      };
      dispatch({ type: 'ADD_MESSAGE', payload: errorMsg });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [state.messages]);

  const clearChat = useCallback(() => {
    dispatch({ type: 'CLEAR' });
  }, []);

  return { ...state, sendMessage, clearChat };
}
