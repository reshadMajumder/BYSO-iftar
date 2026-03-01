import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen } from 'lucide-react';

export default function OurStory() {
  const storyImage = PlaceHolderImages.find(p => p.id === 'our-story');

  return (
    <section className="py-20 bg-transparent">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold font-headline flex items-center justify-center gap-4">
            <BookOpen className="h-10 w-10 text-accent" />
            Our Story
          </h2>
          <p className="text-lg text-muted-foreground mt-2">A decade of humanitarian service by BYSO.</p>
        </div>

        <Card className="overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
          <CardContent className="p-0">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <h3 className="font-headline text-3xl font-bold mb-4">10 Years of Serving Humanity</h3>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    Bangladesh Youngstar Social Organization (BYSO) has been carrying out numerous humanitarian activities over the past 10 years. The organization has supported students by bearing their educational expenses, distributed winter clothing during cold seasons, and provided relief materials to flood-affected people across the country. BYSO has also built houses for families affected by fire and floods.
                  </p>
                  <p>
                    During the COVID-19 pandemic, thousands of people received food assistance through BYSO. Through its self-reliance projects, more than a hundred families have become financially empowered. To combat climate change, the organization has planted over 200,000 trees. Every Ramadan, BYSO arranges special humanitarian programs including iftar distribution and Eid support for the underprivileged.
                  </p>
                  <p>
                    Alongside these humanitarian projects, BYSO also arranges the annual Iftar Mahfil to foster brotherhood and strengthen bonds among its members.
                  </p>
                </div>
              </div>
              <div className="relative min-h-[300px] lg:min-h-[400px]">
                {storyImage && (
                  <Image
                    src={storyImage.imageUrl}
                    alt={storyImage.description}
                    fill
                    className="object-cover"
                    data-ai-hint={storyImage.imageHint}
                  />
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
