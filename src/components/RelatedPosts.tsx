import React, { useMemo } from 'react';
import { EditorialArticle } from '../types';
import {
  Clock,
  Calendar,
  ChevronRight,
  ShieldCheck,
  Tag,
  BookOpen,
  Sparkles,
} from 'lucide-react';

interface RelatedPostsProps {
  currentPost: EditorialArticle;
  allPosts: EditorialArticle[];
  onSelectPost: (post: EditorialArticle) => void;
  onViewAll?: () => void;
}

interface ScoredPost {
  post: EditorialArticle;
  score: number;
  matchReasons: string[];
}

export const RelatedPosts: React.FC<RelatedPostsProps> = ({
  currentPost,
  allPosts,
  onSelectPost,
  onViewAll,
}) => {
  // Compute top 3 related posts based on categories and tags
  const relatedPostsWithScores = useMemo(() => {
    const candidates = allPosts.filter(
      (p) =>
        p.id !== currentPost.id &&
        p.slug !== currentPost.slug &&
        p.status !== 'draft'
    );

    const currentTags = new Set(
      (currentPost.tags || []).map((t) => t.toLowerCase().trim())
    );
    const currentCategory = (currentPost.category || '').toLowerCase().trim();

    const scored: ScoredPost[] = candidates.map((candidate) => {
      let score = 0;
      const matchReasons: string[] = [];

      // 1. Category match (+10 points)
      const candCategory = (candidate.category || '').toLowerCase().trim();
      if (currentCategory && candCategory === currentCategory) {
        score += 10;
        matchReasons.push(candidate.category);
      }

      // 2. Shared tags match (+4 points per matching tag)
      const candTags = candidate.tags || [];
      const sharedTags: string[] = [];
      candTags.forEach((tag) => {
        const normalized = tag.toLowerCase().trim();
        if (currentTags.has(normalized)) {
          score += 4;
          sharedTags.push(tag);
        }
      });

      if (sharedTags.length > 0) {
        matchReasons.push(`#${sharedTags[0]}`);
      }

      // 3. Fallback recency / title keyword overlap
      const currentWords = new Set(
        currentPost.title
          .toLowerCase()
          .split(/\s+/)
          .filter((w) => w.length > 4)
      );
      const candWords = candidate.title.toLowerCase().split(/\s+/);
      let wordMatches = 0;
      candWords.forEach((word) => {
        if (currentWords.has(word)) {
          wordMatches++;
          score += 1;
        }
      });

      return {
        post: candidate,
        score,
        matchReasons,
      };
    });

    // Sort descending by score, then by date
    scored.sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      return (
        new Date(b.post.publishDate).getTime() -
        new Date(a.post.publishDate).getTime()
      );
    });

    return scored.slice(0, 3);
  }, [currentPost, allPosts]);

  if (relatedPostsWithScores.length === 0) {
    return null;
  }

  return (
    <section className="mt-14 pt-10 border-t border-[#E8E0D3]">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#315B2B] uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curated Recommendations</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1c1c16]">
            Related Clinical Research & Guides
          </h2>
          <p className="text-xs sm:text-sm text-[#718C5C] mt-1">
            Selected based on relevance to{' '}
            <span className="font-semibold text-[#4A3525]">
              {currentPost.category}
            </span>
            {currentPost.tags && currentPost.tags.length > 0 && (
              <> and associated clinical topics</>
            )}
            .
          </p>
        </div>

        {onViewAll && (
          <button
            type="button"
            onClick={onViewAll}
            className="inline-flex items-center gap-1 text-xs font-bold text-[#315B2B] hover:text-[#24451F] hover:underline transition-colors shrink-0 cursor-pointer"
          >
            <span>All Veterinary Articles</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {relatedPostsWithScores.map(({ post, matchReasons }) => (
          <article
            key={post.id}
            onClick={() => {
              onSelectPost(post);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="group bg-white rounded-2xl border border-[#E8E0D3] overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col cursor-pointer hover:border-[#CEECB4]"
          >
            {/* Hero Card Image */}
            <div className="relative h-44 overflow-hidden bg-[#FAF6EC]">
              <img
                src={post.heroImage}
                alt={post.heroImageAlt || post.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Category Badge & Context Pill */}
              <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                <span className="px-2.5 py-1 bg-[#1c1c16]/80 backdrop-blur-xs text-[#CEECB4] text-[10px] font-bold uppercase tracking-wider rounded-md">
                  {post.category}
                </span>
                {matchReasons.length > 0 && (
                  <span className="px-2 py-1 bg-[#315B2B]/90 backdrop-blur-xs text-white text-[10px] font-medium rounded-md flex items-center gap-1">
                    <Tag className="w-2.5 h-2.5" />
                    <span>{matchReasons[0]}</span>
                  </span>
                )}
              </div>
            </div>

            {/* Content Body */}
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-serif text-base font-bold text-[#1c1c16] leading-snug group-hover:text-[#315B2B] transition-colors line-clamp-2 mb-2">
                  {post.title}
                </h3>
                {post.summary && (
                  <p className="text-xs text-[#5C4D3C] line-clamp-2 leading-relaxed mb-4">
                    {post.summary}
                  </p>
                )}
              </div>

              {/* Author & Footer Details */}
              <div className="pt-3 border-t border-[#E8E0D3]/80 flex items-center justify-between text-xs text-[#718C5C]">
                <div className="flex items-center gap-2">
                  {post.vetAvatar ? (
                    <img
                      src={post.vetAvatar}
                      alt={post.authorVet}
                      className="w-6 h-6 rounded-full object-cover border border-[#CEECB4]"
                    />
                  ) : (
                    <ShieldCheck className="w-4 h-4 text-[#315B2B]" />
                  )}
                  <span className="text-[11px] font-semibold text-[#4A3525] truncate max-w-[110px]">
                    {post.authorVet}
                  </span>
                </div>

                <div className="flex items-center gap-1 text-[11px]">
                  <Clock className="w-3 h-3 text-[#718C5C]" />
                  <span>{post.readTimeMinutes}m read</span>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};
