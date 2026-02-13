import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about the history, mission, and vision of the Grand Coptic Benevolent Society, founded in 1881.',
};


export default function AboutPage() {
  const heritageImage = PlaceHolderImages.find(img => img.id === 'about-heritage');
  return (
    <div className="bg-background">
      <div className="container py-16 lg:py-24">
        <div className="text-center">
          <h1 className="font-headline text-4xl md:text-5xl text-primary">Our Story of Service</h1>
          <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
            Founded in 1881, the Grand Coptic Benevolent Society has a long and proud history of compassionate service and community building.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-12 md:grid-cols-2 items-center">
           <div className="prose prose-lg max-w-none text-foreground">
            <h2 className="font-headline text-primary">Our Mission</h2>
            <p>
              To serve needy families of all backgrounds, enhance social justice and dignity, and promote cultural, scientific, and religious awareness. We are a charitable, non-profit organisation committed to making a tangible difference in the lives of the most vulnerable.
            </p>
            <h2 className="font-headline text-primary">Our Vision</h2>
            <p>
              We envision a society where every individual has the opportunity to live a life of dignity, health, and purpose. We strive to be a leading force in combating poverty and illiteracy, working hand-in-hand with communities to build a brighter, more equitable future for all Egyptians.
            </p>
           </div>
          {heritageImage && (
            <div className="relative h-96 w-full rounded-lg shadow-lg overflow-hidden">
               <Image
                src={heritageImage.imageUrl}
                alt={heritageImage.description}
                fill
                className="object-cover"
                data-ai-hint={heritageImage.imageHint}
              />
            </div>
          )}
        </div>

        <div className="mt-20">
            <Card className="bg-secondary">
                <CardHeader>
                    <CardTitle className="font-headline text-2xl text-primary">Official Registration</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">
                        The Grand Coptic Benevolent Society (الجمعية القبطية الخيرية الكبرى) is officially registered in Cairo under registration number <strong className="text-foreground">1080</strong> on <strong className="text-foreground">April 29, 1967</strong>. Our headquarters are located at 175 Ramsis Street, Cairo, with branches across Egypt.
                    </p>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
