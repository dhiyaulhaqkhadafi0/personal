import { MusicProvider } from "@/context/MusicContext";
import MusicPlayer from "@/components/blog/MusicPlayer";

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MusicProvider>
      {children}
      {/* Persistent Spotify Floating Player across all blog pages */}
      <MusicPlayer />
    </MusicProvider>
  );
}
