export interface GeneratedContent {
  title: string;
  description: string;
  hashtags: string[];
  keywords: string[];
  pinnedComment: string;
}

export interface AlternativeTitle {
  title:string;
  seoScore: number;
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  videoTopic: string;
  content: GeneratedContent;
}