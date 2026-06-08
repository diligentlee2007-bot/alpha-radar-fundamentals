/**
 * 주식이 — the user's hand-made mascot (public/joosik.png, transparent).
 * The artwork sits in the top-left of a 1380×1620 canvas, so we crop to its
 * content box via background-position (on screen) and drawImage source-rect
 * (canvas PNG export). Tweak BBOX if the crop needs nudging.
 */

export const JOOSIK_SRC = "/joosik.png";
export const JOOSIK_FULL = { w: 1380, h: 1620 };
// Content bounding box (top-left region) within the full image.
export const JOOSIK_BBOX = { sx: 0, sy: 0, sw: 480, sh: 600 };

export function JoosikImg({ height = 56, className }: { height?: number; className?: string }) {
  const k = height / JOOSIK_BBOX.sh;
  return (
    <div
      className={className}
      aria-hidden
      style={{
        width: JOOSIK_BBOX.sw * k,
        height: JOOSIK_BBOX.sh * k,
        backgroundImage: `url(${JOOSIK_SRC})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: `${JOOSIK_FULL.w * k}px ${JOOSIK_FULL.h * k}px`,
        backgroundPosition: `-${JOOSIK_BBOX.sx * k}px -${JOOSIK_BBOX.sy * k}px`,
      }}
    />
  );
}
