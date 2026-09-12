import React, { useState } from 'react';
import { EditorialArticle } from '../types';
import { 
  BookOpen, 
  Search, 
  Clock, 
  Calendar, 
  Award, 
  CheckCircle2, 
  ArrowRight, 
  Mail, 
  Check, 
  Sparkles,
  Share2
} from 'lucide-react';

interface BlogViewProps {
  articles: EditorialArticle[];
  onReadArticle: (article: EditorialArticle) => void;
}

export const BlogView: React.FC<BlogViewProps> = ({
  articles,
  onReadArticle,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [subscribed, setSubscribed] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');

  const categories = [
    { id: 'all', label: 'All Articles' },
    { id: 'Clinical Nutrition', label: 'Nutrition & Diet' },
    { id: 'Mobility & Orthopaedics', label: 'Joints & Mobility' },
    { id: 'Immunology & Dermatology', label: 'Gut & Skin' },
  ];

  const filteredArticles = articles.filter((art) => {
    const matchesSearch = 
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.authorVet.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'all' || art.category.toLowerCase().includes(selectedCategory.toLowerCase());
    return matchesSearch && matchesCat;
  });

  const featuredArticle = articles[0];

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setSubscribed(true);
    setNewsletterEmail('');
    setTimeout(() => setSubscribed(false), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-16">
      {/* Blog Hero Banner */}
      <div className="bg-[#FAF6EC] border border-[#E8E0D3] rounded-[32px] p-6 sm:p-10 relative overflow-hidden">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ceecb4]/50 text-[#24451F] text-[11px] font-bold">
            <BookOpen className="w-3.5 h-3.5 text-[#315B2B]" />
            Peer-Reviewed Canine Science
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1c1c16] tracking-tight">
            Canine Vitality Clinical Journal
          </h1>
          <p className="text-[15px] sm:text-[16px] text-[#4A3525]/85 leading-relaxed">
            Evidence-based veterinary insights, clinical trial breakdowns, and practical longevity protocols written by practicing DVMs and veterinary nutrition specialists.
          </p>
        </div>

        {/* Editorial Standards Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 mt-6 border-t border-[#E8E0D3]">
          <div className="flex items-center gap-2 text-[12px] font-semibold text-[#24451F]">
            <Award className="w-4 h-4 text-[#F4B51B]" />
            <span>Board-Certified DVM Authors</span>
          </div>
          <div className="flex items-center gap-2 text-[12px] font-semibold text-[#24451F]">
            <CheckCircle2 className="w-4 h-4 text-[#315B2B]" />
            <span>Class A Clinical Evidence</span>
          </div>
          <div className="flex items-center gap-2 text-[12px] font-semibold text-[#24451F]">
            <Sparkles className="w-4 h-4 text-[#718C5C]" />
            <span>Zero Commercial Sponsorships</span>
          </div>
        </div>
      </div>

      {/* Featured Lead Article */}
      {featuredArticle && selectedCategory === 'all' && !searchQuery && (
        <div 
          id="featured-article-card"
          className="bg-[#FFFFFF] border border-[#E8E0D3] rounded-[28px] overflow-hidden shadow-sm hover:border-[#315B2B]/50 transition-all group"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12">
            <div className="lg:col-span-7 relative h-72 lg:h-auto overflow-hidden">
              <img
                src={featuredArticle.heroImage}
                alt={featuredArticle.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 rounded-full bg-[#315B2B] text-white text-[11px] font-extrabold uppercase tracking-wider shadow-md">
                  Featured Clinical Analysis
                </span>
              </div>
            </div>

            <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-[12px] text-[#718C5C] font-semibold">
                  <span>{featuredArticle.category}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {featuredArticle.readTimeMinutes} min read
                  </span>
                  <span>•</span>
                  <span>{featuredArticle.publishDate}</span>
                </div>

                <h2 
                  onClick={() => onReadArticle(featuredArticle)}
                  className="font-serif text-2xl sm:text-3xl font-bold text-[#1c1c16] group-hover:text-[#315B2B] transition-colors cursor-pointer leading-snug"
                >
                  {featuredArticle.title}
                </h2>

                <p className="text-[14px] text-[#4A3525]/80 leading-relaxed line-clamp-3">
                  {featuredArticle.summary}
                </p>

                {/* Key Takeaways preview */}
                <div className="space-y-1.5 pt-2">
                  <span className="text-[11px] uppercase tracking-wider font-bold text-[#24451F]">
                    Key Takeaways:
                  </span>
                  <ul className="space-y-1 text-[12px] text-[#4A3525]">
                    {featuredArticle.keyTakeaways.slice(0, 2).map((takeaway, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#315B2B] mt-0.5 shrink-0" />
                        <span className="line-clamp-1">{takeaway}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Author and Action */}
              <div className="flex items-center justify-between pt-4 border-t border-[#E8E0D3]">
                <div className="flex items-center gap-3">
                  <img
                    src={featuredArticle.vetAvatar}
                    alt={featuredArticle.authorVet}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-full object-cover border border-[#E8E0D3]"
                  />
                  <div>
                    <h4 className="text-[13px] font-bold text-[#1c1c16] leading-none">
                      {featuredArticle.authorVet}
                    </h4>
                    <p className="text-[11px] text-[#718C5C] mt-0.5">
                      {featuredArticle.vetCredentials}
                    </p>
                  </div>
                </div>

                <button
                  id="read-featured-article-btn"
                  onClick={() => onReadArticle(featuredArticle)}
                  className="h-10 px-4 rounded-full bg-[#315B2B] hover:bg-[#24451F] text-white text-[12px] font-bold flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <span>Read Article</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filter and Search Section */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 border-b border-[#E8E0D3] pb-4">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              id={`blog-cat-${cat.id}`}
              onClick={() => setSelectedCategory(cat.id)}
              className={`h-9 px-4 rounded-full text-[13px] font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-[#315B2B] text-white shadow-sm'
                  : 'bg-white border border-[#E8E0D3] text-[#4A3525] hover:bg-[#FAF6EC]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-[#718C5C] absolute left-3.5 top-3" />
          <input
            type="text"
            id="blog-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search articles, topics..."
            className="w-full h-10 pl-10 pr-4 rounded-full border border-[#E8E0D3] bg-white text-[13px] text-[#4A3525] focus:outline-none focus:border-[#315B2B]"
          />
        </div>
      </div>

      {/* Articles Grid */}
      {filteredArticles.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E8E0D3] p-12 text-center text-[#4A3525]/60 space-y-2">
          <BookOpen className="w-12 h-12 mx-auto text-[#C2C9BC]" />
          <h3 className="font-serif text-xl font-bold text-[#1c1c16]">No matching articles found</h3>
          <p className="text-[13px]">Try clearing your search or switching to another category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article) => (
            <div
              key={article.id}
              id={`blog-card-${article.id}`}
              className="bg-[#FFFFFF] border border-[#E8E0D3] rounded-[24px] overflow-hidden shadow-sm hover:border-[#315B2B]/40 transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Article Image */}
                <div 
                  className="relative h-48 overflow-hidden cursor-pointer"
                  onClick={() => onReadArticle(article)}
                >
                  <img
                    src={article.heroImage}
                    alt={article.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#FAF6EC]/95 backdrop-blur-sm text-[#24451F] text-[11px] font-bold shadow-sm">
                      {article.category}
                    </span>
                  </div>
                </div>

                {/* Article Content */}
                <div className="p-5 space-y-2.5">
                  <div className="flex items-center gap-2 text-[11px] text-[#718C5C] font-semibold">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {article.readTimeMinutes} min
                    </span>
                    <span>•</span>
                    <span>{article.publishDate}</span>
                  </div>

                  <h3 
                    onClick={() => onReadArticle(article)}
                    className="font-serif text-lg font-bold text-[#1c1c16] group-hover:text-[#315B2B] transition-colors line-clamp-2 cursor-pointer"
                  >
                    {article.title}
                  </h3>

                  <p className="text-[13px] text-[#4A3525]/80 leading-relaxed line-clamp-3">
                    {article.summary}
                  </p>
                </div>
              </div>

              {/* Author Footer */}
              <div className="p-5 pt-0 border-t border-[#E8E0D3]/60 flex items-center justify-between mt-3">
                <div className="flex items-center gap-2.5">
                  <img
                    src={article.vetAvatar}
                    alt={article.authorVet}
                    referrerPolicy="no-referrer"
                    className="w-8 h-8 rounded-full object-cover border border-[#E8E0D3]"
                  />
                  <div>
                    <span className="text-[12px] font-bold text-[#1c1c16] block leading-none">
                      {article.authorVet}
                    </span>
                    <span className="text-[10px] text-[#718C5C] block mt-0.5">
                      {article.evidenceGrade || 'Peer-Reviewed'}
                    </span>
                  </div>
                </div>

                <button
                  id={`read-article-btn-${article.id}`}
                  onClick={() => onReadArticle(article)}
                  className="text-[12px] font-bold text-[#315B2B] hover:text-[#24451F] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                >
                  <span>Read</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Newsletter Signup Box */}
      <div className="bg-[#24451F] text-white rounded-[28px] p-8 sm:p-10 relative overflow-hidden shadow-md">
        <div className="max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#315B2B] text-[#F4B51B] text-[11px] font-bold">
            <Mail className="w-3.5 h-3.5" />
            Monthly Clinical Briefing
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#FAF6EC]">
            Receive Peer-Reviewed Canine Longevity Digests
          </h2>
          <p className="text-[14px] text-white/80 leading-relaxed">
            Delivered monthly: Veterinary pharmacology summaries, nutritional recalibrations, and clinical guidelines directly from our medical panel.
          </p>

          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 pt-2">
            <input
              type="email"
              required
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              placeholder="Enter your email address..."
              className="h-12 px-4 rounded-full bg-white text-[#1c1c16] text-[13px] placeholder:text-[#4A3525]/60 focus:outline-none focus:ring-2 focus:ring-[#F4B51B] flex-1"
            />
            <button
              type="submit"
              className="h-12 px-6 rounded-full bg-[#F4B51B] hover:bg-[#e0a413] text-[#24451F] font-bold text-[13px] transition-all flex items-center justify-center gap-2 shadow-md shrink-0"
            >
              {subscribed ? (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Subscribed!</span>
                </>
              ) : (
                <span>Subscribe Free</span>
              )}
            </button>
          </form>
          <p className="text-[11px] text-white/60">
            Strictly no marketing fluff. Unsubscribe anytime with one click.
          </p>
        </div>
      </div>
    </div>
  );
};
