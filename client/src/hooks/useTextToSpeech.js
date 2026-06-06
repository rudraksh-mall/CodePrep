import { useRef, useCallback, useState } from 'react';

export function useTextToSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [supported, setSupported] = useState(
    typeof window !== 'undefined' && 'speechSynthesis' in window,
  );
  const currentUtterance = useRef(null);

  const speak = useCallback((text) => {
    if (!supported || isMuted || !text) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;

    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(
      (v) => v.lang.startsWith('en') && v.name.toLowerCase().includes('male'),
    ) || voices.find((v) => v.lang.startsWith('en')) || voices[0];
    if (preferred) utterance.voice = preferred;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    currentUtterance.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [supported, isMuted]);

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      if (!prev) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      }
      return !prev;
    });
  }, []);

  const replay = useCallback((text) => {
    if (!text) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1;
    currentUtterance.current = utterance;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  }, []);

  return { speak, stop, replay, toggleMute, isSpeaking, isMuted, supported };
}
