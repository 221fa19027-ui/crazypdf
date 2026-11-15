import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ALL_TOOLS, TOOL_CATEGORIES, type ToolCategory } from '../types/tools';
import { ToolCard } from '../components/ToolCard';
import { Search, X } from 'lucide-react';

export const AllTools: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') as ToolCategory | null;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory | 'all'>(categoryParam || 'all');

  const filteredTools = useMemo(() => {
    return ALL_TOOLS.filter((tool) => {
      const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        tool.title.toLowerCase().includes(query) ||
        tool.shortDesc.toLowerCase().includes(query) ||
        tool.category.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const handleCategoryChange = (cat: ToolCategory | 'all') => {
    setSelectedCategory(cat);
    if (cat === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', cat);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <h1
          className="text-3xl sm:text-4xl font-semibold text-slate-900 dark:text-white tracking-tight"
          style={{ textWrap: 'balance' }}
        >
          All Thirty-four CrazyPDF Tools
        </h1>
        <p
          className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed"
          style={{ textWrap: 'pretty' }}
        >
          Explore our complete suite of high-speed, privacy-first PDF utilities.
        </p>

        {/* Search Bar */}
        <div className="pt-4 max-w-xl mx-auto relative">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tools (e.g. merge, compress, word, protect, OCR)..."
              className="w-full pl-11 pr-10 py-3 rounded-2xl border border-slate-200 dark:border-[#272727] bg-white dark:bg-[#181818] text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30 transition-all duration-200"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        <button
          onClick={() => handleCategoryChange('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
            selectedCategory === 'all'
              ? 'bg-brand-600 text-white shadow-sm'
              : 'bg-white dark:bg-[#181818] border border-slate-200 dark:border-[#272727] text-slate-600 dark:text-slate-400 hover:border-slate-300'
          }`}
        >
          All Tools ({ALL_TOOLS.length})
        </button>
        {TOOL_CATEGORIES.map((cat) => {
          const count = ALL_TOOLS.filter((t) => t.category === cat.id).length;
          return (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                selectedCategory === cat.id
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-white dark:bg-[#181818] border border-slate-200 dark:border-[#272727] text-slate-600 dark:text-slate-400 hover:border-slate-300'
              }`}
            >
              {cat.title} ({count})
            </button>
          );
        })}
      </div>

      {/* Tools Grid */}
      {filteredTools.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white dark:bg-[#181818] rounded-2xl border border-slate-200 dark:border-[#272727] max-w-md mx-auto space-y-3">
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">No tools found</p>
          <p className="text-xs text-slate-500">No tools matched your search query "{searchQuery}".</p>
          <button
            onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
            className="px-4 py-1.5 rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-950/60 dark:text-brand-400 text-xs font-semibold"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
};
