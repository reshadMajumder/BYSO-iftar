import Image from 'next/image';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
}

export const Logo = ({ className }: LogoProps) => {
  return (
    <div className={cn('relative rounded-full bg-white p-1 overflow-hidden flex items-center justify-center', className)}>
      <Image
        fill
        src="https://res.cloudinary.com/dzgs1uhn0/image/upload/v1772363577/LOGO_1_3x_pcnffh.png"
        alt="BYSO IFTAR MAHFIL 2026 Logo"
        className="object-contain"
        unoptimized
      />
    </div>
  );
};
