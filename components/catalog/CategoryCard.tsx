import Link from "next/link";
import type { CategoryItem } from "@/lib/catalog/categories";
import { Droplet, Wrench, Fan, Zap, ShieldCheck } from "lucide-react";

interface CategoryCardProps {
  category: CategoryItem;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  // Select icon based on slug
  const getIcon = (slug: string) => {
    switch (slug) {
      case "ro-purifiers":
        return <Droplet className="h-6 w-6 text-blue-600" />;
      case "ro-spare-parts":
        return <Wrench className="h-6 w-6 text-emerald-600" />;
      case "fans":
        return <Fan className="h-6 w-6 text-indigo-600" />;
      case "electrical-electronics":
        return <Zap className="h-6 w-6 text-amber-600" />;
      case "services":
        return <ShieldCheck className="h-6 w-6 text-purple-600" />;
      default:
        return <Droplet className="h-6 w-6 text-blue-600" />;
    }
  };

  return (
    <Link
      href={`/products?category=${category.slug}`}
      className="group relative flex flex-col items-center rounded-2xl border border-gray-200/80 bg-white p-6 text-center shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-blue-300 hover:shadow-md"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-50 transition-colors group-hover:bg-blue-50">
        {getIcon(category.slug)}
      </div>

      <h3 className="mt-4 text-sm font-bold text-gray-900 group-hover:text-blue-600">
        {category.name}
      </h3>

      {category.description && (
        <p className="mt-1 line-clamp-2 text-xs text-gray-500">
          {category.description}
        </p>
      )}

      <span className="mt-3 text-xs font-semibold text-blue-600 group-hover:underline">
        Explore Items &rarr;
      </span>
    </Link>
  );
}
