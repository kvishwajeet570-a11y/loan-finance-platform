"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, CalendarDays } from "lucide-react";

import { useHomeBlogs } from "@/hooks/useHome";

export default function BlogSection() {
  const { data, isLoading, isError } = useHomeBlogs();
  const blogs = data?.blogs ?? [];

  return (
    <section className="bg-white px-5 py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <div className="flex w-fit items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-xs font-bold text-blue-700">
              <BookOpen size={15} />
              Finance Insights
            </div>

            <h2 className="mt-5 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              Latest from our finance blog
            </h2>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
              Read published articles and useful information from the platform.
            </p>
          </div>

          {blogs.length > 0 && (
            <Link
              href="/blog"
              className="inline-flex w-fit items-center gap-2 text-sm font-bold text-blue-700 hover:text-blue-900"
            >
              View all
              <ArrowRight size={16} />
            </Link>
          )}
        </div>

        <div className="mt-10">
          {isLoading && (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-500">
              Loading articles...
            </div>
          )}

          {isError && (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-500">
              Blog content is currently unavailable.
            </div>
          )}

          {!isLoading && !isError && blogs.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
              <BookOpen className="mx-auto text-slate-300" size={34} />
              <h3 className="mt-4 text-base font-bold text-slate-800">
                No published articles yet
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                Published blog articles will appear here when they are available.
              </p>
            </div>
          )}

          {!isLoading && !isError && blogs.length > 0 && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {blogs.map((blog, index) => (
                <article
                  key={blog.id ?? `${blog.slug}-${index}`}
                  className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  {blog.featuredImage ? (
                    <img
                      src={blog.featuredImage}
                      alt={blog.title}
                      className="h-48 w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                    />
                  ) : (
                    <div className="flex h-48 items-center justify-center bg-slate-100">
                      <BookOpen className="text-slate-300" size={34} />
                    </div>
                  )}

                  <div className="p-6">
                    {blog.category && (
                      <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
                        {blog.category}
                      </span>
                    )}

                    <h3 className="mt-3 line-clamp-2 text-xl font-black text-slate-900">
                      {blog.title}
                    </h3>

                    {blog.excerpt && (
                      <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-500">
                        {blog.excerpt}
                      </p>
                    )}

                    <div className="mt-5 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <CalendarDays size={14} />

                        {blog.publishedAt
                          ? new Date(blog.publishedAt).toLocaleDateString(
                              "en-IN",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              }
                            )
                          : "Published"}
                      </div>

                      {blog.slug && (
                        <Link
                          href={`/blog/${encodeURIComponent(blog.slug)}`}
                          className="inline-flex items-center gap-1 text-xs font-bold text-blue-700"
                        >
                          Read
                          <ArrowRight size={14} />
                        </Link>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
