import Image from "next/image";
import Link from "next/link";
import { ROUTES } from "@/routes";
import type { IDiploma } from "@/shared/lib/types/diploma";

interface DiplomaCardProps {
  diploma: IDiploma;
}

export function DiplomaCard({ diploma }: DiplomaCardProps) {
  return (
    <Link
      href={ROUTES.EXAMS.BY_DIPLOMA(diploma.id)}
      className="group relative flex flex-col items-center justify-end overflow-hidden rounded-2xl bg-muted aspect-[3/4] min-h-[360px] shadow-xs hover:shadow-xl transition-all duration-300 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary select-none cursor-pointer"
    >
      {/* Background Image */}
      {diploma.image ? (
        <Image
          src={diploma.image}
          alt={diploma.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground text-sm">
          No Image Available
        </div>
      )}

      {/* Styled Interactive Overlay Layer */}
      {/* Opacity fixed at 0.8 in all states (resting & hovered) */}
      {/* Resting: compact height ~56px showing only title */}
      {/* Hovered: expands smoothly to height: 216px, max-height: 216px, revealing description */}
      {/* Width is exactly 10px less than the diploma card image width */}
      <div className="relative z-10 mb-4 w-[calc(100%-10px)] max-w-[calc(100%-10px)] h-14 max-h-[216px] rounded-xl bg-primary text-white px-4 py-3.5 flex flex-col justify-center opacity-80 backdrop-blur-xs shadow-lg transition-all duration-300 ease-out group-hover:h-[216px] group-hover:justify-end group-hover:p-5 group-hover:-translate-y-1 overflow-hidden">
        {/* Title: always visible, expands to 2 lines on hover if needed */}
        <h3 className="text-base sm:text-lg font-bold tracking-tight text-white line-clamp-1 group-hover:line-clamp-2 transition-all duration-200">
          {diploma.title}
        </h3>

        {/* Description: hidden in resting state, fades and expands in on hover */}
        <div className="max-h-0 opacity-0 overflow-hidden transition-all duration-300 ease-out group-hover:max-h-36 group-hover:opacity-100 group-hover:mt-2">
          <p className="text-xs text-white/95 line-clamp-4 leading-relaxed font-normal">
            {diploma.description}
          </p>
        </div>
      </div>
    </Link>
  );
}
