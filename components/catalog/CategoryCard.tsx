import Link from "next/link";
import type { CategoryItem } from "@/lib/catalog/categories";
import { Droplet, Wrench, Fan, Zap, ShieldCheck } from "lucide-react";

interface CategoryCardProps {
  category: CategoryItem;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  const getIcon = (slug: string) => {
    switch (slug) {
      case "ro-purifiers":
        return <Droplet className="h-7 w-7 text-blue-700" />;
      case "ro-spare-parts":
        return <Wrench className="h-7 w-7 text-emerald-700" />;
      case "fans":
        return <Fan className="h-7 w-7 text-indigo-700" />;
      case "electrical-electronics":
        return <Zap className="h-7 w-7 text-amber-700" />;
      case "services":
        return <ShieldCheck className="h-7 w-7 text-purple-700" />;
      default:
        return <Droplet className="h-7 w-7 text-blue-700" />;
    }
  };

  return (
    <Link
      href={`/products?category=${category.slug}`}
      className="group relative flex flex-col items-center rounded-xl border-2 border-slate-200 bg-white p-6 text-center shadow-xs transition-all duration-200 hover:border-blue-600 hover:shadow-md"
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 transition-colors group-hover:bg-blue-50">
        {getIcon(category.slug)}
      </div>

      <h3 className="mt-4 text-base sm:text-lg font-bold text-slate-900 group-hover:text-blue-700">
        {category.name}
      </h3>

      {category.description && (
        <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">
          {category.description}
        </p>
      )}

      <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-blue-700 group-hover:underline">
        Browse Category &rarr;
      </span>
    </Link>
  );
}
