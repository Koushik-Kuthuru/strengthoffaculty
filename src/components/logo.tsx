import { GraduationCap } from 'lucide-react';

export function Logo() {
  return (
    <div className="flex items-center justify-center gap-2" aria-label="Strength of Faculty home">
      <div className="bg-primary p-2 rounded-md">
        <GraduationCap className="h-6 w-6 text-primary-foreground" />
      </div>
      <span className="text-xl font-bold font-headline text-foreground">Strength of Faculty</span>
    </div>
  );
}
