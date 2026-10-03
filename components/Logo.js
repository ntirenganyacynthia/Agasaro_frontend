export default function Logo({ tagline }) {
  return (
    <div className="flex items-center gap-2">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent font-display text-lg font-semibold text-white">
        A
      </span>
      <div>
        <p className="font-display text-lg font-semibold leading-tight">Agasaro</p>
        {tagline && (
          <p className="text-[11px] uppercase tracking-wide text-white/60">{tagline}</p>
        )}
      </div>
    </div>
  );
}
