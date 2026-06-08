/**
 * 주식이 — the user's hand-made mascot, one image per mood (public/joosik-*.png).
 * Each is an 840×960 transparent avatar with the character in the top-left and a
 * small baked-in label at the bottom; we crop to the head-and-shoulders box (above
 * the label) via background-position (UI) and drawImage source-rect (PNG export).
 * Tweak JOOSIK_BBOX if the crop needs nudging.
 */

export const JOOSIK_FULL = { w: 840, h: 960 };
export const JOOSIK_BBOX = { sx: 0, sy: 0, sw: 330, sh: 312 };

export function JoosikImg({
  src,
  height = 56,
  className,
}: {
  src: string;
  height?: number;
  className?: string;
}) {
  const k = height / JOOSIK_BBOX.sh;
  return (
    <div
      className={className}
      aria-hidden
      style={{
        width: JOOSIK_BBOX.sw * k,
        height: JOOSIK_BBOX.sh * k,
        backgroundImage: `url(${src})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: `${JOOSIK_FULL.w * k}px ${JOOSIK_FULL.h * k}px`,
        backgroundPosition: `-${JOOSIK_BBOX.sx * k}px -${JOOSIK_BBOX.sy * k}px`,
      }}
    />
  );
}
