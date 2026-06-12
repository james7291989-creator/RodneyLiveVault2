import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import { Database, Search, Filter, MapPin, ArrowRightCircle, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Properties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(0);
  const ITEMS_PER_PAGE = 50;

  const fetchVaultData = useCallback(async () => {
    setLoading(true);
    let query = supabase
      .from('missouri_properties')
      .select('*', { count: 'exact' });

    if (filterStatus !== 'ALL') {
      query = query.eq('status', filterStatus);
    }
    
    if (searchTerm) {
      query = query.ilike('address', `%${searchTerm}%`);
    }

    const from = page * ITEMS_PER_PAGE;
    const to = from + ITEMS_PER_PAGE - 1;
    query = query.order('created_at', { ascending: false }).range(from, to);

    const { data, count, error } = await query;
    if (error) {
      console.error("Vault Connection Error:", error);
    } else {
      setProperties(data || []);
      setTotalCount(count || 0);
    }
    setLoading(false);
  }, [page, searchTerm, filterStatus]);

  useEffect(() => {
    const delay = setTimeout(fetchVaultData, 500);
    return () => clearTimeout(delay);
  }, [fetchVaultData]);

  useEffect(() => { setPage(0); }, [searchTerm, filterStatus]);

  return (
    <div className="min-h-screen bg-[#010103] text-white p-8">
      <header className="mb-8 border-b border-white/10 pb-6 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black uppercase text-[#80DEEA] flex items-center gap-3"><Database /> Asset Vault</h1>
          <p className="text-gray-400 text-xs uppercase mt-2">Connected Database Pipeline</p>
        </div>
        <div className="text-right">
          <p className="text-[#80DEEA] font-bold text-2xl">{totalCount}</p>
          <p className="text-gray-500 text-[10px] uppercase tracking-widest">Total Indexed Targets</p>
        </div>
      </header>

      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="QUERY ADDRESS..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 bg-black/50 border border-[#80DEEA]/30 p-3 rounded text-sm focus:outline-none focus:border-[#80DEEA] uppercase"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="bg-black/50 border border-white/10 p-3 rounded text-sm focus:outline-none"
        >
          <option value="ALL">ALL STATUSES</option>
          <option value="TAX DELINQUENT">TAX DELINQUENT</option>
          <option value="LRA INVENTORY">LRA INVENTORY</option>
          <option value="TRUSTEE SALE">TRUSTEE SALE</option>
        </select>
      </div>

      <div className="bg-black/50 border border-white/10 rounded-xl overflow-hidden">
        {loading ? <p className="p-10 text-center animate-pulse">SYNCING DATA...</p> : (
          <table className="w-full text-sm">
            <thead className="bg-white/5 border-b border-white/10 text-gray-400 uppercase text-[10px]">
              <tr>
                <th className="p-4">Target Asset</th>
                <th className="p-4">Status</th>
                <th className="p-4">ARV</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {properties.map(p => (
                <tr key={p.id}>
                  <td className="p-4">{p.address}</td>
                  <td className="p-4">{p.status || 'UNASSIGNED'}</td>
                  <td className="p-4">${p.arv}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
