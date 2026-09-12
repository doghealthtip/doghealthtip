import React, { useState } from 'react';
import { TocItem } from '../utils/tocGenerator';
import { ListCollapse, ChevronDown, ChevronUp, Bookmark } from 'lucide-react';

interface TableOfContentsProps {
  headings: TocItem[];
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({ headings }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  if (!headings || headings.length === 0) {
    return null;
  }

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.history.replaceState(null, '', `#${id}`);
    }
  };

  return (
    <nav 
      aria-label="Table of Contents"
      className="my-8 bg-[#FAF6EC] border border-[#E8E0D3] rounded-2xl p-5 shadow-sm transition-all"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-[#24451F]">
          <ListCollapse className="w-4 h-4 text-[#315B2B]" />
          <span className="font-serif text-base font-bold text-[#1c1c16]">
            Table of Contents
          </span>
          <span className="ml-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#ceecb4]/50 text-[#24451F]">
            {headings.length} {headings.length === 1 ? 'section' : 'sections'}
          </span>
        </div>

        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1 text-[#718C5C] hover:text-[#315B2B] transition-colors rounded"
          aria-expanded={isExpanded}
          aria-label="Toggle Table of Contents"
        >
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {isExpanded && (
        <ol className="mt-4 space-y-2 text-[13px] border-t border-[#E8E0D3]/80 pt-3">
          {headings.map((item, index) => (
            <li
              key={item.id || index}
              className={`transition-colors ${item.level === 3 ? 'ml-4 list-[circle]' : 'font-medium'}`}
            >
              <a
                href={`#${item.id}`}
                onClick={(e) => handleScrollTo(e, item.id)}
                className="text-[#4A3525] hover:text-[#315B2B] hover:underline flex items-start gap-1.5 leading-snug py-0.5"
              >
                {item.level === 2 && (
                  <span className="text-[#718C5C] font-semibold text-[11px] mt-0.5 shrink-0">
                    {index + 1}.
                  </span>
                )}
                <span>{item.title}</span>
              </a>
            </li>
          ))}
        </ol>
      )}
    </nav>
  );
};
