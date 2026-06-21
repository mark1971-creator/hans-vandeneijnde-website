import type { ImageVariantProfile } from "@/lib/image-config";
import { getResponsiveImage } from "@/lib/responsive-image";

type OptimizedImageProps = {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  profile?: ImageVariantProfile;
  className?: string;
} & (
  | { fill: true; width?: never; height?: never }
  | { fill?: false; width: number; height: number }
);

export function OptimizedImage({
  src,
  alt,
  sizes,
  priority = false,
  profile,
  className = "",
  fill,
  width,
  height,
}: OptimizedImageProps) {
  const resolvedProfile = profile ?? "gallery";
  const { src: resolvedSrc, srcSet } = getResponsiveImage(src, resolvedProfile);

  const shared = {
    src: resolvedSrc,
    srcSet,
    sizes: srcSet ? sizes : undefined,
    alt,
    loading: priority ? ("eager" as const) : ("lazy" as const),
    decoding: priority ? ("sync" as const) : ("async" as const),
    fetchPriority: priority ? ("high" as const) : undefined,
  };

  if (fill) {
    return (
      <img
        {...shared}
        className={`absolute inset-0 h-full w-full ${className}`}
      />
    );
  }

  return (
    <img
      {...shared}
      width={width}
      height={height}
      className={className}
    />
  );
}
