import Image from "next/image";

type ImagePanelProps = {
  src: string;
  alt: string;
  priority?: boolean;
  className?: string;
  imageClassName?: string;
  sizes?: string;
  tone?: "dark" | "light";
  aspect?: "wide" | "video" | "square";
};

const aspectClass = {
  wide: "aspect-[16/10]",
  video: "aspect-video",
  square: "aspect-square",
};

export function ImagePanel({
  src,
  alt,
  priority = false,
  className = "",
  imageClassName = "",
  sizes = "(min-width: 1024px) 44vw, 92vw",
  tone = "dark",
  aspect = "wide",
}: ImagePanelProps) {
  const frame =
    tone === "dark"
      ? "border-white/12 bg-white/8 shadow-[0_30px_80px_rgba(2,10,24,0.32)]"
      : "border-slate-200 bg-white shadow-[0_24px_60px_rgba(6,17,31,0.12)]";

  return (
    <div className={`relative isolate overflow-hidden rounded-2xl border ${frame} ${aspectClass[aspect]} ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        className={`object-cover ${imageClassName}`}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#06111f]/38 via-transparent to-white/4" />
    </div>
  );
}
