import React, { useState } from 'react';
import { Database, Search, Filter, Download, Plus, FileText, Image as ImageIcon } from 'lucide-react';
import { DigitalAsset } from '../../types';

interface AssetLibraryModuleProps {
  assets: DigitalAsset[];
  onSaveNotification: (msg: string) => void;
}

export const AssetLibraryModule: React.FC<AssetLibraryModuleProps> = ({ assets, onSaveNotification }) => {
  const [search, setSearch] = useState('');

  const filtered = assets.filter(
    (a) =>
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.clientName.toLowerCase().includes(search.toLowerCase()) ||
      a.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 space-y-6 font-sans text-zinc-100 bg-zinc-950 min-h-full">
      <div className="mirror-card p-4 sm:p-5 rounded-xl border border-zinc-800/80 bg-zinc-900/90 shadow-xl flex flex-wrap justify-between items-center gap-3">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-amber-400">
            <Database className="w-4 h-4 text-amber-400" />
            <span>Digital Asset & Die-Line Repository</span>
          </div>
          <h2 className="text-base sm:text-lg font-extrabold text-zinc-100 mt-0.5">Vector Logos, Brand Guidelines & Die-Lines</h2>
        </div>

        <button
          onClick={() => onSaveNotification('Uploaded asset to cloud repository')}
          className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 rounded-lg text-xs font-black flex items-center space-x-1.5 shadow-md shadow-amber-500/20 cursor-pointer transition-all border border-amber-300/30"
        >
          <Plus className="w-4 h-4 text-zinc-950" />
          <span>Upload Vector Asset</span>
        </button>
      </div>

      <div className="mirror-card p-3 rounded-xl border border-zinc-800/80 bg-zinc-900/90 shadow-xl flex items-center space-x-3">
        <Search className="w-4 h-4 text-zinc-500 ml-2" />
        <input
          type="text"
          placeholder="Search by asset title, client, or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full text-xs bg-transparent border-none focus:outline-none font-medium text-zinc-100 placeholder-zinc-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((ast) => (
          <div key={ast.id} className="mirror-card p-5 bg-zinc-900/90 rounded-xl border border-zinc-800/80 shadow-xl space-y-3 hover:border-zinc-700 transition-all">
            <div className="flex justify-between items-start font-bold text-xs">
              <span className="text-zinc-100 font-bold truncate max-w-[260px]">{ast.title}</span>
              <span className="px-2 py-0.5 bg-amber-500/15 text-amber-300 border border-amber-500/30 rounded font-mono text-[10px] font-bold">
                {ast.fileFormat}
              </span>
            </div>

            <div className="text-[11px] text-zinc-400">
              Client: <span className="font-semibold text-zinc-200">{ast.clientName}</span> • Size: {ast.fileSize}
            </div>

            <div className="flex flex-wrap gap-1.5">
              {ast.tags.map((t, ti) => (
                <span key={ti} className="px-2 py-0.5 bg-zinc-950 border border-zinc-800 text-zinc-400 rounded text-[10px] font-medium">
                  #{t}
                </span>
              ))}
            </div>

            <div className="border-t border-zinc-800 pt-3 flex justify-between items-center text-xs">
              <span className="text-zinc-500 text-[10px]">{ast.lastModified}</span>
              <button
                onClick={() => onSaveNotification(`Downloading high-res master ${ast.title}`)}
                className="px-3 py-1.5 bg-zinc-800 hover:bg-amber-500 hover:text-zinc-950 text-amber-300 border border-amber-500/30 font-bold rounded-lg text-[11px] flex items-center space-x-1.5 cursor-pointer transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download File</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
