import { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { GEMINI_CONFIG, isGeminiConfigured } from '@/config/gemini';

interface GeminiMessage {
  role: 'user' | 'model';
  parts: string;
}

export const useGeminiAI = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Inicializar Gemini AI
  const genAI = new GoogleGenerativeAI(GEMINI_CONFIG.API_KEY);

  const generateResponse = async (userMessage: string, conversationHistory: GeminiMessage[] = []) => {
    if (!isGeminiConfigured()) {
      // Modo demo - respuestas predefinidas
      return generateDemoResponse(userMessage);
    }

    setIsLoading(true);
    setError(null);

    try {
      const model = genAI.getGenerativeModel({ 
        model: GEMINI_CONFIG.MODEL,
        safetySettings: GEMINI_CONFIG.SAFETY_SETTINGS,
        generationConfig: GEMINI_CONFIG.GENERATION_CONFIG
      });

      // Crear el historial de conversación con contexto de salud mental
      const systemPrompt = `Eres ArmonIA, un asistente de IA especializado en salud mental y bienestar emocional. Tu objetivo es:

1. Escuchar y validar las emociones del usuario
2. Ofrecer apoyo emocional empático y profesional
3. Sugerir técnicas de relajación y manejo del estrés
4. Guiar hacia recursos de bienestar mental
5. Mantener un tono cálido, comprensivo y no clínico
6. Si detectas crisis de salud mental, sugerir contactar profesionales

Responde en español, de manera conversacional y empática.`;

      const chat = model.startChat({
        history: [
          {
            role: 'user',
            parts: systemPrompt
          },
          {
            role: 'model',
            parts: 'Entendido. Soy ArmonIA, tu asistente de bienestar emocional. Estoy aquí para escucharte y apoyarte. ¿Cómo te sientes hoy?'
          },
          ...conversationHistory
        ],
      });

      const result = await chat.sendMessage(userMessage);
      const response = await result.response;
      const text = response.text();

      setIsLoading(false);
      return text;

    } catch (err) {
      console.error('Error con Gemini AI:', err);
      setError('Error al conectar con la IA. Intenta de nuevo.');
      setIsLoading(false);
      
      // Fallback a respuestas demo en caso de error
      return generateDemoResponse(userMessage);
    }
  };

  const generateDemoResponse = (userMessage: string): string => {
    const input = userMessage.toLowerCase();
    
    // Respuestas demo basadas en palabras clave
    if (input.includes('hola') || input.includes('hello') || input.includes('hi')) {
      return '¡Hola! Soy ArmonIA, tu asistente de bienestar emocional. Estoy aquí para escucharte y ayudarte con tu salud mental. ¿Cómo te sientes hoy?';
    }
    
    if (input.includes('triste') || input.includes('deprimido') || input.includes('mal')) {
      return 'Lamento que te sientas así. Es completamente normal tener días difíciles. ¿Te gustaría contarme qué está pasando? También puedo sugerirte algunas técnicas de respiración o ejercicios de relajación que podrían ayudarte.';
    }
    
    if (input.includes('feliz') || input.includes('bien') || input.includes('genial')) {
      return '¡Me alegra saber que te sientes bien! Es maravilloso tener días positivos. ¿Qué ha hecho que te sientas así de bien hoy? Compartir las experiencias positivas puede ayudarte a mantener este estado.';
    }
    
    if (input.includes('estrés') || input.includes('estresado') || input.includes('ansiedad')) {
      return 'El estrés y la ansiedad son muy comunes. Te sugiero probar la técnica de respiración 4-7-8: inhala por 4 segundos, mantén por 7, exhala por 8. También puedes visitar nuestra sección de Actividades para ejercicios de relajación.';
    }
    
    if (input.includes('ayuda') || input.includes('help')) {
      return 'Puedo ayudarte de varias maneras: analizar tus emociones, sugerir técnicas de relajación, escuchar tus preocupaciones, y guiarte hacia recursos útiles. También puedo ayudarte a identificar patrones en tu estado de ánimo.';
    }
    
    if (input.includes('gracias') || input.includes('thank you')) {
      return 'De nada, es un placer ayudarte. Recuerda que siempre estoy aquí cuando necesites hablar. Tu bienestar es importante. ¿Hay algo más en lo que pueda ayudarte?';
    }
    
    // Respuesta por defecto
    const defaultResponses = [
      'Gracias por compartir eso conmigo. Es importante expresar lo que sientes. ¿Cómo puedo apoyarte mejor en este momento?',
      'Entiendo lo que me cuentas. Cada experiencia es válida e importante. ¿Hay algo específico que te gustaría explorar?',
      'Aprecio tu confianza al compartir esto. ¿Te gustaría que hablemos sobre algunas técnicas que podrían ayudarte?',
      'Es normal sentir lo que describes. ¿Has notado algún patrón en estos sentimientos? A veces identificar desencadenantes puede ser útil.'
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  return {
    generateResponse,
    isLoading,
    error,
    clearError: () => setError(null)
  };
};
