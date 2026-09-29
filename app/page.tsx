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
  PhoneCall,
} from "lucide-react";

export default async function HomePage() {
  const [categories, featuredProducts] = await Promise.all([
    getCategories(),
    getFeaturedProducts(6),
  ]);

  const services = [
    {
      icon: Wrench,
      title: "Doorstep Installation & Demo",
      description:
        "Professional installation and unboxing for RO water purifiers and ceiling fans by certified local technicians.",
      highlight: "Same-Day Available",
    },
    {
      icon: ShieldCheck,
      title: "Annual Maintenance (AMC)",
      description:
        "Worry-free yearly maintenance plans covering filter cartridge replacements, membrane checks, and priority visits.",
      highlight: "Scheduled Care",
    },
    {
      icon: Droplet,
      title: "Water TDS & Quality Testing",
      description:
        "Complimentary water TDS and purity check during delivery to verify safe drinking water standards.",
      highlight: "Free with Order",
    },
    {
      icon: Clock,
      title: "Quick Repairs & Genuine Spares",
      description:
        "Immediate troubleshooting, booster pump repair, and genuine sediment/carbon/membrane filter replacements.",
      highlight: "Genuine Spares",
    },
  ];

  return (
    <div className="space-y-16 pb-20 sm:space-y-24">
      {/* 1. Hero Section - Senior-Friendly, Trustworthy, High Contrast */}
      <section className="border-b-2 border-slate-200 bg-white py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            {/* Left Content Column */}
            <div className="space-y-6 lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-lg border-2 border-blue-200 bg-blue-50 px-4 py-1.5 text-sm font-bold text-blue-900">
                <Sparkles className="h-4 w-4 text-blue-700" />
                <span>Trusted Local Store &amp; Certified Technician Installation</span>
              </div>

              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl sm:leading-tight">
                Pure Drinking Water &amp;{" "}
                <span className="text-blue-700">
                  Reliable Home Electricals
                </span>
              </h1>

              <p className="max-w-2xl text-base sm:text-lg leading-relaxed text-slate-700">
                Buy genuine RO water purifiers, original replacement filter cartridges, ceiling fans, and electrical supplies with direct doorstep delivery and certified technician installation.
              </p>

              {/* 48px Action Buttons */}
              <div className="flex flex-col gap-3.5 sm:flex-row sm:items-center pt-2">
                <Link
                  href="/products"
                  className="flex h-13 items-center justify-center gap-2 rounded-lg bg-blue-700 px-7 text-base sm:text-lg font-bold text-white shadow-xs hover:bg-blue-800 active:bg-blue-900 transition-colors"
                >
                  <span>Explore Product Catalog</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>

                <a
                  href="tel:+919876543210"
                  className="flex h-13 items-center justify-center gap-2 rounded-lg border-2 border-slate-300 bg-white px-6 text-base sm:text-lg font-bold text-slate-800 hover:bg-slate-50 hover:border-slate-400 transition-colors"
                >
                  <PhoneCall className="h-5 w-5 text-blue-700" />
                  <span>Call Shop for Help</span>
                </a>
              </div>

              {/* Trust Reassurance Badges */}
              <div className="grid grid-cols-3 gap-4 border-t-2 border-slate-100 pt-6">
                <div className="rounded-lg bg-slate-50 p-3 border border-slate-200">
                  <div className="text-xl sm:text-2xl font-black text-blue-700">Verified</div>
                  <div className="text-sm font-bold text-slate-700">Genuine Spares</div>
                </div>
                <div className="rounded-lg bg-slate-50 p-3 border border-slate-200">
                  <div className="text-xl sm:text-2xl font-black text-blue-700">Doorstep</div>
                  <div className="text-sm font-bold text-slate-700">Technician Setup</div>
                </div>
                <div className="rounded-lg bg-slate-50 p-3 border border-slate-200">
                  <div className="text-xl sm:text-2xl font-black text-blue-700">Local</div>
                  <div className="text-sm font-bold text-slate-700">Fast Delivery</div>
                </div>
              </div>
            </div>

            {/* Right Column: Local Delivery Checker */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-6 sm:p-7 shadow-sm space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    Verify Your Delivery Area
                  </h3>
                  <p className="mt-1 text-sm text-slate-600">
                    Enter your postal pincode below to check delivery time, fee, and available technician visits.
                  </p>
                </div>

                <DeliveryCheck />

                <div className="space-y-2 border-t-2 border-slate-200 pt-4 text-sm font-medium text-slate-700">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-blue-700 shrink-0" />
                    <span>Same-day doorstep delivery for central zones</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-blue-700 shrink-0" />
                    <span>Complimentary water TDS check on delivery</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Product Categories */}
      <section id="categories" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between border-b-2 border-slate-200 pb-4">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              Shop by Category
            </h2>
            <p className="text-base text-slate-600 mt-1">
              Select a category to view genuine products with transparent store pricing
            </p>
          </div>

          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-base font-bold text-blue-700 hover:underline"
          >
            <span>View All Categories &rarr;</span>
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {categories.map((cat) => (
            <CategoryCard key={cat.id} category={cat} />
          ))}
        </div>
      </section>

      {/* 3. Featured Products */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between border-b-2 border-slate-200 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-sm font-bold uppercase tracking-wider text-blue-700">
              <Sparkles className="h-4 w-4" />
              <span>Recommended by Our Technicians</span>
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl mt-1">
              Featured Store Products
            </h2>
          </div>

          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-base font-bold text-blue-700 hover:underline"
          >
            <span>Browse All Products &rarr;</span>
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* 4. Service Offerings */}
      <section id="services" className="border-y-2 border-slate-200 bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              Certified Technician Services
            </h2>
            <p className="text-base text-slate-600">
              We provide complete doorstep setup, periodic water quality checks, and replacement services for your peace of mind.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((svc, idx) => {
              const Icon = svc.icon;
              return (
                <div
                  key={idx}
                  className="flex flex-col justify-between rounded-xl border-2 border-slate-200 bg-slate-50 p-6 shadow-2xs hover:border-blue-400 transition-colors"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex h-13 w-13 items-center justify-center rounded-xl bg-blue-100 text-blue-800">
                        <Icon className="h-7 w-7" />
                      </div>
                      <span className="rounded-full bg-blue-50 border border-blue-300 px-3 py-1 text-xs font-bold text-blue-900">
                        {svc.highlight}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900">
                      {svc.title}
                    </h3>
                    <p className="text-sm sm:text-base leading-relaxed text-slate-700">
                      {svc.description}
                    </p>
                  </div>

                  <div className="mt-6 border-t border-slate-200 pt-4">
                    <a
                      href="tel:+919876543210"
                      className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-700 hover:underline"
                    >
                      <PhoneCall className="h-4 w-4" />
                      <span>Call to Book Service</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. Direct Assistance Banner - Clear and Reassuring */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border-2 border-blue-300 bg-blue-900 p-8 sm:p-12 text-white shadow-md">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
            <div className="space-y-3 lg:col-span-8">
              <h2 className="text-2xl font-black tracking-tight sm:text-3xl text-white">
                Not Sure Which Filter or Spare Part Fits Your Machine?
              </h2>
              <p className="text-base sm:text-lg leading-relaxed text-blue-100">
                You do not need to guess! Take a photo of your water purifier or fan model and call or WhatsApp our store technicians directly. We will confirm the exact matching part for you.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:col-span-4 lg:justify-end">
              <a
                href="tel:+919876543210"
                className="flex h-12 items-center justify-center gap-2 rounded-lg bg-amber-400 px-6 text-base font-bold text-slate-950 hover:bg-amber-300 transition-colors shadow-sm"
              >
                <PhoneCall className="h-5 w-5" />
                <span>Call +91 98765 43210</span>
              </a>
              <Link
                href="/products?category=ro-spare-parts"
                className="flex h-12 items-center justify-center rounded-lg border-2 border-white/50 bg-blue-800 px-6 text-base font-bold text-white hover:bg-blue-700 transition-colors"
              >
                <span>Browse Filters</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
