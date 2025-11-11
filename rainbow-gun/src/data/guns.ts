export interface Gun {
  id: string;
  name: string;
  soundUrl: string;
  imageUrl: string;
}

export const guns: Gun[] = [
  {
    id: 'scout',
    name: 'Scout',
    soundUrl: '/guns/scout.mp3',
    imageUrl: '/guns/scout.png',
  },
  {
    id: 'ak-47',
    name: 'AK-47',
    soundUrl: '/guns/ak-47.mp3',
    imageUrl: '/guns/ak-47.png',
  },
  {
    id: 'desert-eagle',
    name: 'Desert Eagle',
    soundUrl: '/guns/desert-eagle.mp3',
    imageUrl: '/guns/desert-eagle.png',
  },
];
