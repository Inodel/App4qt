export enum AppSection {
  HOME = 'HOME',
  ANIMAL_MAGIC = 'ANIMAL_MAGIC', // Facts
  MOOD_PAL = 'MOOD_PAL', // Replaces Image Gen (Text)
  GIGGLE_TIME = 'GIGGLE_TIME', // Stories
  POETRY_CORNER = 'POETRY_CORNER', // Replaces Video Gen (Text)
  CHAT_BUDDY = 'CHAT_BUDDY', // Chat
  WHEELS = 'WHEELS', // Interactive
  IMAGE_GEN = 'IMAGE_GEN', // Visuals
  VIDEO_GEN = 'VIDEO_GEN', // Motion
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isThinking?: boolean;
}