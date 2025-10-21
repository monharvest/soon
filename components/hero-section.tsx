import Link from "next/link";
import type { Post } from "@/lib/cloudflare-kv";
import { getImageUrl } from "@/lib/image-utils";

interface HeroSectionProps {
  posts: Post[];
}

const truncateExcerpt = (text: string, wordCount = 20) => {
  const words = text.split(" ");
  if (words.length <= wordCount) return text;
  return words.slice(0, wordCount).join(" ") + "...";
};

const getCategoryColor = (category: string) => {
  const colorMap: Record<string, string> = {
    "Сайн мэдээ": "bg-gradient-to-br from-yellow-400 via-yellow-500 to-amber-500 text-yellow-900",
    Advent: "bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-700 text-white",
    "Сургаалт зүйрлэлүүд": "bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 text-white",
    "Үхэл ба амилал": "bg-gradient-to-br from-red-600 via-red-700 to-rose-700 text-white",
    "Мөнх үгийн ойлголт": "bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 text-white",
    "Тамын тухай": "bg-gradient-to-br from-gray-600 via-gray-700 to-slate-700 text-gray-100",
  };
  return colorMap[category] || "bg-gradient-to-br from-gray-500 to-gray-600 text-white";
};

export function HeroSection({ posts }: HeroSectionProps) {
  const featuredPost = posts.find((post) => post.featured) || posts[0];

  if (!featuredPost) {
    return null;
  }

  const heroImageUrl = getImageUrl(featuredPost.image);

  return (
    <section className="bg-[#1e293b] text-white py-16 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-2 gap-8 items-center max-w-6xl mx-auto">
          <Link href={`/post/${featuredPost.slug}`} className="block group">
            <div
              className="rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 aspect-video flex flex-col justify-center group-hover:scale-[1.02] relative overflow-hidden bg-gray-900"
            >
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `url(${heroImageUrl})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
              {/* Light effect */}
              <div className="light-effect" />
              <style jsx>{`
                .light-effect {
                  position: absolute;
                  top: 0;
                  left: 0;
                  width: 40%; /* Full width of the card */
                  height: 100%; /* Full height of the card */
                  background: linear-gradient(45deg, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0));
                  transform: skewX(-20deg);
                  pointer-events: none;
                  mix-blend-mode: screen;
                  filter: blur(6px);
                  z-index: 20;
                  animation: lightShift 6s infinite alternate;
                }
                @keyframes lightShift {
                  0% { transform: skewX(-20deg) translateX(-60px); }
                  100% { transform: skewX(-20deg) translateX(60px); }
                }
              `}</style>
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </Link>

          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-6 text-white">{featuredPost.title}</h1>
            <p className="text-gray-300 leading-relaxed mb-6 text-lg">{truncateExcerpt(featuredPost.excerpt, 20)}</p>
            <div className="flex items-center gap-4 text-sm">
              <span className="text-gray-400">{featuredPost.date}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}