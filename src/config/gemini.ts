// Configuración de Gemini AI
export const GEMINI_CONFIG = {
  // Para usar Gemini AI real, reemplaza 'demo-key' con tu API key de Google AI
  // Obtén tu API key en: https://makersuite.google.com/app/apikey
  API_KEY: import.meta.env.VITE_GEMINI_API_KEY || 'demo-key',
  
  // Configuración del modelo
  MODEL: 'gemini-pro',
  
  // Configuración de seguridad
  SAFETY_SETTINGS: [
    {
      category: 'HARM_CATEGORY_HARASSMENT',
      threshold: 'BLOCK_MEDIUM_AND_ABOVE',
    },
    {
      category: 'HARM_CATEGORY_HATE_SPEECH',
      threshold: 'BLOCK_MEDIUM_AND_ABOVE',
    },
    {
      category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
      threshold: 'BLOCK_MEDIUM_AND_ABOVE',
    },
    {
      category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
      threshold: 'BLOCK_MEDIUM_AND_ABOVE',
    },
  ],
  
  // Configuración de generación
  GENERATION_CONFIG: {
    temperature: 0.7,
    topK: 40,
    topP: 0.95,
    maxOutputTokens: 1024,
  }
};

// Función para verificar si la API key está configurada
export const isGeminiConfigured = () => {
  return GEMINI_CONFIG.API_KEY && GEMINI_CONFIG.API_KEY !== 'demo-key';
};
