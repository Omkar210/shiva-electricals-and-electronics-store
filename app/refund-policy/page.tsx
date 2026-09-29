import type { Metadata } from "next";
import Link from "next/link";
import { RotateCcw, CheckCircle2, AlertCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Refund, Return & Cancellation Policy",
  description:
    "Refund, Return, and Cancellation Policy for Shiva Electrical & Electronics. Learn about our 7-day return window, doorstep inspection rights, and transparent refund timelines.",
};

export default function RefundPolicyPage() {
  const lastUpdated = "September 26, 2026";

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 space-y-10">
      {/* Header */}
      <div className="border-b-2 border-slate-200 pb-8 space-y-4">
        <div className="inline-flex items-center gap-2 rounded-lg border-2 border-emerald-200 bg-emerald-50 px-3.5 py-1.5 text-sm font-bold text-emerald-900">
          <RotateCcw className="h-4 w-4 text-emerald-700" />
          <span>7-Day Return &amp; Replacement Assurance</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
          Refund, Return &amp; Cancellation Policy
        </h1>
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
          At <strong>Shiva Electrical &amp; Electronics</strong>, customer trust is our foundation. We provide honest, straightforward return and cancellation terms in accordance with the <strong>Consumer Protection Act, 2019</strong> and the <strong>Consumer Protection (E-Commerce) Rules, 2020</strong>.
        </p>
        <p className="text-sm font-semibold text-slate-500">
          Last Updated &amp; Effective Date: {lastUpdated}
        </p>
      </div>

      {/* Main Content */}
      <div className="space-y-8 text-base sm:text-lg leading-relaxed text-slate-700">
        {/* Section 1 */}
        <section className="space-y-3 rounded-xl border-2 border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-800 text-sm font-bold">1</span>
            Doorstep Verification &amp; Right to Reject (Pay on Delivery)
          </h2>
          <p>
            Because all orders placed on our website are fulfilled via <strong>Pay on Delivery (Cash or Doorstep UPI)</strong>, you enjoy 100% upfront purchase safety:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Physical Inspection:</strong> When our local delivery staff arrives, you are encouraged to check the outer box, seal integrity, and product model number before making payment.
            </li>
            <li>
              <strong>Zero-Penalty Doorstep Rejection:</strong> If the packaging is visibly damaged, seal broken, or the wrong model was brought, you may immediately decline to accept the order. You will incur <strong>zero fee or penalty</strong>.
            </li>
          </ul>
        </section>

        {/* Section 2 */}
        <section className="space-y-3 rounded-xl border-2 border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-800 text-sm font-bold">2</span>
            7-Day Replacement &amp; Return Window
          </h2>
          <p>
            For items accepted and paid for at delivery, we offer a <strong>7-Day Replacement &amp; Return Window</strong> from the date of delivery under the following conditions:
          </p>
          <div className="grid gap-4 sm:grid-cols-2 pt-2">
            <div className="rounded-lg border-2 border-emerald-200 bg-emerald-50/60 p-4 space-y-2">
              <h3 className="font-bold text-emerald-950 text-base flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-700 shrink-0" />
                Eligible for Free Replacement / Return
              </h3>
              <ul className="list-disc pl-5 text-sm text-slate-700 space-y-1.5">
                <li>Product received is physically damaged or has transit defects.</li>
                <li>Product does not match the specifications or SKU ordered.</li>
                <li>Electrical appliance (ceiling fan, pump, switch) fails initial functional test during installation.</li>
                <li>RO purifier or accessory arrives with missing original kit components.</li>
              </ul>
            </div>

            <div className="rounded-lg border-2 border-amber-200 bg-amber-50/60 p-4 space-y-2">
              <h3 className="font-bold text-amber-950 text-base flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-amber-700 shrink-0" />
                Ineligible Conditions (Consumables Hygiene)
              </h3>
              <ul className="list-disc pl-5 text-sm text-slate-700 space-y-1.5">
                <li>
                  <strong>Used Water Filters &amp; Membranes:</strong> RO filter candles, sediment cartridges, and membranes that have been connected to water lines cannot be returned for hygiene and sanitary reasons, unless verified defective upon installation by our technician.
                </li>
                <li>Products damaged by power surges, physical drops, or unauthorized alteration.</li>
                <li>Items returned without original packaging, warranty cards, or accessories.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 3 */}
        <section className="space-y-3 rounded-xl border-2 border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-800 text-sm font-bold">3</span>
            Free Order Cancellation (Prior to Delivery)
          </h2>
          <p>
            You may cancel your order at any time before delivery dispatch without any cancellation penalty:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Self-Service:</strong> Visit the <Link href="/orders" className="text-blue-700 font-bold underline">Track Order</Link> page and click the &ldquo;Cancel Order&rdquo; button while the order is in &ldquo;Placed&rdquo; status.
            </li>
            <li>
              <strong>By Phone:</strong> Call our store helpline directly at <a href="tel:+919876543210" className="text-blue-700 font-bold underline">+91 98765 43210</a> and inform our staff of your Order Number.
            </li>
          </ul>
        </section>

        {/* Section 4 */}
        <section className="space-y-3 rounded-xl border-2 border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-800 text-sm font-bold">4</span>
            Refund Processing Timelines &amp; Mode
          </h2>
          <p>
            If a paid product is returned and approved for refund:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Doorstep Cash/UPI Pickups:</strong> When our store technician picks up the eligible returned item from your address, a direct refund is processed via cash handover or instant UPI transfer to your phone number.
            </li>
            <li>
              <strong>Electronic / Bank Transfers:</strong> Where an electronic bank refund is required, funds will be initiated within <strong>24 to 48 hours</strong> and will reflect in your original bank account within <strong>3 to 5 business days</strong>, in compliance with RBI guidelines.
            </li>
          </ul>
        </section>

        {/* Section 5 */}
        <section className="space-y-4 rounded-xl border-2 border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-800 text-sm font-bold">5</span>
            How to Request a Return or Replacement
          </h2>
          <p>
            To initiate a replacement or return, simply contact our local store support with your Order Number:
          </p>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 space-y-2 text-base font-medium text-slate-800">
            <p><strong>Store Helpline:</strong> <a href="tel:+919876543210" className="text-blue-700 font-bold underline">+91 98765 43210</a> (9:00 AM – 8:30 PM, Monday to Saturday)</p>
            <p><strong>Support Email:</strong> <a href="mailto:support@shivaelectrical.in" className="text-blue-700 font-bold underline">support@shivaelectrical.in</a></p>
            <p><strong>Physical Shop Visit:</strong> Shiva Electrical &amp; Electronics, Shop No. 4, Market Yard Commercial Complex, Main Market Road, Solapur, Maharashtra - 413001</p>
          </div>
          <p className="text-sm text-slate-600">
            Our technician will visit your location to inspect the item, verify the defect, and either replace it on the spot or initiate a full refund.
          </p>
        </section>

        {/* Navigation links */}
        <div className="pt-4 flex flex-wrap gap-4 text-sm font-bold text-blue-700">
          <Link href="/terms" className="hover:underline">&larr; Terms &amp; Conditions</Link>
          <span className="text-slate-300">|</span>
          <Link href="/privacy-policy" className="hover:underline">Privacy Policy &rarr;</Link>
          <span className="text-slate-300">|</span>
          <Link href="/cookie-policy" className="hover:underline">Cookie Policy &rarr;</Link>
        </div>
      </div>
    </div>
  );
}
