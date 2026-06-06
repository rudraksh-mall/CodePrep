import { useState, useRef, useCallback, useEffect } from 'react';

export function useSpeechToText() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [supported, setSupported] = useState(
    typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window),
  );
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (!supported) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      let final = '';
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          final += event.results[i][0].transcript + ' ';
        } else {
          interim += event.results[i][0].transcript;
        }
      }
      if (final) setTranscript((prev) => prev + final);
      setInterimTranscript(interim);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;

    return () => {
      try { recognition.abort(); } catch {}
    };
  }, [supported]);

  const startListening = useCallback(() => {
    const recognition = recognitionRef.current;
    if (!recognition) return;
    setTranscript('');
    setInterimTranscript('');
    recognition.start();
    setIsListening(true);
  }, []);

  const stopListening = useCallback(() => {
    const recognition = recognitionRef.current;
    if (!recognition) return;
    recognition.stop();
    setIsListening(false);
  }, []);

  const getTranscript = useCallback(() => {
    const final = (transcript + ' ' + interimTranscript).trim();
    setTranscript('');
    setInterimTranscript('');
    return final;
  }, [transcript, interimTranscript]);

  return {
    isListening,
    transcript,
    interimTranscript,
    supported,
    startListening,
    stopListening,
    getTranscript,
  };
}
