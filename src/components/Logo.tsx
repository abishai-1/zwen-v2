/** ZWEN brush wordmark rendered as a mask so it takes `currentColor` on any theme. */
export function Logo({ className = "h-7" }: { className?: string }) {
  return (
    <span
      role="img"
      aria-label="ZWEN"
      className={`inline-block aspect-[1200/447] bg-current ${className}`}
      style={{
        WebkitMaskImage: "url(/brand/zwen-mask.png)",
        maskImage: "url(/brand/zwen-mask.png)",
        WebkitMaskSize: "contain",
        maskSize: "contain",
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
      }}
    />
  );
}
