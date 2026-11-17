import { BookOpen, Award, FileText, Layers } from "lucide-react";

interface FeatureBullet {
  title: string;
  description: string;
  icon: typeof Award;
}

const FEATURE_BULLETS: FeatureBullet[] = [
  {
    title: "Tailored Diplomas",
    description:
      "Choose from specialized tracks like Frontend, Backend, and Mobile Development.",
    icon: Award,
  },
  {
    title: "Focused Exams",
    description:
      "Access topic-specific tests including HTML, CSS, JavaScript, and more.",
    icon: FileText,
  },
  {
    title: "Smart Multi-Step Forms",
    description:
      "Choose from specialized tracks like Frontend, Backend, and Mobile Development.",
    icon: Layers,
  },
];

export function AuthHero() {
  return (
    <section className="relative hidden lg:flex flex-col justify-between p-12 xl:p-16 bg-linear-to-br from-white via-brand-blue-50/30 to-brand-blue-100/50 border-e border-border/50">
      {/* Top Logo */}
      <div className="flex items-center gap-2.5">
        <div className="flex items-center justify-center size-8 rounded-lg bg-primary text-primary-foreground shadow-xs">
          <BookOpen className="size-4.5" />
        </div>
        <span className="font-bold text-lg tracking-tight text-foreground">
          Exam App
        </span>
      </div>

      {/* Middle Hero Content */}
      <div className="max-w-lg space-y-10 my-auto py-12">
        <h1 className="text-3xl xl:text-4xl font-bold tracking-tight text-foreground leading-tight">
          Empower your learning journey with our smart exam platform.
        </h1>

        <div className="space-y-6">
          {FEATURE_BULLETS.map((bullet) => {
            const Icon = bullet.icon;
            return (
              <div key={bullet.title} className="flex items-start gap-4">
                <div className="flex items-center justify-center size-10 rounded-lg border border-primary/20 bg-primary/5 text-primary shrink-0 shadow-2xs">
                  <Icon className="size-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-semibold text-primary">
                    {bullet.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {bullet.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom spacer / copyright */}
      <div className="text-xs text-muted-foreground">
        © {new Date().getFullYear()} Exam App. All rights reserved.
      </div>
    </section>
  );
}
