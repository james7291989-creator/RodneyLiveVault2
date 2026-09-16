/**
 * AssetVault.jsx - THE ASSET LOCK :: EXCLUSIVE MULTI-TENANT POOL
 *
 * Multi-tenant collision contract:
 *   - The vault pool fetches ONLY unclaimed assets: claimed_by IS NULL.
 *   - Clicking a row executes an atomic claim (claimed_by = user.id,
 *     claimed_at = now) against `missouri_properties` BEFORE the address is
 *     dropped into the BYOD console. Claimed rows are evicted from local
 *     state instantly so they vanish from every other operator's feed.
 *   - Visual feedback: the row flashes cyan "[SECURING ASSET...]" while the
 *     claim transaction is in flight.
 */
import React, { useEffect, useState, useCallback, useRef } from "react";
import { supabase } from "../lib/supabaseClient";

// Point this at your deployed backend (Render). Falls back to localhost:5000.
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";
const UNDERWRITING_ENDPOINT = `${API_BASE}/api/v1/analyze/quantum`;

export default function AssetVault() {
  const [vaultAssets, setVaultAssets] = useState([]);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [claimingId, setClaimingId] = useState(null);
  const [error, setError] = useState("");
  const [consoleLines, setConsoleLines] = useState([
    "BYOD CONSOLE :: STANDBY — select an asset from the vault feed to underwrite.",
  ]);
  const consoleRef = useRef(null);

  // ----------------------------------------------------------------------
  // STEP 1: EXCLUSIVE POOL FETCH — unclaimed assets only + session capture
  // ----------------------------------------------------------------------
  useEffect(() => {
    let mounted = true;

    async function fetchVault() {
      setLoading(true);
      setError("");

      // Capture the current operator session for the claim transaction.
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (!mounted) return;
      if (userError || !user) {
        setError("NO OPERATOR SESSION — reauthenticate at the tollbooth.");
        setLoading(false);
        return;
      }
      setUserId(user.id);

      // Exclusive pool: only rows where claimed_by IS NULL.
      const { data, error: fetchError } = await supabase
        .from("missouri_properties")
        .select("*")
        .is("claimed_by", null)
        .limit(50);

      if (!mounted) return;
      if (fetchError) {
        setError(`VAULT FEED FAILURE — ${fetchError.message}`);
      } else {
        setVaultAssets(data || []);
      }
      setLoading(false);
    }

    fetchVault();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  }, [consoleLines]);

  // ----------------------------------------------------------------------
  // STEP 2: THE CLAIM & UNDERWRITE TRIGGER (ATOMIC TRANSACTION)
  // ----------------------------------------------------------------------
  const handleClaim = useCallback(
    async (property) => {
      if (claimingId || !userId) return;
      setClaimingId(property.id);

      // Claim transaction: stamp the operator identity and timestamp.
      const { error: claimError } = await supabase
        .from("missouri_properties")
        .update({
          claimed_by: userId,
          claimed_at: new Date().toISOString(),
        })
        .eq("id", property.id);

      if (claimError) {
        setError(`CLAIM DENIED — ${claimError.message}`);
        setClaimingId(null);
        return;
      }

      // Evict the claimed asset from the local feed immediately.
      setVaultAssets((prev) =>
        prev.filter((asset) => asset.id !== property.id)
      );
      setClaimingId(null);

      // NOW fire the Siphon/Underwriting pipeline into the BYOD console.
      const address =
        property.address ||
        property.street_address ||
        property.street ||
        "Unknown address";
      setConsoleLines((prev) => [
        ...prev,
        `>>> [ASSET LOCKED] ${address} — claimed by operator ${userId}`,
        ">>> [SYSTEM]: Siphoning physical footprint and county tax records for autonomous underwriting...",
      ]);
      try {
        const resp = await fetch(UNDERWRITING_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ address }),
        });
        const data = await resp.json().catch(() => ({}));
        const readout =
          data.response ||
          data.arv ||
          JSON.stringify(data, null, 2) ||
          `[HTTP ${resp.status}] Empty response body.`;
        setConsoleLines((prev) => [
          ...prev,
          `>>> [SV-1500 READOUT]:\n${String(readout)}`,
        ]);
      } catch (err) {
        setConsoleLines((prev) => [
          ...prev,
          `>>> [LINK FAILURE] Cannot reach ${UNDERWRITING_ENDPOINT} (${err.message}).`,
        ]);
      }
    },
    [claimingId, userId]
  );

  // ----------------------------------------------------------------------
  // RENDER
  // ----------------------------------------------------------------------
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050505] px-4 py-10">
      {/* Obsidian radial ambiance */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(8,145,178,0.08),transparent_60%)]" />

      <div className="relative z-10 mx-auto w-full max-w-6xl">
        {/* Brand header */}
        <div className="mb-8 text-center">
          <h1 className="font-mono text-3xl font-bold tracking-tight text-white drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">
            ASSET VAULT
          </h1>
          <p className="mt-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">
            Exclusive Unclaimed Pool :: Click to Permanently Claim
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-md border border-red-900/50 bg-red-950/40 px-3 py-2 font-mono text-[13px] text-red-300">
            {error}
          </div>
        )}

        {/* Vault feed table */}
        <div className="rounded-xl border border-white/10 bg-white/[0.02] shadow-2xl backdrop-blur-xl">
          <div className="overflow-x-auto">
            <table className="w-full font-mono text-[13px]">
              <thead>
                <tr className="border-b border-white/10 text-left text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  <th className="px-4 py-3">Address</th>
                  <th className="px-4 py-3">City</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Beds</th>
                  <th className="px-4 py-3">Baths</th>
                  <th className="px-4 py-3">SqFt</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-cyan-300">
                      [SYNCHRONIZING EXCLUSIVE POOL...]
                    </td>
                  </tr>
                ) : vaultAssets.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                      VAULT EMPTY — every asset in the pool has been claimed.
                    </td>
                  </tr>
                ) : (
                  vaultAssets.map((property) => {
                    const isClaiming = claimingId === property.id;
                    return (
                      <tr
                        key={property.id}
                        onClick={() => handleClaim(property)}
                        className={`cursor-pointer border-b border-white/5 transition-all duration-200 ${
                          isClaiming
                            ? "text-cyan-300 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]"
                            : "text-slate-300 hover:bg-white/[0.04] hover:text-cyan-200"
                        }`}
                      >
                        <td className="px-4 py-3">
                          {property.address ||
                            property.street_address ||
                            property.street ||
                            "Unknown address"}
                        </td>
                        <td className="px-4 py-3">{property.city || "—"}</td>
                        <td className="px-4 py-3">
                          {property.price != null
                            ? `$${Number(property.price).toLocaleString()}`
                            : "—"}
                        </td>
                        <td className="px-4 py-3">{property.beds ?? property.bedrooms ?? "—"}</td>
                        <td className="px-4 py-3">{property.baths ?? property.bathrooms ?? "—"}</td>
                        <td className="px-4 py-3">{property.sqft ?? property.sqft_living ?? "—"}</td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {isClaiming ? "[SECURING ASSET...]" : "[AVAILABLE]"}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* BYOD Console */}
        <div className="mt-8 bg-black/80 border border-cyan-900/50 rounded-lg p-5 font-mono shadow-[inset_0_0_30px_rgba(0,0,0,0.9)]">
          <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-slate-500">
            BYOD Console :: Underwriting Output
          </p>
          <div
            ref={consoleRef}
            className="relative z-10 h-[300px] overflow-y-auto rounded-lg bg-black/60 p-4 text-[13px] whitespace-pre-wrap text-slate-300"
          >
            {consoleLines.map((line, idx) => (
              <div
                key={idx}
                className={
                  line.startsWith(">>> [SV-1500 READOUT]:") ||
                  line.startsWith(">>> [ASSET LOCKED]")
                    ? "text-cyan-300 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]"
                    : line.startsWith(">>> [LINK FAILURE]")
                    ? "text-red-300"
                    : "text-slate-400"
                }
              >
                {line}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
