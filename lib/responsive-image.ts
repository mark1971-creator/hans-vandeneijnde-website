import {
  IMAGE_VARIANTS,
  type ImageVariantEntry,
} from "@/data/image-variants";
import {
  IMAGE_VARIANT_WIDTHS,
  type ImageVariantProfile,
} from "@/lib/image-config";

function pickFallback(
  entry: ImageVariantEntry,
  profile: ImageVariantProfile,
): string {
  const preferred =
    profile === "hero"
      ? IMAGE_VARIANT_WIDTHS.large
      : IMAGE_VARIANT_WIDTHS.medium;

  const match = entry.srcSet
    .split(", ")
    .map((part) => {
      const [url, descriptor] = part.split(" ");
      return { url, width: Number.parseInt(descriptor, 10) };
    })
    .filter(({ width }) => !Number.isNaN(width))
    .sort((a, b) => a.width - b.width);

  if (match.length === 0) {
    return entry.fallback;
  }

  const exact = match.find(({ width }) => width === preferred);
  if (exact) {
    return exact.url;
  }

  const larger = match.find(({ width }) => width > preferred);
  return larger?.url ?? match[match.length - 1]!.url;
}

export function getResponsiveImage(
  src: string,
  profile: ImageVariantProfile = "gallery",
) {
  const entry = IMAGE_VARIANTS[src];
  if (!entry) {
    return { src, srcSet: undefined as string | undefined };
  }

  return {
    src: pickFallback(entry, profile),
    srcSet: entry.srcSet,
  };
}
