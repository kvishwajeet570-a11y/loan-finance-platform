"use client";

import { ChevronDown, HelpCircle } from "lucide-react";
import { useState } from "react";

import { useHomeFaqs } from "@/hooks/useHome";

export default function FaqSection() {
  const { data, isLoading, isError } = useHomeFaqs();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = data?.faqs ?? [];

  return (
    <section className="bg-slate-50 px-5 py-20 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="text-center">
          <div className="mx-auto flex w-fit items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-xs font-bold text-blue-700">
            <HelpCircle size={15} />
            Frequently Asked Questions
          </div>

          <h2 className="mt-5 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
            Questions, answered clearly
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
            Find answers to common questions about applications, eligibility
            and the finance process.
          </p>
        </div>

        <div className="mt-10">
          {isLoading && (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
              Loading FAQs...
            </div>
          )}

          {isError && (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
              FAQs are currently unavailable.
            </div>
          )}

          {!isLoading && !isError && faqs.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
              <HelpCircle className="mx-auto text-slate-300" size={34} />
              <h3 className="mt-4 text-base font-bold text-slate-800">
                No published FAQs yet
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                Published FAQ content will appear here when it is available.
              </p>
            </div>
          )}

          {!isLoading && !isError && faqs.length > 0 && (
            <div className="space-y-3">
              {faqs.map((faq, index) => {
                const isOpen = openIndex === index;

                return (
                  <div
                    key={faq.id ?? `${faq.question}-${index}`}
                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setOpenIndex(isOpen ? null : index)
                      }
                      className="flex w-full items-center justify-between gap-5 px-5 py-5 text-left"
                    >
                      <span className="text-sm font-bold leading-6 text-slate-900 sm:text-base">
                        {faq.question}
                      </span>

                      <ChevronDown
                        size={19}
                        className={`shrink-0 text-slate-500 transition-transform ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <div className="border-t border-slate-100 px-5 pb-5 pt-4">
                        <p className="text-sm leading-7 text-slate-500">
                          {faq.answer}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
