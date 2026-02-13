export type NewsArticle = {
  id: string;
  title: string;
  date: string;
  slug: string;
  image: string;
  excerpt: string;
  content: string;
};

export type Program = {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  gallery: string[];
};
