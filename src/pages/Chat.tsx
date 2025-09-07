import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, Bot, User, Activity, Brain, Lightbulb } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: number;
}

const aiResponses = [
  {
    trigger: ['hola', 'hello', 'hi', 'buenos días', 'buenas tardes'],
    response: '¡Hola! Soy tu compañero de IA de ArmonIA. Estoy aquí para escucharte y ayudarte con tu bienestar emocional. ¿Cómo te sientes hoy?'
  },
  {
    trigger: ['triste', 'deprimido', 'mal', 'horrible', 'terrible'],
    response: 'Lamento que te sientas así. Es completamente normal tener días difíciles. ¿Te gustaría contarme qué está pasando? También puedo sugerirte algunos ejercicios de respiración que podrían ayudarte.'
  },
  {
    trigger: ['feliz', 'bien', 'genial', 'excelente', 'fantástico'],
    response: '¡Me alegra saber que te sientes bien! Es maravilloso tener días positivos. ¿Qué ha hecho que te sientas así de bien hoy? Compartir las experiencias positivas puede ayudarte a mantener este estado.'
  },
  {
    trigger: ['estrés', 'estresado', 'ansiedad', 'ansioso', 'nervioso'],
    response: 'El estrés y la ansiedad son muy comunes. Respirar profundamente puede ayudar inmediatamente. ¿Has probado la técnica 4-7-8? Inhala por 4, mantén por 7, exhala por 8. También tenemos ejercicios interactivos en la sección de Actividades.'
  },
  {
    trigger: ['ayuda', 'help', 'qué puedes hacer', 'funciones'],
    response: 'Puedo ayudarte de varias maneras: analizar tus emociones, sugerir técnicas de relajación, escuchar tus preocupaciones, y guiarte hacia recursos útiles. También puedo ayudarte a identificar patrones en tu estado de ánimo.'
  },
  {
    trigger: ['respiración', 'respirar', 'ejercicios'],
    response: 'Los ejercicios de respiración son muy efectivos. Te recomiendo visitar nuestra sección de Actividades donde tienes una guía interactiva de respiración. También puedes probar ahora: inhala 4 segundos, mantén 4, exhala 6.'
  },
  {
    trigger: ['gracias', 'thank you'],
    response: 'De nada, es un placer ayudarte. Recuerda que siempre estoy aquí cuando necesites hablar. Tu bienestar es importante. ¿Hay algo más en lo que pueda ayudarte?'
  }
];

export const Chat: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load chat history
    if (user) {
      const key = `armonia_chat_${user.id}`;
      const storedMessages = localStorage.getItem(key);
      if (storedMessages) {
        setMessages(JSON.parse(storedMessages));
      } else {
        // Welcome message
        const welcomeMessage: ChatMessage = {
          id: '1',
          content: `¡Hola ${user.name}! Soy tu asistente de IA de ArmonIA. Estoy aquí para escucharte, apoyarte y ayudarte a entender mejor tus emociones. ¿Cómo te sientes hoy?`,
          sender: 'ai',
          timestamp: Date.now()
        };
        setMessages([welcomeMessage]);
      }
    }
  }, [user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Save chat history
    if (user && messages.length > 0) {
      const key = `armonia_chat_${user.id}`;
      localStorage.setItem(key, JSON.stringify(messages));
    }
  }, [messages, user]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const generateAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    // Find matching response
    const matchedResponse = aiResponses.find(response =>
      response.trigger.some(trigger => input.includes(trigger))
    );

    if (matchedResponse) {
      return matchedResponse.response;
    }

    // Default responses based on length and content
    if (input.length < 10) {
      return 'Entiendo. ¿Podrías contarme un poco más sobre lo que sientes? Estoy aquí para escucharte.';
    }

    // Sentiment analysis simulation
    const positiveWords = ['bien', 'feliz', 'genial', 'amor', 'alegre', 'contento', 'esperanza'];
    const negativeWords = ['mal', 'triste', 'dolor', 'problema', 'difícil', 'preocupado', 'miedo'];
    
    const hasPositive = positiveWords.some(word => input.includes(word));
    const hasNegative = negativeWords.some(word => input.includes(word));

    if (hasPositive && !hasNegative) {
      return 'Me alegra escuchar que tienes sentimientos positivos. Es importante reconocer y celebrar estos momentos. ¿Qué crees que ha contribuido a que te sientas así?';
    }

    if (hasNegative && !hasPositive) {
      return 'Escucho que estás pasando por un momento difícil. Es valiente de tu parte compartir esto conmigo. Recuerda que todos enfrentamos desafíos y está bien no estar bien todo el tiempo. ¿Te gustaría hablar sobre alguna estrategia que podría ayudarte?';
    }

    // Default empathetic response
    const defaultResponses = [
      'Gracias por compartir eso conmigo. Es importante expresar lo que sientes. ¿Cómo puedo apoyarte mejor en este momento?',
      'Entiendo lo que me cuentas. Cada experiencia es válida e importante. ¿Hay algo específico que te gustaría explorar o alguna forma en que pueda ayudarte?',
      'Aprecio tu confianza al compartir esto. ¿Te gustaría que hablemos sobre algunas técnicas que podrían ayudarte a manejar estos sentimientos?',
      'Es normal sentir lo que describes. ¿Has notado algún patrón en estos sentimientos? A veces identificar desencadenantes puede ser útil.'
    ];

    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: input.trim(),
      sender: 'user',
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse = generateAIResponse(input);
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        sender: 'ai',
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 2000); // Random delay between 1-3 seconds
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="h-[calc(100vh-2rem)] max-w-4xl mx-auto p-6 flex flex-col">
      <Card className="flex-1 flex flex-col shadow-soft">
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-6 w-6 text-primary" />
            Chat con IA - Asistente de Bienestar
          </CardTitle>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 animate-fade-in-up ${
                  message.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.sender === 'ai' && (
                  <Avatar className="h-8 w-8 bg-primary/10">
                    <AvatarFallback>
                      <Activity className="h-4 w-4 text-primary" />
                    </AvatarFallback>
                  </Avatar>
                )}
                
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-primary text-primary-foreground ml-auto'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p className="text-xs opacity-60 mt-1">
                    {new Date(message.timestamp).toLocaleTimeString('es-ES', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>

                {message.sender === 'user' && (
                  <Avatar className="h-8 w-8 bg-secondary/10">
                    <AvatarFallback>
                      <User className="h-4 w-4 text-secondary-foreground" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3 animate-fade-in-up">
                <Avatar className="h-8 w-8 bg-primary/10">
                  <AvatarFallback>
                    <Activity className="h-4 w-4 text-primary" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-muted text-muted-foreground px-4 py-2 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t p-4">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Comparte cómo te sientes o haz una pregunta..."
                className="flex-1"
                disabled={isTyping}
              />
              <Button 
                onClick={handleSendMessage}
                disabled={!input.trim() || isTyping}
                className="btn-hero"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="mt-4 flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setInput('¿Cómo puedo manejar el estrés?')}
          disabled={isTyping}
        >
          <Brain className="h-3 w-3 mr-1" />
          Manejar estrés
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setInput('Me siento ansioso, ¿qué puedo hacer?')}
          disabled={isTyping}
        >
          <Activity className="h-3 w-3 mr-1" />
          Ansiedad
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setInput('¿Puedes sugerirme ejercicios de respiración?')}
          disabled={isTyping}
        >
          <Lightbulb className="h-3 w-3 mr-1" />
          Ejercicios
        </Button>
      </div>
    </div>
  );
};