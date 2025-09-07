import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export interface MoodType {
  id: string;
  name: string;
  emoji: string;
  value: number;
  color: string;
}

const moods: MoodType[] = [
  { id: 'down', name: 'Triste', emoji: '😔', value: 1, color: 'mood-down' },
  { id: 'content', name: 'Content@', emoji: '😊', value: 2, color: 'mood-content' },
  { id: 'peaceful', name: 'Tranquil@', emoji: '😌', value: 3, color: 'mood-peaceful' },
  { id: 'happy', name: 'Feliz', emoji: '🤗', value: 4, color: 'mood-happy' },
  { id: 'excited', name: 'Emocionad@', emoji: '✨', value: 5, color: 'mood-excited' },
];

interface MoodSliderProps {
  onMoodSelect?: (mood: MoodType) => void;
  selectedMood?: MoodType | null;
  variant?: 'interactive' | 'display';
}

export const MoodSlider: React.FC<MoodSliderProps> = ({ 
  onMoodSelect, 
  selectedMood,
  variant = 'interactive' 
}) => {
  const [currentMood, setCurrentMood] = useState<MoodType | null>(selectedMood || null);

  const handleMoodClick = (mood: MoodType) => {
    setCurrentMood(mood);
    onMoodSelect?.(mood);
  };

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
        {moods.map((mood) => (
          <Button
            key={mood.id}
            variant="ghost"
            className={`
              btn-mood relative group min-h-20 flex-1 max-w-24
              ${currentMood?.id === mood.id ? mood.color + ' scale-110' : ''}
              ${variant === 'display' ? 'cursor-default' : 'cursor-pointer'}
            `}
            onClick={() => variant === 'interactive' && handleMoodClick(mood)}
            disabled={variant === 'display'}
          >
            <div className="flex flex-col items-center gap-2">
              <span className="text-2xl group-hover:scale-125 transition-transform duration-200">
                {mood.emoji}
              </span>
              <span className="text-xs font-medium">{mood.name}</span>
            </div>
            
            {currentMood?.id === mood.id && variant === 'interactive' && (
              <div className="absolute inset-0 rounded-xl bg-primary/10 border-2 border-primary animate-pulse" />
            )}
          </Button>
        ))}
      </div>
      
      {currentMood && (
        <Card className="mt-4 p-4 bg-primary/5 border-primary/20">
          <p className="text-center text-sm text-muted-foreground">
            Tu te estas sientiendo <span className="font-medium text-primary">{currentMood.name}</span> hoy.
          </p>
        </Card>
      )}
    </div>
  );
};

export { moods };