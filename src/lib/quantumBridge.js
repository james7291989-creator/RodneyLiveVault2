// ---------------------------------------------------------------------------
// QUANTUM BRIDGE :: SV-1500 Render uplink (CRA/CRACO compatible)
// Env contract: REACT_APP_QUANTUM_API_URL supersedes REACT_APP_API_URL.
// Default is the production Render origin. Render binds PORT (default 10000).
// ---------------------------------------------------------------------------
const BASE_URL =
  (typeof process !== 'undefined' &&
    (process.env.REACT_APP_QUANTUM_API_URL || process.env.REACT_APP_API_URL)) ||
  'https://apex-sv1500-core.onrender.com';

export const executeQuantumScan = async (payload = {}) => {
  const address = String(payload.address || '').trim();
  if (!address) {
    return {
      analysis: '>>> [FATAL ERROR]: No address provided to Quantum Bridge.',
      estimated_arv: 0,
      mao: 0,
      repair_estimates: 0,
      requires_manual_specs: false,
      exits: null,
      geocode: null,
      seller_intel: null,
    };
  }

  try {
    const response = await fetch(`${BASE_URL}/api/v1/analyze/quantum`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        asset: {
          address,
          fee: payload.fee,
          type: payload.type,
          condition: payload.condition,
        },
        sqft: payload.sqft || 0,
        year_built: payload.year_built || 0,
      }),
    });

    if (!response.ok) throw new Error('API Connection Dropped (HTTP ' + response.status + ')');
    return await response.json();
  } catch (error) {
    console.error('/// QUANTUM LINK FAILED ///', error);
    return {
      analysis: '>>> [FATAL ERROR]: Quantum Engine Unreachable. Check Render server status.',
      estimated_arv: 0,
      mao: 0,
      repair_estimates: 0,
      requires_manual_specs: false,
      exits: null,
      geocode: null,
      seller_intel: null,
    };
  }
};
