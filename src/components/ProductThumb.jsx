export default function ProductThumb({ seed, size = 44, className = "" }) {
  return (
    <img
      src={`https://picsum.photos/seed/${encodeURIComponent(seed)}/160/160`}
      alt=""
      width={size}
      height={size}
      className={`rounded-lg object-cover shrink-0 bg-slate-100 ${className}`}
      style={{ width: size, height: size }}
      loading="lazy"
    />
  );
}
