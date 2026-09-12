const fs = require('fs');
const path = 'src/components/dashboard/ApexTerminal.jsx';
let code = fs.readFileSync(path, 'utf8');

// 1. OBLITERATE PDF MATH & 10K HARDCODE
code = code.replace(
    /const buildAssignmentDoc = \(asset\) => \{[\s\S]*?return \{[\s\S]*?\};\n\};/m,
    const buildAssignmentDoc = (asset) => {
  return {
    number: 'ASGN-' + (asset.id ? String(asset.id).substring(0, 6).toUpperCase() : 'XXXXXX') + '-26',
    date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    buyer: 'Rodney & Sons Acquisitions LLC',
    seller: asset.owner || 'Owner of Record',
    assignee: 'TBD - Buyers List',
    property: asset.address || 'Address Not Found',
    purchase: Number(asset.mao) || 0,
    assignmentFee: 15000
  };
};
);

// 2. OBLITERATE ASSET ROW MATH
code = code.replace(
    /const mao = Math\.max\(0, Math\.round\(\(Number\(arv\) \* 0\.7\) - Number\(rehab\) - Number\(fee\)\)\);/g,
    'const mao = Number(asset.mao) || 0;'
);

// 3. OBLITERATE TOTALS MATH
code = code.replace(
    /mao:\s*filtered\.reduce\(\(s,\s*a\)\s*=>\s*\{[\s\S]*?return\s*s\s*\+\s*\(calculatedMao\s*>\s*0\s*\?\s*calculatedMao\s*:\s*0\);\s*\}, 0\),/m,
    'mao: filtered.reduce((s, a) => s + (Number(a.mao) || 0), 0),'
);

// 4. OBLITERATE INLINE KANBAN/TOP-HEAT MATH (Bypassing line breaks)
code = code.replace(/\{fmt\(Math\.max\([\s\S]*?asset\.arv[\s\S]*?\)\)\}/g, '{fmt(Number(asset.mao) || 0)}');
code = code.replace(/\{fmt\(Math\.max\([\s\S]*?a\.arv[\s\S]*?\)\)\}/g, '{fmt(Number(a.mao) || 0)}');

// 5. OBLITERATE INTAKE HARDCODES
code = code.replace(/let trueRehab = 30000;/g, 'let trueRehab = 0;');
code = code.replace(/body:\s*JSON\.stringify\(\{ asset: \{ address: searchInput \} \}\)/g, 'body: JSON.stringify({ asset: { address: searchInput, arv: 0, rehab_estimate: 0, fee: 15000 } })');

fs.writeFileSync(path, code, 'utf8');
console.log('[+] Node.js execution complete. Local React math eradicated.');
