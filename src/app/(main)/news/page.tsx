import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { newsArticles } from '@/lib/content';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'News & Updates',
  description: 'Stay up-to-date with the latest news, events, and announcements from the Al-Birr Society.',
};

export default function NewsPage() {
  return (
    <div className="bg-background">
      <div className="container py-16 lg:py-24">
        <div className="text-center">
          <h1 className="font-headline text-4xl md:text-5xl text-primary">News & Updates</h1>
          <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
            Follow our journey and see the impact of your support through our latest news, events, and announcements.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {newsArticles.map((article) => {
            const articleImage = PlaceHolderImages.find(p => p.id === article.image);
            return (
              <Card key={article.id} id={article.slug} className="overflow-hidden flex flex-col shadow-lg transition-transform hover:-translate-y-1">
                {articleImage && (
                  <div className="relative h-56 w-full">
                    <Image
                      src={articleImage.imageUrl}
                      alt={articleImage.description}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      data-ai-hint={articleImage.imageHint}
                    />
                  </div>
                )}
                <CardHeader>
                  <span className="text-sm text-muted-foreground">
                    {new Date(article.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </span>
                  <CardTitle className="font-headline text-xl">{article.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-muted-foreground">{article.excerpt}</p>
                </CardContent>
                <CardFooter>
                  {/* In a real app, this would link to a dynamic route like /news/[slug] */}
                  <Button variant="link" className="p-0 text-accent hover:text-accent/80">
                    Read Full Story <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
