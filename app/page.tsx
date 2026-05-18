import { Suspense } from "react";
import GalleryPage from "@/components/GalleryPage";
import { getGalleries } from "@/lib/galleries";

export const revalidate = 0;

export default async function Home() {
  const galleries = await getGalleries();

  return (
    <Suspense>
      <GalleryPage initialItems={galleries} />
    </Suspense>
  );
}
