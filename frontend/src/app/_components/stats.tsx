'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, User, Heart, Plus } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { API_BASE_URL } from '@/lib/constants';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const totalCapacity = 1000;
const INITIAL_VISIBLE_COUNT = 12;

// Function to format unit names (convert underscores to spaces and capitalize)
const formatUnitName = (unitName: string): string => {
  return unitName
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

interface RegistrationStats {
  total_registered: number;
  unit_wise_count: { [key: string]: number };
  gender_count: {
    male: number;
    female: number;
    other?: number;
    unknown?: number;
  };
}

export default function Stats() {
  const [stats, setStats] = useState<RegistrationStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/stats/registration-stats/`);
        if (!response.ok) {
          throw new Error('Failed to fetch stats');
        }
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchStats();
  }, []);

  const unitData = stats
    ? Object.entries(stats.unit_wise_count)
      .map(([unit, count]) => ({ name: unit, count }))
      .sort((a, b) => a.name.localeCompare(b.name))
    : [];

  const showMore = () => {
    setVisibleCount(unitData.length);
  };

  if (isLoading) {
    return (
      <section className="py-12 sm:py-16 lg:py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <Skeleton className="h-8 sm:h-10 lg:h-12 w-1/2 mx-auto" />
            <Skeleton className="h-4 sm:h-6 w-3/4 mx-auto mt-2" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-12">
            <Skeleton className="h-32 sm:h-36 lg:h-40 w-full" />
            <Skeleton className="h-32 sm:h-36 lg:h-40 w-full" />
            <Skeleton className="h-32 sm:h-36 lg:h-40 w-full" />
          </div>
          <Skeleton className="h-48 sm:h-56 lg:h-64 w-full" />
        </div>
      </section>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-transparent overflow-hidden font-body">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-headline leading-tight">Registration at a Glance</h2>
          <p className="text-base sm:text-lg text-muted-foreground mt-2 font-body px-4">See who's joining this year's Iftar Mahfil!</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-12">
          {[
            { title: "Total Registered", value: stats.total_registered, span: `/${totalCapacity}`, icon: <Users className="h-6 w-6 text-accent" />, color: "text-accent" },
            { title: "Male Members", value: stats.gender_count.male || 0, icon: <User className="h-6 w-6 text-primary" />, color: "text-primary" },
            { title: "Female Members", value: stats.gender_count.female || 0, icon: <Heart className="h-6 w-6 text-pink-500" />, color: "text-pink-500" }
          ].map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="text-center shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <CardTitle className="flex items-center justify-center gap-2 sm:gap-3 text-sm sm:text-base">
                    {item.icon}
                    <span className="font-headline leading-tight">{item.title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className={cn("text-3xl sm:text-4xl lg:text-5xl font-bold", item.color)}>
                    {item.value}
                    {item.span && <span className="text-xl sm:text-2xl lg:text-3xl text-muted-foreground">{item.span}</span>}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Card className="shadow-lg hover:shadow-2xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-center text-xl sm:text-2xl font-headline">Unit-wise Registrations</CardTitle>
            </CardHeader>
            <CardContent>
              {unitData.length === 0 ? (
                <div className="text-center py-8 sm:py-12 bg-accent/5 rounded-xl border border-dashed border-accent/20">
                  <p className="text-lg sm:text-xl text-muted-foreground font-body px-4">
                    No registrations yet. <br />
                    <span className="text-accent font-bold italic">Be the first to start the registration!</span>
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
                  {unitData.slice(0, visibleCount).map((unit, index) => (
                    <motion.div
                      key={unit.name}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: 0.5 + (index % 12) * 0.05 }}
                    >
                      <Card className="text-center shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 h-full flex flex-col">
                        <CardHeader className="p-3 sm:p-4 flex-shrink-0">
                          <CardTitle className="text-sm sm:text-base lg:text-lg font-headline leading-tight break-words min-h-[2.5rem] sm:min-h-[3rem] flex items-center justify-center">
                            <span className="line-clamp-2">{formatUnitName(unit.name)}</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="p-3 sm:p-4 flex-grow flex flex-col justify-center">
                          <p className="text-2xl sm:text-3xl font-bold text-primary">{unit.count}</p>
                          <p className="text-xs sm:text-sm text-muted-foreground">Registered</p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
            {visibleCount < unitData.length && (
              <CardFooter className="justify-center">
                <Button onClick={showMore} variant="outline" className="hover:bg-primary/10">
                  <Plus className="mr-2 h-4 w-4" />
                  Load More
                </Button>
              </CardFooter>
            )}
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
