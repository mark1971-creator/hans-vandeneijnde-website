import Image, { type ImageProps } from "next/image";
import { IMAGE_QUALITY } from "@/lib/image-config";

type OptimizedImageProps = {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  quality?: number;
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
  quality = IMAGE_QUALITY,
  className = "",
  fill,
  width,
  height,
}: OptimizedImageProps) {
  const shared: Pick<ImageProps, "src" | "alt" | "sizes" | "quality" | "className"> = {
    src,
    alt,
    sizes,
    quality,
    className,
  };

  if (fill) {
    return (
      <Image
        {...shared}
        fill
        priority={priority}
        loading={priority ? undefined : "lazy"}
        decoding={priority ? "sync" : "async"}
      />
    );
  }

  return (
    <Image
      {...shared}
      width={width!}
      height={height!}
      priority={priority}
      loading={priority ? undefined : "lazy"}
      decoding={priority ? "sync" : "async"}
    />
  );
}
