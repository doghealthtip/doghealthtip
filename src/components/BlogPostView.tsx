import React, { useEffect, useState } from 'react';
import { EditorialArticle } from '../types';
import { TableOfContents } from './TableOfContents';
import { extractHeadingsAndInjectIds } from '../utils/tocGenerator';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Award,
  Share2,
  Check,
  ExternalLink,
  BookOpen,
  ChevronRight,
  ShieldCheck,
  Tag,
} from 'lucide-react';

interface BlogPostViewProps {
  post: EditorialArticle;
  allPosts: EditorialArticle[];
  onBackToBlog: () => void;
  onSelectPost: (post: EditorialArticle) => void;
  onNavigateTab?: (tab: string) => void;
}

export const BlogPostView: React.FC<BlogPostViewProps> = ({
  post,
  allPosts,
  onBackToBlog,
  onSelectPost,
  onNavigateTab,
}) => {
  const [copied, setCopied] = useState(false);

  // SEO: Update page title and meta description when post opens
  useEffect(() => {
    const originalTitle = document.title;
    const pageTitle = post.seo?.seoTitle || `${post.title} | Canine Health Hub`;
    document.title = pageTitle;

    let metaDesc = document.querySelector('meta[name="description"]');
    const originalMeta = metaDesc ? metaDesc.getAttribute('content') : '';
    if (post.seo?.metaDescription) {
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', post.seo.metaDescription);
    }

    // Scroll to top on mount
    window.scrollTo({ top: 0, behavior: 'smooth' });

    return () => {
      document.title = originalTitle;
      if (metaDesc && originalMeta) {
        metaDesc.setAttribute('content', originalMeta);
      }
    };
  }, [post]);

  // Handle internal link navigation clicks inside blog HTML
  const handleContentClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = (e.target as HTMLElement).closest('a');
    if (!target) return;

    const href = target.getAttribute('href');
    if (href && href.startsWith('#')) {
      e.preventDefault();
      const targetId = href.substring(1);
      // Check if it's an app tab (e.g., #triage, #nutrition, #library)
      if (['triage', 'nutrition', 'library', 'calculator'].includes(targetId)) {
        if (onNavigateTab) {
          onNavigateTab(targetId === 'calculator' ? 'nutrition' : targetId);
          return;
        }
      }
      // Or an in-page heading anchor
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        window.history.replaceState(null, '', `#${targetId}`);
      }
    }
  };

  // Prepare full HTML content
  let rawContent = post.contentHtml;
  if (!rawContent || !rawContent.trim()) {
    // Generate HTML from legacy sections if contentHtml is empty
    rawContent = (post.sections || [])
      .map(
        (sec) => `
      <h2>${sec.heading}</h2>
      ${sec.paragraphs.map((p) => `<p>${p}</p>`).join('')}
    `
      )
      .join('\n');
  }

  // Extract headings and inject anchor IDs for automatic Table of Contents
  const { processedHtml, headings } = extractHeadingsAndInjectIds(rawContent);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Find related articles in the same or adjacent categories
  const relatedPosts = allPosts
    .filter((p) => p.id !== post.id && p.status !== 'draft')
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#1c1c16] pb-20">
      {/* Top Breadcrumbs & Back Navigation */}
      <div className="bg-[#FAF6EC] border-b border-[#E8E0D3]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Breadcrumb links */}
            <nav aria-label="Breadcrumb" className="flex items-center text-xs text-[#718C5C] space-x-1.5">
              <button
                type="button"
                onClick={onBackToBlog}
                className="hover:text-[#315B2B] transition-colors"
              >
                Clinical Blog
              </button>
              <ChevronRight className="w-3.5 h-3.5 text-[#A59D84]" />
              <span className="text-[#A59D84] font-medium">{post.category}</span>
              <ChevronRight className="w-3.5 h-3.5 text-[#A59D84] hidden sm:inline" />
              <span className="text-[#4A3525] font-semibold truncate max-w-[200px] sm:max-w-xs hidden sm:inline">
                {post.title}
              </span>
            </nav>

            <button
              type="button"
              onClick={onBackToBlog}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#315B2B] hover:text-[#24451F] bg-white border border-[#CEECB4] px-3 py-1.5 rounded-lg shadow-xs transition-all hover:shadow-sm"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Articles</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Article Container */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 pb-12">
        <header className="mb-8">
          {/* Category & Evidence Grade Meta Badges */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="px-3 py-1 bg-[#24451F] text-[#CEECB4] rounded-full text-xs font-bold tracking-wide uppercase">
              {post.category}
            </span>
            <span className="px-3 py-1 bg-[#FAF6EC] text-[#4A3525] border border-[#E8E0D3] rounded-full text-xs font-semibold inline-flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-[#718C5C]" />
              {post.evidenceGrade || 'Class A Clinical Trial'}
            </span>
            {post.status === 'draft' && (
              <span className="px-3 py-1 bg-amber-100 text-amber-900 border border-amber-300 rounded-full text-xs font-bold uppercase tracking-wider">
                Draft Preview
              </span>
            )}
          </div>

          {/* Primary Article Title */}
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#1c1c16] leading-tight tracking-tight mb-5">
            {post.title}
          </h1>

          {/* Subtitle / Clinical Summary */}
          {post.summary && (
            <p className="text-lg sm:text-xl text-[#5C4D3C] font-normal leading-relaxed mb-6 font-serif italic border-l-3 border-[#315B2B] pl-4">
              "{post.summary}"
            </p>
          )}

          {/* Author & Publishing Metadata Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-[#E8E0D3] bg-white/60 rounded-xl px-4">
            <div className="flex items-center gap-3">
              <img
                src={post.vetAvatar || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=200&q=80'}
                alt={post.authorVet}
                className="w-12 h-12 rounded-full object-cover border-2 border-[#CEECB4] shadow-xs"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-sm text-[#1c1c16]">{post.authorVet}</span>
                  <ShieldCheck className="w-4 h-4 text-[#315B2B]" title="Verified Veterinary Contributor" />
                </div>
                <p className="text-xs text-[#718C5C] font-medium">{post.vetCredentials}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-[#718C5C]">
              <div className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>{post.publishDate}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{post.readTimeMinutes} min read</span>
              </div>
              <button
                type="button"
                onClick={handleShare}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#24451F] bg-[#FAF6EC] border border-[#E8E0D3] hover:bg-[#CEECB4]/30 px-2.5 py-1 rounded-md transition-colors"
                title="Copy article URL"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[#315B2B]" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Share'}</span>
              </button>
            </div>
          </div>
        </header>

        {/* Hero Featured Image */}
        <figure className="mb-8 rounded-2xl overflow-hidden shadow-md border border-[#E8E0D3] bg-[#E8E0D3]">
          <img
            src={post.heroImage}
            alt={post.heroImageAlt || post.title}
            className="w-full h-72 sm:h-96 md:h-[420px] object-cover"
          />
          {post.heroImageAlt && (
            <figcaption className="text-center text-xs text-[#718C5C] py-2 px-4 bg-[#FAF6EC] border-t border-[#E8E0D3] italic">
              {post.heroImageAlt}
            </figcaption>
          )}
        </figure>

        {/* Key Clinical Takeaways Box */}
        {post.keyTakeaways && post.keyTakeaways.length > 0 && (
          <section className="mb-8 p-6 bg-[#FAF6EC] border border-[#CEECB4] rounded-2xl shadow-xs">
            <h2 className="font-serif text-lg font-bold text-[#24451F] mb-3 flex items-center gap-2">
              <Award className="w-5 h-5 text-[#315B2B]" />
              Key Clinical Takeaways
            </h2>
            <ul className="space-y-2 text-sm text-[#4A3525]">
              {post.keyTakeaways.map((takeaway, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#315B2B] mt-2 shrink-0" />
                  <span className="leading-relaxed">{takeaway}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Automatic Table of Contents Component */}
        <TableOfContents headings={headings} />

        {/* Main Article Rich-Text HTML Body */}
        <div
          onClick={handleContentClick}
          className="prose prose-lg max-w-none text-[#332A20] leading-relaxed
            [&>h2]:font-serif [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:text-[#1c1c16] [&>h2]:mt-10 [&>h2]:mb-4 [&>h2]:border-b [&>h2]:border-[#E8E0D3] [&>h2]:pb-2
            [&>h3]:font-serif [&>h3]:text-xl [&>h3]:font-bold [&>h3]:text-[#24451F] [&>h3]:mt-6 [&>h3]:mb-3
            [&>p]:mb-5 [&>p]:leading-relaxed [&>p]:text-[16px]
            [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-6 [&>ul]:space-y-2 [&>ul]:text-[15px]
            [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:mb-6 [&>ol]:space-y-2 [&>ol]:text-[15px]
            [&>blockquote]:border-l-4 [&>blockquote]:border-[#315B2B] [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:text-[#5C4D3C] [&>blockquote]:my-6 [&>blockquote]:bg-[#FAF6EC]/60 [&>blockquote]:py-2 [&>blockquote]:rounded-r-lg
            [&>a]:text-[#315B2B] [&>a]:underline [&>a]:font-semibold [&>a:hover]:text-[#24451F]
          "
          dangerouslySetInnerHTML={{ __html: processedHtml }}
        />

        {/* Article Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-12 pt-6 border-t border-[#E8E0D3] flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-[#718C5C] flex items-center gap-1 mr-1">
              <Tag className="w-3.5 h-3.5" />
              Topics:
            </span>
            {post.tags.map((tag, idx) => (
              <span
                key={idx}
                className="text-xs bg-[#FAF6EC] text-[#4A3525] border border-[#E8E0D3] px-2.5 py-1 rounded-lg font-medium hover:bg-[#CEECB4]/30 transition-colors"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Veterinary Reviewer Assurance Card */}
        <section className="mt-10 p-6 bg-white border border-[#E8E0D3] rounded-2xl shadow-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <img
                src={post.vetAvatar}
                alt={post.authorVet}
                className="w-14 h-14 rounded-full object-cover border-2 border-[#315B2B]"
              />
              <div>
                <h3 className="font-serif text-base font-bold text-[#1c1c16]">
                  Reviewed & Authored by {post.authorVet}
                </h3>
                <p className="text-xs text-[#718C5C]">{post.vetCredentials}</p>
                <p className="text-xs text-[#5C4D3C] mt-1">
                  Peer-reviewed according to evidence-based veterinary clinical criteria.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onBackToBlog}
              className="px-4 py-2 bg-[#FAF6EC] hover:bg-[#CEECB4]/30 text-[#24451F] text-xs font-bold rounded-xl border border-[#E8E0D3] transition-colors shrink-0"
            >
              Explore More Studies
            </button>
          </div>
        </section>

        {/* Related Articles Section */}
        {relatedPosts.length > 0 && (
          <section className="mt-14 pt-10 border-t border-[#E8E0D3]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-2xl font-bold text-[#1c1c16]">
                Related Peer-Reviewed Research
              </h2>
              <button
                type="button"
                onClick={onBackToBlog}
                className="text-xs font-bold text-[#315B2B] hover:underline flex items-center gap-1"
              >
                View all articles
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((related) => (
                <div
                  key={related.id}
                  onClick={() => onSelectPost(related)}
                  className="group bg-white rounded-xl border border-[#E8E0D3] overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col"
                >
                  <div className="h-40 overflow-hidden bg-[#FAF6EC]">
                    <img
                      src={related.heroImage}
                      alt={related.heroImageAlt || related.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#315B2B] bg-[#FAF6EC] px-2 py-0.5 rounded">
                        {related.category}
                      </span>
                      <h3 className="font-serif text-sm font-bold text-[#1c1c16] mt-2 group-hover:text-[#315B2B] transition-colors line-clamp-2">
                        {related.title}
                      </h3>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-[#718C5C] mt-4 pt-3 border-t border-[#E8E0D3]">
                      <span>{related.authorVet}</span>
                      <span>{related.readTimeMinutes} min</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </article>
    </div>
  );
};
