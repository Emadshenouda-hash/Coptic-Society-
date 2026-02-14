export type NewsArticle = {
  id: string;
  title: string;
  titleAr: string;
  date: string;
  slug: string;
  image: string;
  excerpt: string;
  excerptAr: string;
  content: string;
  contentAr: string;
};

export type Program = {
  id: string;
  title: string;
  titleAr: string;
  icon: React.ComponentType<{ className?: string }>;
  iconName: string;
  description: string;
  descriptionAr: string;
  gallery: string[];
};
