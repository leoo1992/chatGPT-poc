import React, {useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

export default function useGPT() {
  const [isPressed, setIsPressed] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [answer, setAnswer] = useState("");
  const [question, setQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const key = import.meta.env.VITE_GOOGLE_API_KEY;
  const genAI = new GoogleGenerativeAI(key);
  const [isMobileLandscape, setIsMobileLandscape] = useState(false);

  async function handleSubmit(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter" && question.trim() !== "") {
      setIsLoading(true);
      const model = genAI.getGenerativeModel({
        model: "gemini-1.0-pro-latest",
      });
      const prompt = question;
      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();
      setAnswer(text);
      setQuestion("");
      setIsPressed(false);
      setIsLoading(false);
    }
  }

  async function handleSubmit2() {
    if (question.trim() !== "") {
      setIsLoading(true);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const prompt = question;
      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();
      setAnswer(text);
      setQuestion("");
      setIsPressed(false);
      setIsLoading(false);
    }
  }

  async function startRecording() {
    setIsRecording(true);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-expect-error
    const recognition = window.webkitSpeechRecognition;
    if (!recognition) {
      console.error("O navegador não suporta o reconhecimento de voz.");
      setIsRecording(false);
      setIsPressed(false);
      return;
    }

    const recognitionInstance = new recognition();
    recognitionInstance.lang = "pt-BR";
    recognitionInstance.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setQuestion(transcript);
      stopRecording();
    };
    recognitionInstance.onend = () => {
      setIsRecording(false);
      setIsPressed(false);
    };
    recognitionInstance.start();
  }

  function stopRecording() {
    setIsRecording(false);
    setIsPressed(false);
    handleSubmit2();
  }

  const toggleFullScreen = () => {
    setIsFullScreen((prev) => !prev);
  };

  return {
    handleSubmit2,
    handleSubmit,
    isPressed,
    answer,
    isLoading,
    setIsPressed,
    setAnswer,
    setQuestion,
    question,
    isRecording,
    startRecording,
    stopRecording,
    isFullScreen,
    setIsFullScreen,
    toggleFullScreen,
    isMobileLandscape,
    setIsMobileLandscape
  };
}