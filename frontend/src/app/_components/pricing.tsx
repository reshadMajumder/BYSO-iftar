
'use client';

import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Ticket, CheckCircle2, Star, Crown, Shield, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export default function Pricing() {
  const features = [
    'Delicious Iftar Spread',
    'Fellowship & Brotherhood',
    'Interactive Photo Booth Access',
    'Networking with BYSO Members'
  ];

  const tiers = [
    { name: 'Founding Member', price: 600, icon: <Crown className="h-8 w-8 text-amber-400" />, highlight: true },
    { name: 'Committee Leader', price: 500, icon: <Shield className="h-8 w-8 text-sky-400" />, highlight: false },
    { name: 'General Member', price: 400, icon: <Star className="h-8 w-8 text-accent" />, highlight: false },
    { name: 'School Member', price: 300, icon: <Users className="h-8 w-8 text-green-400" />, highlight: false },
  ];

  return (
    <section className="py-24 bg-transparent relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold font-headline mb-4">Registration Details</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-body">
            Secure your spot for the BYSO Iftar Mahfil 2026. Choose your membership tier below.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="max-w-5xl mx-auto"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {tiers.map((tier, index) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className={cn(
                  "relative overflow-hidden border bg-background shadow-lg hover:shadow-2xl transition-all duration-500 text-center p-6",
                  tier.highlight && "border-accent/40 ring-2 ring-accent/20"
                )}>
                  <div className="flex flex-col items-center gap-4">
                    <div className="bg-accent/10 p-3 rounded-full">
                      {tier.icon}
                    </div>
                    <h3 className="font-headline text-lg font-bold">{tier.name}</h3>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-black text-foreground tracking-tighter">{tier.price}</span>
                      <span className="text-lg font-bold text-accent">TK</span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          <Card className="relative overflow-hidden border-accent/20 bg-background shadow-xl p-8">
            <h3 className="text-xl font-bold font-headline mb-6 flex items-center gap-2">
              What&apos;s Included for All Tiers
              <div className="h-px flex-grow bg-border/50"></div>
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {features.map((feature, i) => (
                <li key={i} className="flex items-start gap-3 group/item">
                  <CheckCircle2 className="h-5 w-5 text-accent shrink-0 mt-0.5 group-hover/item:scale-110 transition-transform" />
                  <span className="text-muted-foreground text-sm font-body leading-relaxed">{feature}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-col sm:flex-row items-center gap-6">
              <Button asChild size="lg" className="w-full sm:w-auto px-10 py-7 text-lg font-bold shadow-xl shadow-accent/20 bg-accent text-accent-foreground hover:bg-accent/90 hover:scale-105 transition-all">
                <Link href="/register" className="flex items-center gap-2">
                  <Ticket className="h-5 w-5" />
                  Register Now
                </Link>
              </Button>
              <p className="text-xs text-muted-foreground italic text-center sm:text-left">
                *Limited capacity available. <br className="hidden sm:block" />
                Register early to avoid disappointment.
              </p>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
