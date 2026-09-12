import React, { useState } from 'react';
import {
  Twitter,
  Facebook,
  Linkedin,
  MessageCircle,
  Copy,
  Check,
  Share2,
} from 'lucide-react';

interface SocialShareBarProps {
  title: string;
  url?: string;
  summary?: string;
  variant?: 'compact' | 'expanded';
}

export const SocialShareBar: React.FC<SocialShareBarProps> = ({
  title,
  url,
  summary,
  variant = 'compact',
}) => {
  const [copied, setCopied] = useState(false);

  // Derive canonical or current URL safely
  const articleUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  const encodedUrl = encodeURIComponent(articleUrl);
  const encodedTitle = encodeURIComponent(title);
  const encodedSummary = summary ? encodeURIComponent(summary) : encodedTitle;

  const shareLinks = {
    x: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    whatsapp: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`,
  };

  const handleOpenPopup = (e: React.MouseEvent<HTMLAnchorElement>, targetUrl: string) => {
    e.preventDefault();
    const width = 600;
    const height = 500;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;
    window.open(
      targetUrl,
      'share-dialog',
      `toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,copyhistory=no,width=${width},height=${height},top=${top},left=${left}`
    );
  };

  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(articleUrl);
      } else {
        // Fallback
        const textArea = document.createElement('textarea');
        textArea.value = articleUrl;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch (err) {
      console.warn('Could not copy text to clipboard', err);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: summary || title,
          url: articleUrl,
        });
      } catch {
        // User cancelled or not supported
      }
    } else {
      handleCopyLink();
    }
  };

  if (variant === 'compact') {
    return (
      <div className="inline-flex items-center gap-1.5" role="group" aria-label="Social media sharing">
        <span className="text-xs font-medium text-[#718C5C] mr-1 hidden sm:inline">
          Share:
        </span>

        {/* X (Twitter) */}
        <a
          href={shareLinks.x}
          onClick={(e) => handleOpenPopup(e, shareLinks.x)}
          target="_blank"
          rel="noopener noreferrer"
          className="p-1.5 text-[#4A3525] hover:text-[#1c1c16] hover:bg-[#FAF6EC] rounded-lg transition-colors border border-transparent hover:border-[#E8E0D3] cursor-pointer"
          title="Share on X (formerly Twitter)"
          aria-label="Share on X"
        >
          <Twitter className="w-4 h-4" />
        </a>

        {/* Facebook */}
        <a
          href={shareLinks.facebook}
          onClick={(e) => handleOpenPopup(e, shareLinks.facebook)}
          target="_blank"
          rel="noopener noreferrer"
          className="p-1.5 text-[#4A3525] hover:text-[#1877F2] hover:bg-[#FAF6EC] rounded-lg transition-colors border border-transparent hover:border-[#E8E0D3] cursor-pointer"
          title="Share on Facebook"
          aria-label="Share on Facebook"
        >
          <Facebook className="w-4 h-4" />
        </a>

        {/* LinkedIn */}
        <a
          href={shareLinks.linkedin}
          onClick={(e) => handleOpenPopup(e, shareLinks.linkedin)}
          target="_blank"
          rel="noopener noreferrer"
          className="p-1.5 text-[#4A3525] hover:text-[#0A66C2] hover:bg-[#FAF6EC] rounded-lg transition-colors border border-transparent hover:border-[#E8E0D3] cursor-pointer"
          title="Share on LinkedIn"
          aria-label="Share on LinkedIn"
        >
          <Linkedin className="w-4 h-4" />
        </a>

        {/* WhatsApp */}
        <a
          href={shareLinks.whatsapp}
          onClick={(e) => handleOpenPopup(e, shareLinks.whatsapp)}
          target="_blank"
          rel="noopener noreferrer"
          className="p-1.5 text-[#4A3525] hover:text-[#25D366] hover:bg-[#FAF6EC] rounded-lg transition-colors border border-transparent hover:border-[#E8E0D3] cursor-pointer"
          title="Share via WhatsApp"
          aria-label="Share via WhatsApp"
        >
          <MessageCircle className="w-4 h-4" />
        </a>

        {/* Copy Link Button */}
        <button
          type="button"
          onClick={handleCopyLink}
          className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-md transition-all border cursor-pointer ${
            copied
              ? 'bg-[#CEECB4]/50 text-[#24451F] border-[#315B2B]'
              : 'bg-[#FAF6EC] text-[#24451F] border-[#E8E0D3] hover:bg-[#CEECB4]/30'
          }`}
          title="Copy direct link"
          aria-label="Copy link"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-[#315B2B]" />
              <span className="font-bold">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Link</span>
            </>
          )}
        </button>
      </div>
    );
  }

  // Expanded variant (for end-of-article sharing section)
  return (
    <div className="bg-linear-to-br from-[#FAF6EC] to-[#F1E7D4]/40 border border-[#E8E0D3] rounded-2xl p-6 shadow-xs">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Share2 className="w-4 h-4 text-[#315B2B]" />
            <h3 className="font-serif text-base font-bold text-[#1c1c16]">
              Share This Veterinary Research
            </h3>
          </div>
          <p className="text-xs text-[#5C4D3C] max-w-xl">
            Help educate other canine guardians by sharing this evidence-based clinical guide across your professional and community networks.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* X (Twitter) */}
          <a
            href={shareLinks.x}
            onClick={(e) => handleOpenPopup(e, shareLinks.x)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white text-[#1c1c16] hover:bg-black hover:text-white text-xs font-semibold rounded-xl border border-[#E8E0D3] shadow-2xs transition-colors cursor-pointer"
            aria-label="Share on X"
          >
            <Twitter className="w-4 h-4" />
            <span>X / Twitter</span>
          </a>

          {/* Facebook */}
          <a
            href={shareLinks.facebook}
            onClick={(e) => handleOpenPopup(e, shareLinks.facebook)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white text-[#1877F2] hover:bg-[#1877F2] hover:text-white text-xs font-semibold rounded-xl border border-[#E8E0D3] shadow-2xs transition-colors cursor-pointer"
            aria-label="Share on Facebook"
          >
            <Facebook className="w-4 h-4" />
            <span>Facebook</span>
          </a>

          {/* LinkedIn */}
          <a
            href={shareLinks.linkedin}
            onClick={(e) => handleOpenPopup(e, shareLinks.linkedin)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white text-[#0A66C2] hover:bg-[#0A66C2] hover:text-white text-xs font-semibold rounded-xl border border-[#E8E0D3] shadow-2xs transition-colors cursor-pointer"
            aria-label="Share on LinkedIn"
          >
            <Linkedin className="w-4 h-4" />
            <span>LinkedIn</span>
          </a>

          {/* WhatsApp */}
          <a
            href={shareLinks.whatsapp}
            onClick={(e) => handleOpenPopup(e, shareLinks.whatsapp)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white text-[#25D366] hover:bg-[#25D366] hover:text-white text-xs font-semibold rounded-xl border border-[#E8E0D3] shadow-2xs transition-colors cursor-pointer"
            aria-label="Share via WhatsApp"
          >
            <MessageCircle className="w-4 h-4" />
            <span>WhatsApp</span>
          </a>

          {/* Copy Link */}
          <button
            type="button"
            onClick={handleCopyLink}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl border transition-all shadow-2xs cursor-pointer ${
              copied
                ? 'bg-[#315B2B] text-white border-[#315B2B]'
                : 'bg-white text-[#315B2B] border-[#CEECB4] hover:bg-[#FAF6EC]'
            }`}
            aria-label="Copy link to article"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                <span>Link Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Link</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
