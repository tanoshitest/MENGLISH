export interface PronunciationSubmission {
  id: string;
  studentName: string;
  avatarUrl?: string;
  submittedAt: string;
  audioUrl: string;
  status: 'pending' | 'reviewed';
  feedback?: string;
  score?: number;
  textPrompt: string;
}

export const mockSubmissions: PronunciationSubmission[] = [
  {
    id: '1',
    studentName: 'Nguyễn Văn A',
    avatarUrl: 'https://i.pravatar.cc/150?u=a',
    submittedAt: '2026-04-03 10:30',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    status: 'reviewed',
    feedback: 'Phát âm tốt, cần chú ý âm đuôi "s".',
    score: 8.5,
    textPrompt: 'The quick brown fox jumps over the lazy dog.',
  },
  {
    id: '2',
    studentName: 'Trần Thị B',
    avatarUrl: 'https://i.pravatar.cc/150?u=b',
    submittedAt: '2026-04-03 14:15',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    status: 'pending',
    textPrompt: 'She sells seashells by the seashore.',
  },
  {
    id: '3',
    studentName: 'Lê Văn C',
    avatarUrl: 'https://i.pravatar.cc/150?u=c',
    submittedAt: '2026-04-03 15:00',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    status: 'pending',
    textPrompt: 'How much wood would a woodchuck chuck if a woodchuck could chuck wood?',
  },
];
