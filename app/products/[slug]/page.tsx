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
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-gray-500">
        <Link href="/" className="hover:text-blue-600">Home</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-blue-600">Products</Link>
        {product.categories && (
          <>
            <span>/</span>
            <Link
              href={`/products?category=${product.categories.slug}`}
              className="hover:text-blue-600"
            >
              {product.categories.name}
            </Link>
          </>
        )}
        <span>/</span>
        <span className="text-gray-900 font-medium truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Grid: Gallery + Purchasing Details */}
      <div className="grid gap-10 lg:grid-cols-12">
        {/* 1. Images Area */}
        <div className="space-y-4 lg:col-span-6">
          <div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 shadow-xs">
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
              <div className="flex h-full w-full items-center justify-center text-sm text-gray-400">
                No Image Available
              </div>
            )}

            {hasDiscount && (
              <span className="absolute left-4 top-4 rounded-md bg-rose-600 px-2.5 py-1 text-xs font-bold text-white shadow-xs">
                {discountPercent}% OFF
              </span>
            )}
          </div>

          {/* Thumbnail Strip if multiple images */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {product.images.map((img) => (
                <div
                  key={img.id}
                  className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-50"
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
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-gray-500">
              <span>{product.brands?.name || "Shiva Electrical"}</span>
              <span className="font-mono text-[11px] text-gray-400">SKU: {product.sku}</span>
            </div>

            <h1 className="mt-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              {product.name}
            </h1>
          </div>

          {/* Price & Savings */}
          <div className="rounded-xl border border-gray-100 bg-gray-50/60 p-4">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-gray-900">
                ₹{product.price.toLocaleString("en-IN")}
              </span>
              {hasDiscount && (
                <>
                  <span className="text-sm text-gray-400 line-through">
                    ₹{product.mrp!.toLocaleString("en-IN")}
                  </span>
                  <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-800">
                    Save ₹{(product.mrp! - product.price).toLocaleString("en-IN")}
                  </span>
                </>
              )}
            </div>
            <p className="mt-1 text-[11px] text-gray-500">
              Inclusive of all taxes. Local delivery charge calculated at checkout.
            </p>
          </div>

          {/* Availability Status */}
          <div className="flex items-center gap-2 text-sm">
            {isInStock ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 font-semibold text-emerald-700">
                <Check className="h-4 w-4 stroke-[2.5]" />
                In Stock ({product.stock_quantity} available in shop)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1 font-semibold text-rose-700">
                <X className="h-4 w-4 stroke-[2.5]" />
                Out of Stock
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
          <div className="grid grid-cols-2 gap-3 border-t border-gray-100 pt-4 text-xs text-gray-600">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-blue-600 shrink-0" />
              <span>100% Genuine Part Guarantee</span>
            </div>
            <div className="flex items-center gap-2">
              <Wrench className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Doorstep Installation Available</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Comprehensive Specifications & Compatibility Section */}
      <div className="space-y-8 border-t border-gray-200 pt-10">
        {/* Description */}
        {product.description && (
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs sm:p-8">
            <h2 className="text-lg font-bold text-gray-900">Product Description</h2>
            <div className="mt-3 text-sm leading-relaxed text-gray-700">
              {product.description}
            </div>
          </div>
        )}

        {/* Compatibility Matrix & Technical Specifications */}
        <div className="grid gap-6 md:grid-cols-2">
          {product.compatibility && (
            <div className="rounded-2xl border border-blue-100 bg-blue-50/30 p-6 shadow-xs">
              <div className="flex items-center gap-2 text-base font-bold text-gray-900">
                <Wrench className="h-5 w-5 text-blue-600" />
                <h3>Compatibility &amp; Fitment</h3>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-gray-700 sm:text-sm">
                {product.compatibility}
              </p>
            </div>
          )}

          {product.warranty && (
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/30 p-6 shadow-xs">
              <div className="flex items-center gap-2 text-base font-bold text-gray-900">
                <ShieldCheck className="h-5 w-5 text-emerald-600" />
                <h3>Warranty &amp; Service Terms</h3>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-gray-700 sm:text-sm">
                {product.warranty}
              </p>
            </div>
          )}
        </div>

        {/* Support & Contact Card */}
        <div className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-gray-50/60 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-white p-2.5 text-blue-600 shadow-xs">
              <PhoneCall className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">Have Questions About This Product?</h3>
              <p className="text-xs text-gray-500">Contact our shop technicians directly for installation booking or compatibility check.</p>
            </div>
          </div>
          <Link
            href="/#services"
            className="inline-flex shrink-0 items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-xs font-semibold text-gray-700 shadow-xs hover:bg-gray-50"
          >
            Service Information
          </Link>
        </div>
      </div>

      {/* 4. Related Products */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6 border-t border-gray-200 pt-10">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
              Related Products in this Category
            </h2>
            <Link
              href={`/products?category=${product.categories?.slug}`}
              className="text-xs font-semibold text-blue-600 hover:underline"
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
