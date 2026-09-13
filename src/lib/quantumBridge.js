export const executeQuantumScan = async (address) => {
    // Connects to Render in production, or localhost in development
    const baseUrl = import.meta.env.VITE_QUANTUM_API_URL || "http://localhost:10000";
    
    try {
        const response = await fetch(${baseUrl}/api/v1/analyze/quantum, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ asset: { address: address } })
        });
        
        if (!response.ok) throw new Error("API Connection Dropped");
        return await response.json();
        
    } catch (error) {
        console.error("/// QUANTUM LINK FAILED ///", error);
        return {
            estimated_arv: 0,
            mao: 0,
            analysis: ">>> [FATAL ERROR]: Quantum Engine Unreachable. Check Render server status."
        };
    }
};
