import React, { useState, useEffect } from 'react';
import { EditorialArticle } from '../types';
import { extractHeadingsAndInjectIds } from '../utils/tocGenerator';
import { TableOfContents } from './TableOfContents';
import { apiService } from '../services/apiService';
import {
  Plus,
  Edit3,
  Trash2,
  Eye,
  CheckCircle,
  Save,
  Globe,
  Tag,
  Image as ImageIcon,
  Link as LinkIcon,
  Search,
  ArrowLeft,
  LogOut,
  Sparkles,
  Heading2,
  Heading3,
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Check,
  AlertTriangle,
  FileText,
  Clock,
  Layers,
  Code,
  ExternalLink,
} from 'lucide-react';

interface AdminDashboardProps {
  token: string;
  adminUser: { username: string; role: string };
  posts: EditorialArticle[];
  onRefreshPosts: () => void;
  onLogout: () => void;
  onExitToSite: () => void;
  onPreviewPost: (post: EditorialArticle) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  token,
  adminUser,
  posts,
  onRefreshPosts,
  onLogout,
  onExitToSite,
  onPreviewPost,
}) => {
  const [activeView, setActiveView] = useState<'list' | 'editor'>('list');
  const [editingPost, setEditingPost] = useState<EditorialArticle | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Link Insertion Modal State
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [linkText, setLinkText] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [linkRel, setLinkRel] = useState<'dofollow' | 'nofollow'>('dofollow');
  const [linkTargetBlank, setLinkTargetBlank] = useState(true);

  // Editor Form State
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: 'Canine Nutrition',
    tags: '' as string,
    readTimeMinutes: 5,
    authorVet: 'Dr. Emily Vance',
    vetCredentials: 'DVM, DACVN (Board Certified Veterinary Nutritionist)',
    vetAvatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=200&q=80',
    publishDate: '',
    summary: '',
    heroImage: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=800&q=80',
    heroImageAlt: '',
    contentHtml: '',
    status: 'published' as 'published' | 'draft',
    evidenceGrade: 'Class A Clinical Trial',
    seoTitle: '',
    metaDescription: '',
    focusKeyword: '',
  });

  const [editorMode, setEditorMode] = useState<'visual' | 'code' | 'preview'>('visual');

  const showNotification = (text: string, type: 'success' | 'error' = 'success') => {
    setNotification({ text, type });
    setTimeout(() => setNotification(null), 3500);
  };

  const handleStartCreate = () => {
    setEditingPost(null);
    setFormData({
      title: '',
      slug: '',
      category: 'Canine Nutrition',
      tags: 'Cardiology, Fiber, Clinical Trial',
      readTimeMinutes: 5,
      authorVet: 'Dr. Emily Vance',
      vetCredentials: 'DVM, DACVN (Board Certified Veterinary Nutritionist)',
      vetAvatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=200&q=80',
      publishDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      summary: '',
      heroImage: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=800&q=80',
      heroImageAlt: '',
      contentHtml: `<h2>Clinical Background & Etiology</h2>
<p>Detailed evidence-based findings on canine clinical physiology and metabolic pathways.</p>

<h3>Diagnostic Criteria & Laboratory Analysis</h3>
<p>Assess biomarkers and therapeutic baselines before starting intervention protocols.</p>

<h2>Evidence-Based Recommendations</h2>
<p>Actionable guidance backed by published veterinary literature.</p>`,
      status: 'published',
      evidenceGrade: 'Class A Clinical Trial',
      seoTitle: '',
      metaDescription: '',
      focusKeyword: '',
    });
    setActiveView('editor');
  };

  const handleStartEdit = (post: EditorialArticle) => {
    setEditingPost(post);
    let html = post.contentHtml || '';
    if (!html && post.sections) {
      html = post.sections.map((s) => `<h2>${s.heading}</h2>\n${s.paragraphs.map((p) => `<p>${p}</p>`).join('\n')}`).join('\n\n');
    }

    setFormData({
      title: post.title,
      slug: post.slug || '',
      category: post.category,
      tags: (post.tags || []).join(', '),
      readTimeMinutes: post.readTimeMinutes,
      authorVet: post.authorVet,
      vetCredentials: post.vetCredentials,
      vetAvatar: post.vetAvatar,
      publishDate: post.publishDate,
      summary: post.summary,
      heroImage: post.heroImage,
      heroImageAlt: post.heroImageAlt || '',
      contentHtml: html,
      status: post.status || 'published',
      evidenceGrade: post.evidenceGrade || 'Class A Clinical Trial',
      seoTitle: post.seo?.seoTitle || post.title,
      metaDescription: post.seo?.metaDescription || post.summary || '',
      focusKeyword: post.seo?.focusKeyword || '',
    });
    setActiveView('editor');
  };

  const handleAutoSlug = () => {
    const slugified = formData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    setFormData((prev) => ({ ...prev, slug: slugified }));
  };

  // Insert HTML snippet into editor content
  const insertContentSnippet = (snippet: string) => {
    setFormData((prev) => ({
      ...prev,
      contentHtml: prev.contentHtml + '\n' + snippet,
    }));
  };

  // Open Link Modal with any selected text
  const handleOpenLinkModal = () => {
    setLinkText('');
    setLinkUrl('');
    setLinkRel('dofollow');
    setLinkTargetBlank(true);
    setIsLinkModalOpen(true);
  };

  // Insert Link with DoFollow or NoFollow
  const handleInsertLink = () => {
    if (!linkUrl.trim()) return;
    const text = linkText.trim() || linkUrl.trim();
    const relAttr = linkRel === 'nofollow' ? 'rel="nofollow noopener noreferrer"' : 'rel="noopener"';
    const targetAttr = linkTargetBlank ? 'target="_blank"' : '';
    const classAttr = linkUrl.startsWith('#') ? 'class="internal-link font-bold text-[#315B2B] underline"' : 'class="external-link font-bold text-[#315B2B] underline"';

    const linkHtml = `<a href="${linkUrl.trim()}" ${relAttr} ${targetAttr} ${classAttr}>${text}</a>`;
    insertContentSnippet(linkHtml);
    setIsLinkModalOpen(false);
  };

  // Save Post (POST or PUT to server)
  const handleSavePost = async (statusOverride?: 'published' | 'draft') => {
    if (!formData.title.trim()) {
      showNotification('Post title is required', 'error');
      return;
    }

    setIsSaving(true);
    const finalStatus = statusOverride || formData.status;
    const finalSlug = formData.slug.trim() || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const tagsArray = formData.tags.split(',').map((t) => t.trim()).filter(Boolean);

    const postPayload = {
      title: formData.title.trim(),
      slug: finalSlug,
      category: formData.category,
      tags: tagsArray,
      readTimeMinutes: Number(formData.readTimeMinutes) || 5,
      authorVet: formData.authorVet,
      vetCredentials: formData.vetCredentials,
      vetAvatar: formData.vetAvatar,
      publishDate: formData.publishDate || new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      summary: formData.summary,
      heroImage: formData.heroImage,
      heroImageAlt: formData.heroImageAlt || formData.title,
      contentHtml: formData.contentHtml,
      status: finalStatus,
      evidenceGrade: formData.evidenceGrade,
      seo: {
        seoTitle: formData.seoTitle || formData.title,
        metaDescription: formData.metaDescription || formData.summary,
        focusKeyword: formData.focusKeyword,
        canonicalUrl: `/blog/${finalSlug}`,
      },
    };

    try {
      const result = await apiService.saveArticle(postPayload, token, editingPost?.id);

      if (!result.success || !result.post) {
        throw new Error(result.error || 'Failed to save article.');
      }

      showNotification(`Article successfully ${finalStatus === 'published' ? 'published' : 'saved as draft'}!`, 'success');
      onRefreshPosts();
      setActiveView('list');
      setEditingPost(null);
    } catch (err: any) {
      showNotification(err.message || 'Error saving article', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeletePost = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) {
      return;
    }

    try {
      const result = await apiService.deleteArticle(id, token);

      if (!result.success) {
        throw new Error(result.error || 'Failed to delete article');
      }

      showNotification('Article deleted successfully', 'success');
      onRefreshPosts();
    } catch (err: any) {
      showNotification(err.message || 'Error deleting article', 'error');
    }
  };

  // Filtered posts for list
  const filteredPosts = posts.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.tags && p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));

    if (statusFilter === 'all') return matchesSearch;
    return matchesSearch && (p.status || 'published') === statusFilter;
  });

  // Calculate TOC items for live preview
  const { processedHtml: previewHtml, headings: liveHeadings } = extractHeadingsAndInjectIds(formData.contentHtml);

  // SEO Score Analyzer
  const keyword = formData.focusKeyword.toLowerCase().trim();
  const hasKeywordInTitle = keyword ? formData.title.toLowerCase().includes(keyword) : false;
  const hasKeywordInMeta = keyword ? formData.metaDescription.toLowerCase().includes(keyword) : false;
  const hasKeywordInContent = keyword ? formData.contentHtml.toLowerCase().includes(keyword) : false;
  const hasHeadings = liveHeadings.length > 0;
  const hasImageAlt = Boolean(formData.heroImageAlt.trim());
  const hasDofollowOrNofollow = formData.contentHtml.includes('rel=');

  return (
    <div className="min-h-screen bg-[#F8F6F0] text-[#1c1c16] pb-16">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 text-sm font-semibold transition-all ${
            notification.type === 'success'
              ? 'bg-[#24451F] text-white border border-[#CEECB4]'
              : 'bg-rose-600 text-white'
          }`}
        >
          {notification.type === 'success' ? <Check className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
          <span>{notification.text}</span>
        </div>
      )}

      {/* Admin Top Navbar */}
      <header className="bg-[#24451F] text-white border-b border-[#315B2B] sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#315B2B] rounded-lg">
              <FileText className="w-5 h-5 text-[#CEECB4]" />
            </div>
            <div>
              <h1 className="font-serif text-lg font-bold tracking-tight">
                Veterinary Editorial CMS
              </h1>
              <div className="flex items-center gap-2 text-[11px] text-[#CEECB4]">
                <span>Admin: <strong className="text-white">@{adminUser.username}</strong></span>
                <span>•</span>
                <span>Role: {adminUser.role}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onExitToSite}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white/90 hover:text-white bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>View Public Hub</span>
            </button>

            <button
              type="button"
              onClick={onLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-200 hover:text-white bg-rose-900/40 hover:bg-rose-800/60 rounded-lg transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Dashboard Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {activeView === 'list' ? (
          /* ================= POSTS LIST OVERVIEW ================= */
          <div>
            {/* Header / Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="font-serif text-2xl font-bold text-[#1c1c16]">
                  Blog Articles & Clinical Studies
                </h2>
                <p className="text-xs text-[#718C5C] mt-1">
                  Manage SEO metadata, table of contents, backlinks, and publication states.
                </p>
              </div>

              <button
                type="button"
                onClick={handleStartCreate}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#24451F] hover:bg-[#315B2B] text-white text-xs font-bold rounded-xl shadow-sm transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Article</span>
              </button>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div className="bg-white p-4 rounded-xl border border-[#E8E0D3] shadow-2xs">
                <span className="text-xs text-[#718C5C] font-medium">Total Articles</span>
                <p className="text-2xl font-bold text-[#1c1c16] mt-1">{posts.length}</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-[#E8E0D3] shadow-2xs">
                <span className="text-xs text-[#718C5C] font-medium">Published Live</span>
                <p className="text-2xl font-bold text-[#315B2B] mt-1">
                  {posts.filter((p) => p.status !== 'draft').length}
                </p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-[#E8E0D3] shadow-2xs">
                <span className="text-xs text-[#718C5C] font-medium">Drafts</span>
                <p className="text-2xl font-bold text-amber-600 mt-1">
                  {posts.filter((p) => p.status === 'draft').length}
                </p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-[#E8E0D3] shadow-2xs">
                <span className="text-xs text-[#718C5C] font-medium">Peer-Reviewed Vets</span>
                <p className="text-2xl font-bold text-[#4A3525] mt-1">5 Specialists</p>
              </div>
            </div>

            {/* Filter and Search */}
            <div className="bg-white p-4 rounded-2xl border border-[#E8E0D3] shadow-2xs mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-[#718C5C] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search articles by title or tag..."
                  className="w-full pl-9 pr-3 py-2 bg-[#FAF6EC] border border-[#E8E0D3] rounded-xl text-xs focus:ring-2 focus:ring-[#315B2B] focus:outline-hidden"
                />
              </div>

              <div className="flex items-center gap-2 self-start md:self-auto text-xs">
                <span className="text-[#718C5C] font-medium">Status:</span>
                {(['all', 'published', 'draft'] as const).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-lg font-semibold capitalize transition-colors ${
                      statusFilter === st
                        ? 'bg-[#24451F] text-white'
                        : 'bg-[#FAF6EC] text-[#5C4D3C] hover:bg-[#CEECB4]/30'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Posts Table */}
            <div className="bg-white rounded-2xl border border-[#E8E0D3] shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF6EC] text-[#4A3525] uppercase tracking-wider font-bold border-b border-[#E8E0D3]">
                    <tr>
                      <th className="py-3.5 px-4">Article Title & Details</th>
                      <th className="py-3.5 px-4">Category</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4">Author Vet</th>
                      <th className="py-3.5 px-4">URL Slug</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8E0D3]">
                    {filteredPosts.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-10 text-gray-500">
                          No articles found matching criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredPosts.map((post) => (
                        <tr key={post.id} className="hover:bg-[#FAF6EC]/50 transition-colors">
                          <td className="py-3.5 px-4 max-w-sm">
                            <div className="font-serif font-bold text-sm text-[#1c1c16] line-clamp-1">
                              {post.title}
                            </div>
                            <div className="text-[11px] text-[#718C5C] flex items-center gap-2 mt-0.5">
                              <span>{post.publishDate}</span>
                              <span>•</span>
                              <span>{post.readTimeMinutes} min read</span>
                              {post.seo?.focusKeyword && (
                                <>
                                  <span>•</span>
                                  <span className="text-[#315B2B] font-medium">KW: {post.seo.focusKeyword}</span>
                                </>
                              )}
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#FAF6EC] text-[#315B2B] border border-[#CEECB4]">
                              {post.category}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            {post.status === 'draft' ? (
                              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                                Draft
                              </span>
                            ) : (
                              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                                Published
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2">
                              <img
                                src={post.vetAvatar}
                                alt={post.authorVet}
                                className="w-6 h-6 rounded-full object-cover"
                              />
                              <span className="font-medium text-[#4A3525]">{post.authorVet}</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 font-mono text-[11px] text-[#718C5C] truncate max-w-[150px]">
                            /{post.slug}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => onPreviewPost(post)}
                                className="p-1.5 text-[#315B2B] hover:bg-[#CEECB4]/30 rounded-md transition-colors"
                                title="View Article Detail Page"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleStartEdit(post)}
                                className="p-1.5 text-[#4A3525] hover:bg-[#FAF6EC] rounded-md transition-colors"
                                title="Edit Article & SEO"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeletePost(post.id, post.title)}
                                className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                                title="Delete Article"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          /* ================= BLOG POST EDITOR VIEW ================= */
          <div className="space-y-6">
            {/* Top Back & Save Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#E8E0D3] shadow-xs">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setActiveView('list')}
                  className="p-2 text-[#4A3525] hover:bg-[#FAF6EC] rounded-lg transition-colors"
                  title="Back to articles list"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <h2 className="font-serif text-lg font-bold text-[#1c1c16]">
                    {editingPost ? 'Edit Blog Article' : 'Draft New Clinical Article'}
                  </h2>
                  <p className="text-[11px] text-[#718C5C]">
                    Semantic HTML headings (H2, H3) automatically build the Table of Contents.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={isSaving}
                  onClick={() => handleSavePost('draft')}
                  className="px-3 py-2 bg-[#FAF6EC] hover:bg-[#E8E0D3] text-[#4A3525] text-xs font-bold rounded-xl border border-[#E8E0D3] transition-colors"
                >
                  Save as Draft
                </button>

                <button
                  type="button"
                  disabled={isSaving}
                  onClick={() => handleSavePost('published')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#24451F] hover:bg-[#315B2B] text-white text-xs font-bold rounded-xl shadow-sm transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? 'Publishing...' : 'Publish Article'}</span>
                </button>
              </div>
            </div>

            {/* Two Column Layout: Main Editor + Right Sidebar */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left 2 Cols: Main Content & Rich Editor */}
              <div className="lg:col-span-2 space-y-6">
                {/* Title & Slug */}
                <div className="bg-white p-6 rounded-2xl border border-[#E8E0D3] shadow-xs space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-[#4A3525] uppercase tracking-wider mb-1.5">
                      Blog Title (H1) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g. Dietary Management of Canine Osteoarthritis and Synovial Inflammation"
                      className="w-full px-3.5 py-2.5 bg-[#FAF6EC]/50 border border-[#E8E0D3] rounded-xl font-serif text-lg font-bold text-[#1c1c16] focus:ring-2 focus:ring-[#315B2B] focus:outline-hidden"
                    />
                  </div>

                  {/* Slug / Custom URL */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold text-[#4A3525] uppercase tracking-wider">
                        Custom URL / Permalink Slug
                      </label>
                      <button
                        type="button"
                        onClick={handleAutoSlug}
                        className="text-[11px] font-semibold text-[#315B2B] hover:underline"
                      >
                        Generate from Title
                      </button>
                    </div>
                    <div className="flex items-center">
                      <span className="px-3 py-2 bg-[#FAF6EC] border border-r-0 border-[#E8E0D3] rounded-l-xl text-xs text-[#718C5C] font-mono">
                        /blog/
                      </span>
                      <input
                        type="text"
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        placeholder="dietary-management-canine-osteoarthritis"
                        className="w-full px-3 py-2 bg-white border border-[#E8E0D3] rounded-r-xl text-xs font-mono text-[#1c1c16] focus:ring-2 focus:ring-[#315B2B] focus:outline-hidden"
                      />
                    </div>
                  </div>

                  {/* Clinical Excerpt / Summary */}
                  <div>
                    <label className="block text-xs font-bold text-[#4A3525] uppercase tracking-wider mb-1.5">
                      Clinical Excerpt / Subtitle
                    </label>
                    <textarea
                      rows={2}
                      value={formData.summary}
                      onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                      placeholder="Brief 1-2 sentence executive takeaway for article cards and summary callouts..."
                      className="w-full px-3 py-2 bg-[#FAF6EC]/50 border border-[#E8E0D3] rounded-xl text-xs text-[#1c1c16] focus:ring-2 focus:ring-[#315B2B] focus:outline-hidden"
                    />
                  </div>
                </div>

                {/* Rich Content Editor & Toolbar */}
                <div className="bg-white rounded-2xl border border-[#E8E0D3] shadow-xs overflow-hidden">
                  {/* Mode Tabs */}
                  <div className="bg-[#FAF6EC] px-4 py-2.5 border-b border-[#E8E0D3] flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setEditorMode('visual')}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                          editorMode === 'visual'
                            ? 'bg-[#24451F] text-white'
                            : 'text-[#5C4D3C] hover:bg-[#E8E0D3]'
                        }`}
                      >
                        Visual Editor
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditorMode('code')}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                          editorMode === 'code'
                            ? 'bg-[#24451F] text-white'
                            : 'text-[#5C4D3C] hover:bg-[#E8E0D3]'
                        }`}
                      >
                        HTML Source
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditorMode('preview')}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                          editorMode === 'preview'
                            ? 'bg-[#24451F] text-white'
                            : 'text-[#5C4D3C] hover:bg-[#E8E0D3]'
                        }`}
                      >
                        Live Reader Preview
                      </button>
                    </div>

                    <div className="text-[11px] text-[#718C5C] font-medium flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#315B2B]" />
                      <span>{liveHeadings.length} TOC Headings Detected</span>
                    </div>
                  </div>

                  {/* Formatting Toolbar */}
                  {editorMode !== 'preview' && (
                    <div className="p-2.5 bg-[#FAF6EC]/40 border-b border-[#E8E0D3] flex flex-wrap items-center gap-1.5 text-xs">
                      {/* Heading 2 */}
                      <button
                        type="button"
                        onClick={() => insertContentSnippet('<h2>New Section Heading</h2>\n<p>Enter clinical analysis here...</p>')}
                        className="px-2 py-1 bg-white border border-[#E8E0D3] hover:bg-[#CEECB4]/30 text-[#24451F] font-bold rounded flex items-center gap-1"
                        title="Insert H2 Heading (Creates major TOC entry)"
                      >
                        <Heading2 className="w-3.5 h-3.5" />
                        <span>H2 Heading</span>
                      </button>

                      {/* Heading 3 */}
                      <button
                        type="button"
                        onClick={() => insertContentSnippet('<h3>Sub-Topic Analysis</h3>\n<p>Sub-point details here...</p>')}
                        className="px-2 py-1 bg-white border border-[#E8E0D3] hover:bg-[#CEECB4]/30 text-[#24451F] font-bold rounded flex items-center gap-1"
                        title="Insert H3 Heading (Creates nested TOC entry)"
                      >
                        <Heading3 className="w-3.5 h-3.5" />
                        <span>H3 Subhead</span>
                      </button>

                      <div className="h-4 w-px bg-[#E8E0D3] mx-1" />

                      {/* Paragraph */}
                      <button
                        type="button"
                        onClick={() => insertContentSnippet('<p>New paragraph of evidence-based text...</p>')}
                        className="px-2 py-1 bg-white border border-[#E8E0D3] hover:bg-[#CEECB4]/30 text-[#4A3525] font-medium rounded"
                      >
                        Paragraph
                      </button>

                      {/* Bold */}
                      <button
                        type="button"
                        onClick={() => insertContentSnippet('<strong>Important clinical term</strong>')}
                        className="p-1.5 bg-white border border-[#E8E0D3] hover:bg-[#CEECB4]/30 text-[#4A3525] rounded"
                        title="Bold text"
                      >
                        <Bold className="w-3.5 h-3.5" />
                      </button>

                      {/* Italic */}
                      <button
                        type="button"
                        onClick={() => insertContentSnippet('<em>italicized phrase</em>')}
                        className="p-1.5 bg-white border border-[#E8E0D3] hover:bg-[#CEECB4]/30 text-[#4A3525] rounded"
                        title="Italic text"
                      >
                        <Italic className="w-3.5 h-3.5" />
                      </button>

                      {/* Bullet List */}
                      <button
                        type="button"
                        onClick={() => insertContentSnippet('<ul>\n  <li>Clinical finding 1</li>\n  <li>Clinical finding 2</li>\n</ul>')}
                        className="p-1.5 bg-white border border-[#E8E0D3] hover:bg-[#CEECB4]/30 text-[#4A3525] rounded"
                        title="Bullet List"
                      >
                        <List className="w-3.5 h-3.5" />
                      </button>

                      {/* Numbered List */}
                      <button
                        type="button"
                        onClick={() => insertContentSnippet('<ol>\n  <li>Protocol step 1</li>\n  <li>Protocol step 2</li>\n</ol>')}
                        className="p-1.5 bg-white border border-[#E8E0D3] hover:bg-[#CEECB4]/30 text-[#4A3525] rounded"
                        title="Numbered List"
                      >
                        <ListOrdered className="w-3.5 h-3.5" />
                      </button>

                      {/* Blockquote */}
                      <button
                        type="button"
                        onClick={() => insertContentSnippet('<blockquote>Peer-reviewed veterinary consensus quote here.</blockquote>')}
                        className="p-1.5 bg-white border border-[#E8E0D3] hover:bg-[#CEECB4]/30 text-[#4A3525] rounded"
                        title="Blockquote"
                      >
                        <Quote className="w-3.5 h-3.5" />
                      </button>

                      <div className="h-4 w-px bg-[#E8E0D3] mx-1" />

                      {/* LINK INSERTION BUTTON (DoFollow / NoFollow) */}
                      <button
                        type="button"
                        onClick={handleOpenLinkModal}
                        className="px-2.5 py-1 bg-[#315B2B] text-white hover:bg-[#24451F] font-bold rounded flex items-center gap-1.5 transition-colors shadow-2xs"
                        title="Insert internal/external link with DoFollow or NoFollow"
                      >
                        <LinkIcon className="w-3.5 h-3.5" />
                        <span>Insert Link (DoFollow / NoFollow)</span>
                      </button>
                    </div>
                  )}

                  {/* Textarea or Preview View */}
                  {editorMode === 'preview' ? (
                    <div className="p-6 max-w-none bg-[#FDFBF7]">
                      <TableOfContents headings={liveHeadings} />
                      <div
                        className="prose prose-sm max-w-none text-[#332A20]
                          [&>h2]:font-serif [&>h2]:text-xl [&>h2]:font-bold [&>h2]:text-[#1c1c16] [&>h2]:mt-6 [&>h2]:mb-2
                          [&>h3]:font-serif [&>h3]:text-lg [&>h3]:font-bold [&>h3]:text-[#24451F] [&>h3]:mt-4 [&>h3]:mb-2
                          [&>p]:mb-3 [&>p]:leading-relaxed
                          [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:mb-4
                          [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:mb-4
                          [&>blockquote]:border-l-3 [&>blockquote]:border-[#315B2B] [&>blockquote]:pl-3 [&>blockquote]:italic [&>blockquote]:text-[#5C4D3C]
                          [&>a]:text-[#315B2B] [&>a]:underline [&>a]:font-semibold
                        "
                        dangerouslySetInnerHTML={{ __html: previewHtml }}
                      />
                    </div>
                  ) : (
                    <div className="p-4">
                      <textarea
                        rows={16}
                        value={formData.contentHtml}
                        onChange={(e) => setFormData({ ...formData, contentHtml: e.target.value })}
                        placeholder="Write or paste your rich-text HTML article here. Use <h2> and <h3> for Table of Contents sections..."
                        className="w-full p-4 bg-white border border-[#E8E0D3] rounded-xl font-mono text-xs text-[#1c1c16] leading-relaxed focus:ring-2 focus:ring-[#315B2B] focus:outline-hidden"
                      />
                    </div>
                  )}
                </div>

                {/* Real-time Table of Contents Preview */}
                <div className="bg-white p-5 rounded-2xl border border-[#E8E0D3] shadow-xs">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-serif text-sm font-bold text-[#1c1c16] flex items-center gap-2">
                      <Layers className="w-4 h-4 text-[#315B2B]" />
                      Auto-Generated Table of Contents Preview
                    </h3>
                    <span className="text-[11px] text-[#718C5C]">
                      Updates instantly as you add H2 and H3 tags
                    </span>
                  </div>

                  {liveHeadings.length === 0 ? (
                    <p className="text-xs text-amber-700 bg-amber-50 p-3 rounded-xl border border-amber-200">
                      No H2 or H3 tags found in content yet. Use the <strong>H2 Heading</strong> or <strong>H3 Subhead</strong> buttons above to create interactive jump targets.
                    </p>
                  ) : (
                    <ul className="space-y-1.5 text-xs text-[#4A3525]">
                      {liveHeadings.map((h, i) => (
                        <li key={i} className={`flex items-center gap-1.5 ${h.level === 3 ? 'ml-5 text-[#718C5C]' : 'font-medium'}`}>
                          <span className="text-[10px] text-[#315B2B] font-bold">
                            {h.level === 2 ? 'H2:' : 'H3:'}
                          </span>
                          <span>{h.title}</span>
                          <span className="text-[10px] text-gray-400 font-mono">#{h.id}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              {/* Right Sidebar: Post Configuration & SEO Suite */}
              <div className="space-y-6">
                {/* Publishing State & Category */}
                <div className="bg-white p-5 rounded-2xl border border-[#E8E0D3] shadow-xs space-y-4">
                  <h3 className="font-serif text-sm font-bold text-[#1c1c16] border-b border-[#E8E0D3] pb-2">
                    Publishing Settings
                  </h3>

                  <div>
                    <label className="block text-xs font-bold text-[#4A3525] uppercase tracking-wider mb-1.5">
                      Status
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, status: 'published' })}
                        className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                          formData.status === 'published'
                            ? 'bg-[#24451F] text-white border-[#24451F]'
                            : 'bg-[#FAF6EC] text-[#4A3525] border-[#E8E0D3]'
                        }`}
                      >
                        Published
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, status: 'draft' })}
                        className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                          formData.status === 'draft'
                            ? 'bg-amber-600 text-white border-amber-600'
                            : 'bg-[#FAF6EC] text-[#4A3525] border-[#E8E0D3]'
                        }`}
                      >
                        Draft
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#4A3525] uppercase tracking-wider mb-1.5">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 bg-[#FAF6EC] border border-[#E8E0D3] rounded-xl text-xs text-[#1c1c16] focus:ring-2 focus:ring-[#315B2B] focus:outline-hidden"
                    >
                      <option value="Canine Nutrition">Canine Nutrition</option>
                      <option value="Mobility & Orthopaedics">Mobility & Orthopaedics</option>
                      <option value="Immunology & Dermatology">Immunology & Dermatology</option>
                      <option value="Longevity & Geriatrics">Longevity & Geriatrics</option>
                      <option value="Preventive & Nephrology">Preventive & Nephrology</option>
                      <option value="Veterinary Toxicology">Veterinary Toxicology</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#4A3525] uppercase tracking-wider mb-1.5">
                      Tags (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                      placeholder="e.g. Fiber, Taurine, Cardiology"
                      className="w-full px-3 py-2 bg-[#FAF6EC] border border-[#E8E0D3] rounded-xl text-xs text-[#1c1c16] focus:ring-2 focus:ring-[#315B2B] focus:outline-hidden"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-bold text-[#4A3525] uppercase tracking-wider mb-1">
                        Read Time (min)
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={60}
                        value={formData.readTimeMinutes}
                        onChange={(e) => setFormData({ ...formData, readTimeMinutes: Number(e.target.value) })}
                        className="w-full px-3 py-2 bg-[#FAF6EC] border border-[#E8E0D3] rounded-xl text-xs text-[#1c1c16]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[#4A3525] uppercase tracking-wider mb-1">
                        Evidence Grade
                      </label>
                      <input
                        type="text"
                        value={formData.evidenceGrade}
                        onChange={(e) => setFormData({ ...formData, evidenceGrade: e.target.value })}
                        className="w-full px-3 py-2 bg-[#FAF6EC] border border-[#E8E0D3] rounded-xl text-xs text-[#1c1c16]"
                      />
                    </div>
                  </div>
                </div>

                {/* Featured Image & Alt Text */}
                <div className="bg-white p-5 rounded-2xl border border-[#E8E0D3] shadow-xs space-y-4">
                  <h3 className="font-serif text-sm font-bold text-[#1c1c16] border-b border-[#E8E0D3] pb-2 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-[#315B2B]" />
                    Featured Image & SEO Alt Text
                  </h3>

                  <div>
                    <label className="block text-xs font-bold text-[#4A3525] uppercase tracking-wider mb-1.5">
                      Image URL
                    </label>
                    <input
                      type="url"
                      value={formData.heroImage}
                      onChange={(e) => setFormData({ ...formData, heroImage: e.target.value })}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-3 py-2 bg-[#FAF6EC] border border-[#E8E0D3] rounded-xl text-xs text-[#1c1c16] focus:ring-2 focus:ring-[#315B2B] focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#4A3525] uppercase tracking-wider mb-1.5">
                      Image Alt Text (SEO & Accessibility) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.heroImageAlt}
                      onChange={(e) => setFormData({ ...formData, heroImageAlt: e.target.value })}
                      placeholder="Descriptive alt text for Google Image SEO and screen readers"
                      className="w-full px-3 py-2 bg-[#FAF6EC] border border-[#E8E0D3] rounded-xl text-xs text-[#1c1c16] focus:ring-2 focus:ring-[#315B2B] focus:outline-hidden"
                    />
                  </div>

                  {formData.heroImage && (
                    <div className="rounded-xl overflow-hidden border border-[#E8E0D3] h-28 bg-[#FAF6EC]">
                      <img
                        src={formData.heroImage}
                        alt={formData.heroImageAlt || 'Preview'}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>

                {/* SEO Optimization Suite */}
                <div className="bg-white p-5 rounded-2xl border border-[#E8E0D3] shadow-xs space-y-4">
                  <h3 className="font-serif text-sm font-bold text-[#1c1c16] border-b border-[#E8E0D3] pb-2 flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-[#315B2B]" />
                      Search Engine Optimization (SEO)
                    </span>
                  </h3>

                  {/* Focus Keyword */}
                  <div>
                    <label className="block text-xs font-bold text-[#4A3525] uppercase tracking-wider mb-1.5">
                      Focus Keyword
                    </label>
                    <input
                      type="text"
                      value={formData.focusKeyword}
                      onChange={(e) => setFormData({ ...formData, focusKeyword: e.target.value })}
                      placeholder="e.g. canine nutrition ancient grains"
                      className="w-full px-3 py-2 bg-[#FAF6EC] border border-[#E8E0D3] rounded-xl text-xs text-[#1c1c16] focus:ring-2 focus:ring-[#315B2B] focus:outline-hidden"
                    />
                  </div>

                  {/* SEO Title */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold text-[#4A3525] uppercase tracking-wider">
                        SEO Title Tag
                      </label>
                      <span className={`text-[10px] font-bold ${formData.seoTitle.length > 60 ? 'text-amber-600' : 'text-[#718C5C]'}`}>
                        {formData.seoTitle.length}/60 chars
                      </span>
                    </div>
                    <input
                      type="text"
                      value={formData.seoTitle}
                      onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                      placeholder="Title tag displayed on Google Search SERP"
                      className="w-full px-3 py-2 bg-[#FAF6EC] border border-[#E8E0D3] rounded-xl text-xs text-[#1c1c16] focus:ring-2 focus:ring-[#315B2B] focus:outline-hidden"
                    />
                  </div>

                  {/* Meta Description */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold text-[#4A3525] uppercase tracking-wider">
                        Meta Description
                      </label>
                      <span className={`text-[10px] font-bold ${formData.metaDescription.length > 160 ? 'text-amber-600' : 'text-[#718C5C]'}`}>
                        {formData.metaDescription.length}/160 chars
                      </span>
                    </div>
                    <textarea
                      rows={3}
                      value={formData.metaDescription}
                      onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                      placeholder="Meta snippet appearing under search results..."
                      className="w-full px-3 py-2 bg-[#FAF6EC] border border-[#E8E0D3] rounded-xl text-xs text-[#1c1c16] focus:ring-2 focus:ring-[#315B2B] focus:outline-hidden"
                    />
                  </div>

                  {/* Live Google Search Result Snippet Preview */}
                  <div className="p-3 bg-[#FAF6EC] border border-[#E8E0D3] rounded-xl space-y-1">
                    <span className="text-[10px] font-bold text-[#718C5C] uppercase tracking-wider">
                      Google Search Result Preview
                    </span>
                    <p className="text-[11px] text-[#202124] font-mono truncate">
                      https://canine-health.app/blog/{formData.slug || 'url-slug'}
                    </p>
                    <p className="text-sm font-medium text-[#1a0dab] hover:underline cursor-pointer line-clamp-1 leading-tight">
                      {formData.seoTitle || formData.title || 'Article Title'}
                    </p>
                    <p className="text-[11px] text-[#4d5156] line-clamp-2 leading-snug">
                      {formData.metaDescription || formData.summary || 'Article summary snippet shown to searchers on Google...'}
                    </p>
                  </div>

                  {/* SEO Real-Time Checklist */}
                  <div className="space-y-2 pt-2 border-t border-[#E8E0D3]">
                    <span className="text-xs font-bold text-[#4A3525]">SEO Optimization Checklist</span>
                    <ul className="text-xs space-y-1.5">
                      <li className="flex items-center gap-2">
                        {hasKeywordInTitle ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />}
                        <span className={hasKeywordInTitle ? 'text-emerald-800' : 'text-gray-600'}>
                          Focus keyword in SEO Title
                        </span>
                      </li>
                      <li className="flex items-center gap-2">
                        {hasKeywordInMeta ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />}
                        <span className={hasKeywordInMeta ? 'text-emerald-800' : 'text-gray-600'}>
                          Focus keyword in Meta Description
                        </span>
                      </li>
                      <li className="flex items-center gap-2">
                        {hasHeadings ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />}
                        <span className={hasHeadings ? 'text-emerald-800' : 'text-gray-600'}>
                          H2 / H3 semantic headings present for TOC
                        </span>
                      </li>
                      <li className="flex items-center gap-2">
                        {hasImageAlt ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />}
                        <span className={hasImageAlt ? 'text-emerald-800' : 'text-gray-600'}>
                          Featured image alt text configured
                        </span>
                      </li>
                      <li className="flex items-center gap-2">
                        {hasDofollowOrNofollow ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <span className="w-3.5 h-3.5 rounded-full bg-gray-200 inline-block" />}
                        <span className={hasDofollowOrNofollow ? 'text-emerald-800' : 'text-gray-500'}>
                          DoFollow / NoFollow link references embedded
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ================= LINK INSERTION MODAL ================= */}
      {isLinkModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-[#FAF6EC] border border-[#E8E0D3] rounded-2xl w-full max-w-lg shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#E8E0D3] pb-3">
              <h3 className="font-serif text-base font-bold text-[#1c1c16] flex items-center gap-2">
                <LinkIcon className="w-4 h-4 text-[#315B2B]" />
                Insert Hyperlink (DoFollow / NoFollow)
              </h3>
              <button
                type="button"
                onClick={() => setIsLinkModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#4A3525] uppercase tracking-wider mb-1">
                Link Anchor Text
              </label>
              <input
                type="text"
                value={linkText}
                onChange={(e) => setLinkText(e.target.value)}
                placeholder="e.g., WSAVA Global Nutrition Guidelines"
                className="w-full px-3 py-2 bg-white border border-[#E8E0D3] rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#4A3525] uppercase tracking-wider mb-1">
                Destination URL
              </label>
              <input
                type="text"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://example.com/study or internal #triage / #nutrition"
                className="w-full px-3 py-2 bg-white border border-[#E8E0D3] rounded-xl text-xs"
              />
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[11px] text-[#718C5C]">Quick Internal Links:</span>
                <button
                  type="button"
                  onClick={() => {
                    setLinkUrl('#triage');
                    if (!linkText) setLinkText('Digital Symptom Triage');
                  }}
                  className="px-2 py-0.5 bg-white border border-[#CEECB4] rounded text-[11px] text-[#315B2B] hover:bg-[#CEECB4]/30"
                >
                  #triage
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLinkUrl('#nutrition');
                    if (!linkText) setLinkText('Caloric & Nutrition Calculator');
                  }}
                  className="px-2 py-0.5 bg-white border border-[#CEECB4] rounded text-[11px] text-[#315B2B] hover:bg-[#CEECB4]/30"
                >
                  #nutrition
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLinkUrl('#library');
                    if (!linkText) setLinkText('Peer-Reviewed Library');
                  }}
                  className="px-2 py-0.5 bg-white border border-[#CEECB4] rounded text-[11px] text-[#315B2B] hover:bg-[#CEECB4]/30"
                >
                  #library
                </button>
              </div>
            </div>

            {/* DoFollow vs NoFollow selection */}
            <div>
              <label className="block text-xs font-bold text-[#4A3525] uppercase tracking-wider mb-1.5">
                SEO Link Relationship (Rel)
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className={`flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer transition-all ${linkRel === 'dofollow' ? 'bg-[#24451F]/10 border-[#315B2B]' : 'bg-white border-[#E8E0D3]'}`}>
                  <input
                    type="radio"
                    name="linkRel"
                    value="dofollow"
                    checked={linkRel === 'dofollow'}
                    onChange={() => setLinkRel('dofollow')}
                    className="mt-0.5 text-[#315B2B] focus:ring-[#315B2B]"
                  />
                  <div>
                    <strong className="block text-xs text-[#1c1c16]">DoFollow</strong>
                    <span className="text-[10px] text-[#718C5C]">
                      Passes PageRank equity. Best for high-authority citations and trusted research.
                    </span>
                  </div>
                </label>

                <label className={`flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer transition-all ${linkRel === 'nofollow' ? 'bg-[#24451F]/10 border-[#315B2B]' : 'bg-white border-[#E8E0D3]'}`}>
                  <input
                    type="radio"
                    name="linkRel"
                    value="nofollow"
                    checked={linkRel === 'nofollow'}
                    onChange={() => setLinkRel('nofollow')}
                    className="mt-0.5 text-[#315B2B] focus:ring-[#315B2B]"
                  />
                  <div>
                    <strong className="block text-xs text-[#1c1c16]">NoFollow</strong>
                    <span className="text-[10px] text-[#718C5C]">
                      rel="nofollow". Tells search engines not to endorse destination ranking.
                    </span>
                  </div>
                </label>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="targetBlank"
                checked={linkTargetBlank}
                onChange={(e) => setLinkTargetBlank(e.target.checked)}
                className="rounded text-[#315B2B] focus:ring-[#315B2B]"
              />
              <label htmlFor="targetBlank" className="text-xs text-[#4A3525]">
                Open link in new browser tab (`target="_blank"`)
              </label>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E8E0D3]">
              <button
                type="button"
                onClick={() => setIsLinkModalOpen(false)}
                className="px-3.5 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-200 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleInsertLink}
                className="px-4 py-2 text-xs font-bold bg-[#24451F] hover:bg-[#315B2B] text-white rounded-xl shadow-xs"
              >
                Insert Link into Content
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
