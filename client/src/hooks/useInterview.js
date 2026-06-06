import { useMutation } from '@tanstack/react-query';
import * as interviewApi from '../api/interview.api';

export function useStartInterview() {
  return useMutation({
    mutationFn: interviewApi.startInterview,
  });
}

export function useAnswerInterview() {
  return useMutation({
    mutationFn: interviewApi.answerInterview,
  });
}

export function useEndInterview() {
  return useMutation({
    mutationFn: interviewApi.endInterview,
  });
}
