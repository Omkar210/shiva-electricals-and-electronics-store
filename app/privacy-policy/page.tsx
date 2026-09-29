import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, Mail, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy & DPDP Act Compliance",
  description:
    "Privacy Policy for Shiva Electrical & Electronics. Learn how we collect, process, and protect your personal data in strict compliance with India's Digital Personal Data Protection Act, 2023 (DPDP Act) and the Information Technology Act, 2000.",
};

export default function PrivacyPolicyPage() {
  const lastUpdated = "September 26, 2026";

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 space-y-10">
      {/* Header */}
      <div className="border-b-2 border-slate-200 pb-8 space-y-4">
        <div className="inline-flex items-center gap-2 rounded-lg border-2 border-blue-200 bg-blue-50 px-3.5 py-1.5 text-sm font-bold text-blue-900">
          <ShieldCheck className="h-4 w-4 text-blue-700" />
          <span>India DPDP Act (2023) &amp; IT Act Compliant</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
          Privacy Policy
        </h1>
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
          At <strong>Shiva Electrical &amp; Electronics</strong> (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;), we respect your privacy and are committed to protecting your personal data. This Privacy Policy informs you how we collect, handle, store, and protect your personal information in strict compliance with the <strong>Digital Personal Data Protection Act, 2023 (&ldquo;DPDP Act&rdquo;)</strong>, the <strong>Information Technology Act, 2000</strong>, and applicable Indian data protection regulations.
        </p>
        <p className="text-sm font-semibold text-slate-500">
          Last Updated &amp; Effective Date: {lastUpdated}
        </p>
      </div>

      {/* Main Legal Content */}
      <div className="space-y-8 text-base sm:text-lg leading-relaxed text-slate-700">
        {/* Section 1 */}
        <section className="space-y-3 rounded-xl border-2 border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-800 text-sm font-bold">1</span>
            Data Fiduciary Details &amp; Contact
          </h2>
          <p>
            Under the DPDP Act 2023, <strong>Shiva Electrical &amp; Electronics</strong> acts as the <strong>Data Fiduciary</strong> determining the purpose and means of processing personal data.
          </p>
          <div className="rounded-lg bg-slate-50 p-4 border border-slate-200 space-y-2 text-sm sm:text-base font-medium text-slate-800">
            <p><strong>Entity Name:</strong> Shiva Electrical &amp; Electronics</p>
            <p><strong>Physical Store Address:</strong> Shop No. 4, Market Yard Commercial Complex, Main Market Road, Solapur, Maharashtra - 413001, India</p>
            <p><strong>Customer Support Phone:</strong> +91 98765 43210</p>
            <p><strong>Official Contact Email:</strong> <a href="mailto:contact@shivaelectrical.in" className="text-blue-700 underline">contact@shivaelectrical.in</a></p>
          </div>
        </section>

        {/* Section 2 */}
        <section className="space-y-3 rounded-xl border-2 border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-800 text-sm font-bold">2</span>
            Data Minimization: What Data We Collect
          </h2>
          <p>
            We strictly observe the principle of <strong>data minimization</strong>. We only collect the bare minimum personal data necessary to provide you with order fulfillment, doorstep delivery, and installation services:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Customer Identification:</strong> Full Name (to address orders and delivery packages).
            </li>
            <li>
              <strong>Contact Data:</strong> Mobile Phone Number (strictly for delivery drivers to coordinate doorstep handover and technician visit scheduling).
            </li>
            <li>
              <strong>Delivery Address:</strong> House/Building, Street, Landmark, Town/City, and 6-digit Pincode (strictly to dispatch and physically deliver your purchased items).
            </li>
            <li>
              <strong>Optional Email:</strong> Email address if you choose to receive a digital receipt or register an account. (Guest checkout is fully supported without requiring an account).
            </li>
            <li>
              <strong>Technical Session State:</strong> A single functional session cookie (<code className="bg-slate-100 px-1.5 py-0.5 rounded text-blue-800 font-mono text-sm">se_guest_cart</code>) to retain your selected items in your shopping cart across page refreshes.
            </li>
          </ul>
          <div className="rounded-lg bg-emerald-50 border border-emerald-300 p-4 text-emerald-950 text-sm font-semibold flex items-center gap-2.5">
            <CheckCircle2 className="h-5 w-5 text-emerald-700 shrink-0" />
            <span>We NEVER collect bank account details, credit/debit card numbers, biometric data, or government ID numbers on this website. All payments are settled via Pay on Delivery (Cash or UPI scan at your doorstep).</span>
          </div>
        </section>

        {/* Section 3 */}
        <section className="space-y-3 rounded-xl border-2 border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-800 text-sm font-bold">3</span>
            Lawful Basis &amp; Purpose of Processing
          </h2>
          <p>
            In accordance with Sections 4, 6, and 7 of the DPDP Act 2023, your personal data is processed solely on the following lawful grounds:
          </p>
          <div className="grid gap-4 sm:grid-cols-2 pt-2">
            <div className="rounded-lg border border-slate-200 p-4 bg-slate-50 space-y-1.5">
              <h3 className="font-bold text-slate-900 text-base">A. Specific Consent</h3>
              <p className="text-sm text-slate-600">
                You provide affirmative, unconditional consent at checkout or signup for us to contact you and navigate to your address for order delivery.
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 p-4 bg-slate-50 space-y-1.5">
              <h3 className="font-bold text-slate-900 text-base">B. Contractual Fulfillment</h3>
              <p className="text-sm text-slate-600">
                Processing is strictly necessary to deliver purchased goods, provide water purifier installation, and honor manufacturer warranty claims.
              </p>
            </div>
          </div>
        </section>

        {/* Section 4 */}
        <section className="space-y-3 rounded-xl border-2 border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-800 text-sm font-bold">4</span>
            Zero Third-Party Advertising &amp; Tracking
          </h2>
          <p>
            Unlike many commercial websites, <strong>we do not sell, rent, monetize, or share your personal data with third-party advertising networks, data brokers, or marketing profiling companies</strong>.
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>We do not run Google Analytics, Meta Pixel, Hotjar, or programmatic ad-tracking trackers.</li>
            <li>We do not perform automated profiling or automated behavioral tracking.</li>
            <li>Fonts (Inter) are pre-bundled and self-hosted with our website deployment, meaning your IP address is never transmitted to external third-party font servers.</li>
          </ul>
        </section>

        {/* Section 5 */}
        <section className="space-y-3 rounded-xl border-2 border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-800 text-sm font-bold">5</span>
            Your Rights as a Data Principal (DPDP Act 2023)
          </h2>
          <p>
            Under Chapter III of the DPDP Act 2023, you hold the following statutory rights regarding your personal data:
          </p>
          <div className="space-y-3 pt-1">
            <div className="rounded-lg border border-slate-200 p-3.5 bg-slate-50">
              <h4 className="font-bold text-slate-900 text-base">1. Right to Access Information</h4>
              <p className="text-sm text-slate-600">You may request a summary of the personal data we hold about you and the processing activities undertaken.</p>
            </div>
            <div className="rounded-lg border border-slate-200 p-3.5 bg-slate-50">
              <h4 className="font-bold text-slate-900 text-base">2. Right to Correction &amp; Erasure</h4>
              <p className="text-sm text-slate-600">You may request the correction of inaccurate or misleading personal data, or the complete deletion of your data when it is no longer required for order fulfillment or statutory tax compliance.</p>
            </div>
            <div className="rounded-lg border border-slate-200 p-3.5 bg-slate-50">
              <h4 className="font-bold text-slate-900 text-base">3. Right to Withdraw Consent</h4>
              <p className="text-sm text-slate-600">You have the right to withdraw your consent at any time as easily as giving it, by contacting our Grievance Officer.</p>
            </div>
            <div className="rounded-lg border border-slate-200 p-3.5 bg-slate-50">
              <h4 className="font-bold text-slate-900 text-base">4. Right to Nominate</h4>
              <p className="text-sm text-slate-600">You may nominate another individual to exercise your data rights in the event of death or incapacity.</p>
            </div>
          </div>
        </section>

        {/* Section 6 */}
        <section className="space-y-3 rounded-xl border-2 border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-800 text-sm font-bold">6</span>
            Protection of Children&apos;s Data
          </h2>
          <p>
            In compliance with Section 9 of the DPDP Act 2023, we do not knowingly collect personal data from individuals under 18 years of age without verifiable parental or guardian consent. We do not track children, target advertisements to minors, or process data likely to cause detrimental effects to any child.
          </p>
        </section>

        {/* Section 7 */}
        <section className="space-y-3 rounded-xl border-2 border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-800 text-sm font-bold">7</span>
            Data Storage, Retention &amp; Security
          </h2>
          <p>
            We implement reasonable technical and organizational security safeguards to prevent data breaches, unauthorized access, or loss, including encrypted database storage and role-based access control.
          </p>
          <p>
            Personal data associated with completed orders is retained only for as long as necessary to facilitate warranty claims, customer service, and statutory taxation/accounting records as mandated by Indian law (typically up to 8 years under GST and Income Tax statutes), after which it is securely anonymized or destroyed.
          </p>
        </section>

        {/* Section 8: Grievance Officer */}
        <section className="space-y-4 rounded-xl border-2 border-blue-300 bg-blue-50/70 p-6 sm:p-8 shadow-xs">
          <div className="flex items-center gap-2.5">
            <Mail className="h-6 w-6 text-blue-700" />
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              8. Grievance Redressal Officer (Mandated Disclosure)
            </h2>
          </div>
          <p className="text-slate-800">
            In compliance with the <strong>DPDP Act 2023</strong> and the <strong>Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules</strong>, we have designated a dedicated Grievance Officer to address any data protection concerns, consent withdrawal requests, or privacy inquiries:
          </p>
          <div className="rounded-xl border border-blue-200 bg-white p-5 space-y-2 text-base text-slate-800">
            <p><strong>Designation:</strong> Data Protection &amp; Grievance Redressal Officer</p>
            <p><strong>Name:</strong> Grievance Officer, Shiva Electrical &amp; Electronics</p>
            <p><strong>Email:</strong> <a href="mailto:grievance@shivaelectrical.in" className="text-blue-700 font-bold underline">grievance@shivaelectrical.in</a></p>
            <p><strong>Direct Telephone:</strong> +91 98765 43210 (Mon–Sat, 10:00 AM – 6:00 PM IST)</p>
            <p><strong>Postal Address:</strong> Shop No. 4, Market Yard Commercial Complex, Main Market Road, Solapur, Maharashtra - 413001, India</p>
          </div>
          <p className="text-sm font-medium text-slate-700">
            Our Grievance Officer shall acknowledge your request within <strong>48 hours</strong> and resolve your concern within <strong>30 days</strong>. If you are not satisfied with the resolution, you retain the statutory right under the DPDP Act 2023 to submit a complaint to the <strong>Data Protection Board of India</strong>.
          </p>
        </section>

        {/* Navigation link back */}
        <div className="pt-4 flex flex-wrap gap-4 text-sm font-bold text-blue-700">
          <Link href="/terms" className="hover:underline">&larr; Terms &amp; Conditions</Link>
          <span className="text-slate-300">|</span>
          <Link href="/cookie-policy" className="hover:underline">Cookie Policy &rarr;</Link>
          <span className="text-slate-300">|</span>
          <Link href="/refund-policy" className="hover:underline">Refund &amp; Return Policy &rarr;</Link>
        </div>
      </div>
    </div>
  );
}
