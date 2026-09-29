import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, Scale } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms and Conditions | Customer Purchase Agreement",
  description:
    "Terms and Conditions for Shiva Electrical & Electronics in compliance with the Consumer Protection Act, 2019, Consumer Protection (E-Commerce) Rules, 2020, and Indian Contract Act, 1872.",
};

export default function TermsPage() {
  const lastUpdated = "September 26, 2026";

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 space-y-10">
      {/* Header */}
      <div className="border-b-2 border-slate-200 pb-8 space-y-4">
        <div className="inline-flex items-center gap-2 rounded-lg border-2 border-blue-200 bg-blue-50 px-3.5 py-1.5 text-sm font-bold text-blue-900">
          <Scale className="h-4 w-4 text-blue-700" />
          <span>Consumer Protection (E-Commerce) Rules 2020 Compliant</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
          Terms &amp; Conditions
        </h1>
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
          Welcome to <strong>Shiva Electrical &amp; Electronics</strong>. These Terms and Conditions constitute a legally binding agreement between you (&ldquo;Customer&rdquo; or &ldquo;Buyer&rdquo;) and Shiva Electrical &amp; Electronics (&ldquo;Store&rdquo;, &ldquo;we&rdquo;, or &ldquo;us&rdquo;) under the <strong>Indian Contract Act, 1872</strong> and the <strong>Consumer Protection (E-Commerce) Rules, 2020</strong>.
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
            Store Entity &amp; Statutory Business Disclosures
          </h2>
          <p>
            In compliance with Rule 4(1) and Rule 5 of the Consumer Protection (E-Commerce) Rules, 2020, our legal business details are provided below:
          </p>
          <div className="rounded-lg bg-slate-50 p-4 border border-slate-200 space-y-2 text-sm sm:text-base font-medium text-slate-800">
            <p><strong>Legal Entity Name:</strong> Shiva Electrical &amp; Electronics</p>
            <p><strong>Principal Place of Business:</strong> Shop No. 4, Market Yard Commercial Complex, Main Market Road, Solapur, Maharashtra - 413001, India</p>
            <p><strong>Nature of Business:</strong> Retail Sales of RO Water Purifiers, Spare Parts, Fans, Electrical Supplies, and Doorstep Installation Services</p>
            <p><strong>Customer Care Helpline:</strong> +91 98765 43210 (9:00 AM – 8:30 PM IST)</p>
            <p><strong>Customer Care Email:</strong> <a href="mailto:support@shivaelectrical.in" className="text-blue-700 underline">support@shivaelectrical.in</a></p>
            <p><strong>Grievance Officer:</strong> Grievance Officer (<a href="mailto:grievance@shivaelectrical.in" className="text-blue-700 underline">grievance@shivaelectrical.in</a>)</p>
          </div>
        </section>

        {/* Section 2 */}
        <section className="space-y-3 rounded-xl border-2 border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-800 text-sm font-bold">2</span>
            Transparent Pricing &amp; Taxes
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Inclusive Pricing:</strong> All product prices displayed on this website are listed in Indian Rupees (₹ / INR) and are <strong>inclusive of all applicable Goods and Services Tax (GST)</strong>.
            </li>
            <li>
              <strong>Transparent Delivery Charges:</strong> Any applicable local delivery fees are calculated and displayed transparently based on your verified 6-digit postal pincode before you place an order.
            </li>
            <li>
              <strong>Maximum Retail Price (MRP):</strong> We never sell products at prices exceeding the manufacturer&apos;s printed MRP. Where discounts are displayed, they represent genuine savings against the official MRP.
            </li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="space-y-3 rounded-xl border-2 border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-800 text-sm font-bold">3</span>
            Doorstep Ordering &amp; Pay on Delivery (COD) Terms
          </h2>
          <p>
            To provide zero financial risk for our customers, all web orders are processed via <strong>Pay on Delivery</strong> (Cash on Delivery or Doorstep UPI):
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>No Advance Payment Required:</strong> You do not enter any card details or transfer advance money online.
            </li>
            <li>
              <strong>Right to Inspect upon Arrival:</strong> When our store delivery personnel arrives at your doorstep, you have the right to inspect the physical packaging, seal, and model number before making payment.
            </li>
            <li>
              <strong>Payment Options at Doorstep:</strong> You can pay the exact invoice amount using cash or scan our official store UPI QR code using any Indian UPI app (Google Pay, PhonePe, Paytm, BHIM, etc.).
            </li>
            <li>
              <strong>Right to Reject Defective Goods:</strong> If an item arrives with broken seals or transit damage, you may reject the order directly at the doorstep without any penalty or cancellation fee.
            </li>
          </ul>
        </section>

        {/* Section 4 */}
        <section className="space-y-3 rounded-xl border-2 border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-800 text-sm font-bold">4</span>
            Doorstep Installation &amp; Technician Services
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              For select products such as RO water purifiers and ceiling fans, doorstep installation by a certified store technician is arranged upon delivery.
            </li>
            <li>
              Our technicians perform standard water TDS checks and inlet pressure verification for RO units to ensure proper installation.
            </li>
            <li>
              Any non-standard civil, electrical, or extra plumbing modifications (such as electrical extension wiring or long-distance water piping beyond standard kit lengths) will be quoted and agreed upon with the customer prior to execution.
            </li>
          </ul>
        </section>

        {/* Section 5: Intellectual Property & Nominative Fair Use */}
        <section className="space-y-4 rounded-xl border-2 border-amber-300 bg-amber-50/70 p-6 sm:p-8 shadow-xs">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="h-6 w-6 text-amber-800" />
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              5. Trademarks &amp; Nominative Fair Use Notice
            </h2>
          </div>
          <p className="text-slate-800">
            Shiva Electrical &amp; Electronics operates as an <strong>independent multi-brand retailer and service provider</strong>.
          </p>
          <div className="rounded-lg bg-white p-4 border border-amber-200 space-y-2 text-sm sm:text-base text-slate-700">
            <p>
              All product brand names, registered trademarks, logos, and emblems referenced on this site (including but not limited to <em>AquaPure, Kent, Aquaguard, Havells, Crompton, Anchor by Panasonic, Usha</em>) are the exclusive intellectual property of their respective trademark holders.
            </p>
            <p>
              Reference to these brand names is made strictly under the doctrine of <strong>nominative fair use</strong> (Section 30 of the Trade Marks Act, 1999) solely to:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Accurately identify genuine brand merchandise stocked in our retail inventory.</li>
              <li>Indicate technical compatibility and physical fitment of spare parts, replacement filter candles, and membrane housings.</li>
            </ul>
            <p className="font-semibold text-slate-900">
              Unless explicitly stated, Shiva Electrical &amp; Electronics does not claim exclusive franchise ownership or direct sponsorship from third-party trademark holders.
            </p>
          </div>
        </section>

        {/* Section 6 */}
        <section className="space-y-3 rounded-xl border-2 border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-800 text-sm font-bold">6</span>
            Order Cancellations &amp; Stock Availability
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Customer Cancellation:</strong> You can cancel any order free of charge at any time prior to delivery dispatch using the order tracking page or by calling our shop directly.
            </li>
            <li>
              <strong>Store Cancellation:</strong> While we maintain live shop inventory synchronization, in the rare event that an item is damaged or out of stock prior to dispatch, we will contact you immediately to provide an alternative or cancel the order without obligation.
            </li>
          </ul>
        </section>

        {/* Section 7 */}
        <section className="space-y-3 rounded-xl border-2 border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-800 text-sm font-bold">7</span>
            Governing Law &amp; Jurisdiction
          </h2>
          <p>
            These Terms and Conditions and any dispute or claim arising out of or in connection with them shall be governed by and construed in accordance with the <strong>laws of the Republic of India</strong>. The competent courts situated in <strong>Solapur, Maharashtra, India</strong> shall have exclusive jurisdiction over any legal proceedings.
          </p>
        </section>

        {/* Navigation links */}
        <div className="pt-4 flex flex-wrap gap-4 text-sm font-bold text-blue-700">
          <Link href="/privacy-policy" className="hover:underline">Privacy Policy &rarr;</Link>
          <span className="text-slate-300">|</span>
          <Link href="/refund-policy" className="hover:underline">Refund &amp; Return Policy &rarr;</Link>
          <span className="text-slate-300">|</span>
          <Link href="/cookie-policy" className="hover:underline">Cookie Policy &rarr;</Link>
        </div>
      </div>
    </div>
  );
}
