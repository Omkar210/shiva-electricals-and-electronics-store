import Link from "next/link";
import { getCategories } from "@/lib/catalog/categories";
import { getFeaturedProducts } from "@/lib/catalog/products";
import CategoryCard from "@/components/catalog/CategoryCard";
import ProductCard from "@/components/catalog/ProductCard";
import DeliveryCheck from "@/components/catalog/DeliveryCheck";
import {
  ArrowRight,
  ShieldCheck,
  Wrench,
  Droplet,
  CheckCircle2,
  Clock,
  Sparkles,
} from "lucide-react";

export default async function HomePage() {
  const [categories, featuredProducts] = await Promise.all([
    getCategories(),
    getFeaturedProducts(6),
  ]);

  const services = [
    {
      icon: Wrench,
      title: "Installation Services",
      description:
        "Professional doorstep installation and demo for RO purifiers and ceiling fans by verified local technicians.",
      highlight: "Same-Day Available",
    },
    {
      icon: ShieldCheck,
      title: "Annual Maintenance (AMC)",
      description:
        "Comprehensive annual maintenance plans with scheduled filter changes, membrane check, and priority repair visits.",
      highlight: "Periodic Care",
    },
    {
      icon: Droplet,
      title: "Water Quality & TDS Testing",
      description:
        "Free TDS and water quality testing to ensure your family drinks 100% pure, safe, and mineral-balanced water.",
      highlight: "Free Testing",
    },
    {
      icon: Clock,
      title: "Repairs & Genuine Spares",
      description:
        "Quick troubleshooting, pump repair, and genuine sediment/carbon/membrane filter replacements for all brands.",
      highlight: "Genuine Spares",
    },
  ];

  return (
    <div className="space-y-16 pb-16 sm:space-y-20">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/60 via-white to-white py-12 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            <div className="space-y-6 lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-semibold text-blue-700">
                <Sparkles className="h-3.5 w-3.5 text-blue-600" />
                <span>Your Trusted Local Electrical &amp; Water Purification Store</span>
              </div>

              <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-5xl sm:leading-tight">
                Pure Drinking Water &amp;{" "}
                <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  Reliable Electricals
                </span>
              </h1>

              <p className="max-w-2xl text-sm leading-relaxed text-gray-600 sm:text-base">
                Discover certified RO water purifiers, genuine replacement spare parts, energy-efficient fans, and home electrical supplies. Fast delivery to your doorstep in town and nearby areas.
              </p>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-sm hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-blue-600"
                >
                  Explore Catalog
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  href="#services"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3.5 text-sm font-semibold text-gray-700 shadow-xs hover:bg-gray-50"
                >
                  Our Installation &amp; AMC Services
                </Link>
              </div>

              {/* Trust Points */}
              <div className="grid grid-cols-3 gap-4 border-t border-gray-100 pt-6">
                <div>
                  <div className="text-xl font-bold text-blue-600 sm:text-2xl">100%</div>
                  <div className="text-xs text-gray-500">Genuine Spares</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-blue-600 sm:text-2xl">Doorstep</div>
                  <div className="text-xs text-gray-500">Installation</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-blue-600 sm:text-2xl">Local</div>
                  <div className="text-xs text-gray-500">Fast Delivery</div>
                </div>
              </div>
            </div>

            {/* Local Delivery Quick Checker in Hero */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-lg shadow-gray-100/60">
                <div className="mb-4">
                  <h3 className="text-base font-bold text-gray-900">
                    Local Service Area Check
                  </h3>
                  <p className="mt-1 text-xs text-gray-500">
                    Enter your pincode to verify local doorstep delivery and installation in your sector or town.
                  </p>
                </div>
                <DeliveryCheck />

                <div className="mt-5 space-y-2 border-t border-gray-100 pt-4 text-xs text-gray-600">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                    <span>Same-day delivery available for central zones</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                    <span>Free water TDS testing during delivery</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Product Categories */}
      <section id="categories" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              Shop by Category
            </h2>
            <p className="text-xs text-gray-500 sm:text-sm">
              Explore our core product lines with authoritative specs and pricing
            </p>
          </div>

          <Link
            href="/products"
            className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline sm:text-sm"
          >
            View All Categories &rarr;
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {categories.map((cat) => (
            <CategoryCard key={cat.id} category={cat} />
          ))}
        </div>
      </section>

      {/* 3. Featured Products */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-blue-600">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Recommended Picks</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              Featured Products
            </h2>
          </div>

          <Link
            href="/products"
            className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline sm:text-sm"
          >
            Browse All Products &rarr;
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* 4. Service Offerings (Learned from AquaPure Reference) */}
      <section id="services" className="border-y border-gray-200 bg-gray-50/70 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              Our Certified Services
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-xs text-gray-500 sm:text-sm">
              We do not just sell purifiers and electricals — our verified shop technicians handle complete setup, testing, and maintenance.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((svc, idx) => {
              const Icon = svc.icon;
              return (
                <div
                  key={idx}
                  className="flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-6 shadow-xs"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                        <Icon className="h-6 w-6" />
                      </div>
                      <span className="rounded-full bg-blue-100/70 px-2.5 py-0.5 text-[11px] font-bold text-blue-800">
                        {svc.highlight}
                      </span>
                    </div>

                    <h3 className="mt-4 text-base font-bold text-gray-900">
                      {svc.title}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-gray-600">
                      {svc.description}
                    </p>
                  </div>

                  <div className="mt-6 border-t border-gray-100 pt-4 text-xs font-semibold text-blue-600">
                    Contact Store for Booking
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. Local Trust & Store Support Banner */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 to-indigo-800 p-8 text-white shadow-xl sm:p-12">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
            <div className="space-y-4 lg:col-span-8">
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Need Help Finding the Right Filter or Electrical Part?
              </h2>
              <p className="text-xs leading-relaxed text-blue-100 sm:text-sm">
                Unsure if a replacement RO membrane or sediment candle fits your water purifier model? Or need guidance on ceiling fan sizing? Our local shop technicians are ready to assist.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:col-span-4 lg:justify-end">
              <Link
                href="/products?category=ro-spare-parts"
                className="inline-flex items-center justify-center rounded-xl bg-white px-6 py-3 text-xs font-bold text-blue-800 shadow-sm hover:bg-blue-50"
              >
                Browse RO Spares
              </Link>
              <Link
                href="/products"
                className="inline-flex items-center justify-center rounded-xl border border-white/30 px-6 py-3 text-xs font-semibold text-white hover:bg-white/10"
              >
                View Full Store
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
