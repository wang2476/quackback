const BRAND_GLOW =
  'radial-gradient(ellipse at center, color-mix(in oklch, var(--primary) 20%, transparent), transparent 70%)'

const GRID_LINES =
  'linear-gradient(to right, rgb(128 128 128) 1px, transparent 1px),' +
  'linear-gradient(to bottom, rgb(128 128 128) 1px, transparent 1px)'

const GRID_MASK = 'radial-gradient(ellipse 80% 62% at 50% 0%, #000 30%, transparent 78%)'

/** Shared decorative ground for every public portal tab. */
export function PortalBackground() {
  return (
    <div
      className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[32rem] overflow-hidden"
      aria-hidden="true"
    >
      <div
        className="absolute inset-0 opacity-[0.09] dark:opacity-[0.13]"
        style={{
          backgroundImage: GRID_LINES,
          backgroundSize: '52px 52px',
          maskImage: GRID_MASK,
          WebkitMaskImage: GRID_MASK,
        }}
      />
      <div
        className="absolute -top-32 left-1/2 h-80 w-[760px] max-w-full -translate-x-1/2 blur-2xl"
        style={{ background: BRAND_GLOW }}
      />
    </div>
  )
}
