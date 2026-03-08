import { HomeContent } from "@/components/HomeContent";

interface PageProps {
  searchParams: Promise<{ lat?: string; lng?: string }>;
}

export default async function Home({ searchParams }: PageProps) {
  const params = await searchParams;
  const initialLat = params.lat ? parseFloat(params.lat) : undefined;
  const initialLng = params.lng ? parseFloat(params.lng) : undefined;

  return (
    <main className="overflow-hidden">
      <HomeContent initialLat={initialLat} initialLng={initialLng} />
    </main>
  );
}
