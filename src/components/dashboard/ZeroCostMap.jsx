import React, { memo } from 'react';

const ZeroCostMap = ({ address, county }) => {
  const safeAddress = address ? address.replace(/\s+/g, '+') : '';
  const safeCounty = county ? county.replace(/\s+/g, '+') : 'St+Louis';
  const query = safeAddress + '+' + safeCounty;
  const mapUrl = 'https://maps.google.com/maps?q=' + query + '&t=k&z=20&ie=UTF8&iwloc=&output=embed';

  return (
    <div className="w-full h-64 md:h-96 rounded-lg overflow-hidden border-2 border-emerald-500/30 relative shadow-[0_0_15px_rgba(16,185,129,0.2)]">
      <iframe
        title="Tactical Satellite Feed"
        width="100%"
        height="100%"
        frameBorder="0"
        scrolling="no"
        marginHeight="0"
        marginWidth="0"
        src={mapUrl}
        style={{ filter: "contrast(1.15) saturate(1.1)" }}
      ></iframe>
      <div className="absolute top-3 left-3 bg-slate-900/90 text-emerald-400 text-xs px-3 py-1.5 rounded border border-emerald-500/50 font-mono uppercase tracking-widest backdrop-blur-sm">
        /// LIVE SATELLITE UPLINK: {address || 'AWAITING TARGET'}
      </div>
    </div>
  );
};

// THE SHIELD: Prevents the map from reloading during keystrokes
export default memo(ZeroCostMap);
