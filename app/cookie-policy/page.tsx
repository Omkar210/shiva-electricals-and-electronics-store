import type { Metadata } from "next";
import Link from "next/link";
import { Cookie, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Cookie Policy | Transparency & Privacy",
  description:
    "Cookie Policy for Shiva Electrical & Electronics. Learn about the strictly necessary functional cookies we use and our commitment to zero third-party advertising tracking.",
};

export default function CookiePolicyPage() {
  const lastUpdated = "September 26, 2026";

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 space-y-10">
      {/* Header */}
      <div className="border-b-2 border-slate-200 pb-8 space-y-4">
        <div className="inline-flex items-center gap-2 rounded-lg border-2 border-blue-200 bg-blue-50 px-3.5 py-1.5 text-sm font-bold text-blue-900">
          <Cookie className="h-4 w-4 text-blue-700" />
          <span>Zero Third-Party Tracking Cookies</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
          Cookie Policy
        </h1>
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
          This Cookie Policy explains how <strong>Shiva Electrical &amp; Electronics</strong> uses cookies and similar technologies on our website. We believe in strict privacy and complete transparency.
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
            What Are Cookies?
          </h2>
          <p>
            Cookies are small text files placed on your computer or mobile device when you browse websites. They are widely used to make websites function properly and efficiently, such as remembering items placed in your shopping cart.
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-4 rounded-xl border-2 border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-800 text-sm font-bold">2</span>
            Strictly Necessary Cookies We Use
          </h2>
          <p>
            We only utilize <strong>strictly necessary, first-party technical cookies</strong> required for the core operation of our web store. We do not use any marketing, profiling, or cross-site behavioral tracking cookies.
          </p>

          <div className="overflow-x-auto rounded-lg border-2 border-slate-200">
            <table className="min-w-full divide-y-2 divide-slate-200 text-left text-sm sm:text-base">
              <thead className="bg-slate-50 font-bold text-slate-900">
                <tr>
                  <th className="px-4 py-3">Cookie Name</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Duration</th>
                  <th className="px-4 py-3">Purpose</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                <tr>
                  <td className="px-4 py-3 font-mono font-bold text-blue-800">se_guest_cart</td>
                  <td className="px-4 py-3 font-semibold text-slate-700">Strictly Necessary</td>
                  <td className="px-4 py-3 text-slate-600">7 Days</td>
                  <td className="px-4 py-3 text-slate-700">
                    Stores your temporary shopping cart items (product ID and quantity) so you do not lose items while browsing between pages.
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-mono font-bold text-blue-800">sb-*-auth-token</td>
                  <td className="px-4 py-3 font-semibold text-slate-700">Strictly Necessary</td>
                  <td className="px-4 py-3 text-slate-600">Session / Login Duration</td>
                  <td className="px-4 py-3 text-slate-700">
                    Maintains secure encrypted login session state if you log in to your account.
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-mono font-bold text-blue-800">se_cookie_ack</td>
                  <td className="px-4 py-3 font-semibold text-slate-700">Functional Preference</td>
                  <td className="px-4 py-3 text-slate-600">1 Year (localStorage)</td>
                  <td className="px-4 py-3 text-slate-700">
                    Remembers that you have acknowledged our privacy and essential cookie notice so the banner does not re-appear repeatedly.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 3 */}
        <section className="space-y-3 rounded-xl border-2 border-emerald-200 bg-emerald-50/70 p-6 sm:p-8 shadow-xs">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="h-6 w-6 text-emerald-700" />
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              3. Do You Need Cookie Consent?
            </h2>
          </div>
          <p className="text-slate-800">
            Under both <strong>India&apos;s Digital Personal Data Protection Act, 2023</strong> and international standards (such as the EU ePrivacy Directive):
          </p>
          <ul className="list-disc pl-6 space-y-2 text-slate-800">
            <li>
              <strong>Exemption for Essential Functionality:</strong> Cookies that are <em>strictly necessary</em> to deliver a service explicitly requested by the user (such as retaining items in a shopping cart or securely logging in) do not require prior invasive consent blocking popups.
            </li>
            <li>
              <strong>No Advertising Tracking:</strong> Because Shiva Electrical &amp; Electronics operates <strong>zero third-party advertising pixels, zero analytics scripts, and zero cross-site behavioral tracking cookies</strong>, you are never tracked across the web when visiting our store.
            </li>
            <li>
              <strong>Transparent Notice:</strong> We provide a non-intrusive cookie notification on your first visit to ensure complete transparency regarding our essential technical cookies.
            </li>
          </ul>
        </section>

        {/* Section 4 */}
        <section className="space-y-3 rounded-xl border-2 border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-800 text-sm font-bold">4</span>
            How to Control &amp; Delete Cookies
          </h2>
          <p>
            You have full control over cookies in your web browser. You can configure your browser to block or delete cookies at any time:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Google Chrome:</strong> Settings &rarr; Privacy and security &rarr; Cookies and other site data.</li>
            <li><strong>Mozilla Firefox:</strong> Settings &rarr; Privacy &amp; Security &rarr; Cookies and Site Data.</li>
            <li><strong>Microsoft Edge:</strong> Settings &rarr; Cookies and site permissions &rarr; Manage and delete cookies.</li>
            <li><strong>Apple Safari:</strong> Preferences &rarr; Privacy &rarr; Manage Website Data.</li>
          </ul>
          <p className="text-sm font-medium text-slate-600">
            <em>Please note:</em> Disabling strictly necessary cookies may prevent the shopping cart from retaining your selected items during your visit.
          </p>
        </section>

        {/* Navigation links */}
        <div className="pt-4 flex flex-wrap gap-4 text-sm font-bold text-blue-700">
          <Link href="/privacy-policy" className="hover:underline">&larr; Privacy Policy</Link>
          <span className="text-slate-300">|</span>
          <Link href="/terms" className="hover:underline">Terms &amp; Conditions &rarr;</Link>
          <span className="text-slate-300">|</span>
          <Link href="/refund-policy" className="hover:underline">Refund &amp; Return Policy &rarr;</Link>
        </div>
      </div>
    </div>
  );
}
