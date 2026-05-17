import GalleryPage from "@/components/GalleryPage";
import { getGalleries } from "@/lib/galleries";

export default async function Home() {
  const galleries = await getGalleries();

  return <GalleryPage initialItems={galleries} />;
}
