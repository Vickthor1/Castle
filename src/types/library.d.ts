export type AppSource =
  | 'steam'
  | 'epic'
  | 'gog'
  | 'ea'
  | 'ubisoft'
  | 'battlenet'
  | 'xbox'
  | 'riot'
  | 'minecraft'
  | 'portable'
  | 'program'
  | 'folder'
  | 'other';

export type AppItem = {
  id: string;
  name: string;
  description?: string;
  category?: string;
  tags: string[];
  source: AppSource;
  sourceLabel: string;
  favorite: boolean;
  pinned: boolean;
  hidden: boolean;
  path?: string;
  targetPath?: string;
  executable?: string;
  sourceType?: 'exe' | 'lnk';
  icon?: string;
  banner?: string;
  version?: string;
  sizeBytes?: number;
  lastLaunchedAt?: string;
  firstLaunchedAt?: string;
  launchCount: number;
  totalRunSeconds: number;
  createdAt: string;
  updatedAt: string;
  publisher?: string;
};

export type CategoryItem = {
  id: string;
  name: string;
  items: string[];
};

export type CollectionItem = {
  id: string;
  name: string;
  description?: string;
  items: string[];
};

export type LibraryMeta = {
  favorites: string[];
  pinned: string[];
  hidden: string[];
  categories: CategoryItem[];
  collections: CollectionItem[];
  tags: Record<string, string[]>;
  recent: string[];
  usage: Record<string, number>;
  history: string[];
  ordering: string[];
};
