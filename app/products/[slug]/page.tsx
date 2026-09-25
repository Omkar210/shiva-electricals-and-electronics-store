import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { getProductBySlug, getRelatedProducts } from "@/lib/catalog/products";
import DeliveryCheck from "@/components/catalog/DeliveryCheck";
import ProductCard from "@/components/catalog/ProductCard";
import AddToCartButton from "@/components/catalog/AddToCartButton";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  Check,
  X,
  ShieldCheck,
  Wrench,
  PhoneCall,
  Package,
} from "lucide-react";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return { title: "Product Not Found" };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://shivaelectrical.in";
  const primaryImage =
    product.images?.find((img) => img.is_primary)?.storage_path ||
    product.images?.[0]?.storage_path;

  return {
    title: product.name,
    description:
      product.description ||
      `Buy ${product.name} (SKU: ${product.sku}) at Shiva Electrical & Electronics. Genuine quality with fast doorstep delivery and expert installation.`,
    alternates: {
      canonical: `${siteUrl}/products/${product.slug}`,
    },
    openGraph: {
      title: `${product.name} | Shiva Electrical & Electronics`,
      description:
        product.description ||
        `Buy ${product.name} at ₹${product.price.toLocaleString("en-IN")}. Genuine stock with local delivery and doorstep setup.`,
      url: `${siteUrl}/products/${product.slug}`,
      type: "website",
      images: primaryImage ? [{ url: primaryImage, alt: product.name }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description:
        product.description ||
        `Buy ${product.name} at ₹${product.price.toLocaleString("en-IN")}. Local doorstep delivery available.`,
      images: primaryImage ? [primaryImage] : undefined,
    },
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(product.id, product.category_id, 4);
  const isInStock = product.stock_quantity > 0;
  const hasDiscount = product.mrp && product.mrp > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.mrp! - product.price) / product.mrp!) * 100)
    : 0;

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    sku: product.sku,
    image: product.images?.map((img) => img.storage_path) || [],
    brand: product.brands
      ? {
          "@type": "Brand",
          name: product.brands.name,
        }
      : undefined,
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "INR",
      priceValidUntil: "2027-12-31",
      availability: isInStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: {
        "@type": "Organization",
        name: "Shiva Electrical & Electronics",
      },
    },
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-12">
      <JsonLd data={productSchema} />

      {/* Accessible Breadcrumbs */}
      <nav aria-label="Breadcrumb Navigation" className="flex flex-wrap items-center gap-2 text-sm font-semibold text-slate-600">
        <Link href="/" className="hover:text-blue-700 hover:underline">Home</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-blue-700 hover:underline">Catalog</Link>
        {product.categories && (
          <>
            <span>/</span>
            <Link
              href={`/products?category=${product.categories.slug}`}
              className="hover:text-blue-700 hover:underline"
            >
              {product.categories.name}
            </Link>
          </>
        )}
        <span>/</span>
        <span className="text-slate-900 font-bold truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Grid: Gallery + Purchasing Details */}
      <div className="grid gap-10 lg:grid-cols-12">
        {/* 1. Images Area */}
        <div className="space-y-4 lg:col-span-6">
          <div className="relative aspect-4/3 w-full overflow-hidden rounded-xl border-2 border-slate-200 bg-white shadow-xs">
            {product.primary_image ? (
              <Image
                src={product.primary_image}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-slate-400 bg-slate-50">
                <Package className="h-12 w-12 text-slate-300" />
                <span className="text-base font-bold text-slate-600">Genuine Store Inventory</span>
              </div>
            )}

            {hasDiscount && (
              <span className="absolute left-4 top-4 rounded-md bg-red-700 px-3 py-1.5 text-sm font-bold text-white shadow-sm">
                Save {discountPercent}% OFF
              </span>
            )}
          </div>

          {/* Thumbnail Strip if multiple images */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pt-1">
              {product.images.map((img) => (
                <div
                  key={img.id}
                  className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2 border-slate-200 bg-white"
                >
                  <Image
                    src={img.storage_path}
                    alt={img.alt_text || product.name}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 2. Purchasing & Details Column */}
        <div className="space-y-6 lg:col-span-6">
          <div>
            <div className="flex items-center justify-between text-sm font-bold text-slate-600">
              <span className="text-blue-700">{product.brands?.name || "Shiva Electrical"}</span>
              <span className="font-mono text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded">
                SKU: {product.sku}
              </span>
            </div>

            <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 leading-snug">
              {product.name}
            </h1>
          </div>

          {/* High-Contrast Price Box */}
          <div className="rounded-xl border-2 border-slate-200 bg-white p-5 shadow-2xs space-y-2">
            <div className="flex items-baseline gap-3.5 flex-wrap">
              <span className="text-3xl sm:text-4xl font-black text-slate-900">
                ₹{product.price.toLocaleString("en-IN")}
              </span>
              {hasDiscount && (
                <>
                  <span className="text-base text-slate-500 line-through">
                    MRP ₹{product.mrp!.toLocaleString("en-IN")}
                  </span>
                  <span className="rounded-md bg-emerald-100 px-2.5 py-1 text-sm font-bold text-emerald-900 border border-emerald-300">
                    You Save ₹{(product.mrp! - product.price).toLocaleString("en-IN")}
                  </span>
                </>
              )}
            </div>
            <p className="text-sm font-medium text-slate-600">
              All taxes included. Local delivery and installation arranged at your doorstep.
            </p>
          </div>

          {/* Availability Status */}
          <div className="flex items-center gap-2 text-base">
            {isInStock ? (
              <span className="inline-flex items-center gap-2 rounded-lg bg-emerald-50 px-3.5 py-1.5 font-bold text-emerald-800 border-2 border-emerald-300">
                <Check className="h-5 w-5 stroke-[3]" />
                <span>In Stock ({product.stock_quantity} available in shop)</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-2 rounded-lg bg-red-50 px-3.5 py-1.5 font-bold text-red-800 border-2 border-red-300">
                <X className="h-5 w-5 stroke-[3]" />
                <span>Currently Out of Stock</span>
              </span>
            )}
          </div>

          {/* Local Delivery Checker Component */}
          <DeliveryCheck />

          {/* Add to Cart & Checkout CTAs */}
          <div id="order" className="pt-2">
            <AddToCartButton
              productId={product.id}
              stockQuantity={product.stock_quantity}
            />
          </div>

          {/* Assurance Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 border-t-2 border-slate-200 pt-4 text-sm font-bold text-slate-800">
            <div className="flex items-center gap-2.5 rounded-lg bg-slate-50 p-2.5 border border-slate-200">
              <ShieldCheck className="h-5 w-5 text-blue-700 shrink-0" />
              <span>100% Genuine Original Part</span>
            </div>
            <div className="flex items-center gap-2.5 rounded-lg bg-slate-50 p-2.5 border border-slate-200">
              <Wrench className="h-5 w-5 text-emerald-700 shrink-0" />
              <span>Doorstep Technician Installation</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Comprehensive Specifications & Compatibility Section */}
      <div className="space-y-8 border-t-2 border-slate-200 pt-10">
        {/* Description */}
        {product.description && (
          <div className="rounded-xl border-2 border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-3">
            <h2 className="text-xl font-bold text-slate-900">Product Details &amp; Overview</h2>
            <div className="text-base sm:text-lg leading-relaxed text-slate-700">
              {product.description}
            </div>
          </div>
        )}

        {/* Compatibility Matrix & Technical Specifications */}
        <div className="grid gap-6 md:grid-cols-2">
          {product.compatibility && (
            <div className="rounded-xl border-2 border-blue-200 bg-blue-50/70 p-6 shadow-2xs space-y-3">
              <div className="flex items-center gap-2.5 text-lg font-bold text-slate-900">
                <Wrench className="h-5 w-5 text-blue-700" />
                <h3>Compatibility &amp; Model Fit</h3>
              </div>
              <p className="text-base leading-relaxed text-slate-800">
                {product.compatibility}
              </p>
            </div>
          )}

          {product.warranty && (
            <div className="rounded-xl border-2 border-emerald-200 bg-emerald-50/70 p-6 shadow-2xs space-y-3">
              <div className="flex items-center gap-2.5 text-lg font-bold text-slate-900">
                <ShieldCheck className="h-5 w-5 text-emerald-700" />
                <h3>Warranty &amp; Service Terms</h3>
              </div>
              <p className="text-base leading-relaxed text-slate-800">
                {product.warranty}
              </p>
            </div>
          )}
        </div>

        {/* Senior-Friendly Support & Direct Call Card */}
        <div className="flex flex-col gap-4 rounded-xl border-2 border-slate-300 bg-white p-6 sm:p-8 sm:flex-row sm:items-center sm:justify-between shadow-2xs">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-blue-100 p-3 text-blue-800 shrink-0">
              <PhoneCall className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Have Questions About This Product?</h3>
              <p className="text-base text-slate-600">Speak directly with our local technician before ordering to confirm fitment.</p>
            </div>
          </div>
          <a
            href="tel:+919876543210"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-blue-700 px-6 py-3 text-base font-bold text-white hover:bg-blue-800 transition-colors shadow-xs"
          >
            <PhoneCall className="h-4 w-4" />
            <span>Call Shop: +91 98765 43210</span>
          </a>
        </div>
      </div>

      {/* 4. Related Products */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6 border-t-2 border-slate-200 pt-10">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Related Items in this Category
            </h2>
            <Link
              href={`/products?category=${product.categories?.slug}`}
              className="text-base font-bold text-blue-700 hover:underline"
            >
              View More &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {relatedProducts.map((rp) => (
              <ProductCard key={rp.id} product={rp} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
