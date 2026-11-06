import sharp from 'sharp';
import fs from 'fs';

const svg = `
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(214, 217, 223, 0.45)" stroke-width="1"/>
    </pattern>
  </defs>

  <!-- Background paper -->
  <rect width="1200" height="630" fill="#f7f8fa"/>
  <rect width="1200" height="630" fill="url(#grid)"/>

  <!-- Outer Technical Border -->
  <rect x="36" y="36" width="1128" height="558" fill="none" stroke="#d6d9df" stroke-width="1.5"/>
  
  <!-- Corner Crosshairs -->
  <path d="M 26 36 L 46 36 M 36 26 L 36 46" stroke="#1c52b0" stroke-width="1.5"/>
  <path d="M 1154 36 L 1174 36 M 1164 26 L 1164 46" stroke="#1c52b0" stroke-width="1.5"/>
  <path d="M 26 594 L 46 594 M 36 584 L 36 604" stroke="#1c52b0" stroke-width="1.5"/>
  <path d="M 1154 594 L 1174 594 M 1164 584 L 1164 604" stroke="#1c52b0" stroke-width="1.5"/>

  <!-- Blueprint Coordinate Rings (Right side decoration) -->
  <g transform="translate(960, 315)">
    <ellipse cx="0" cy="0" rx="220" ry="80" fill="none" stroke="rgba(28, 82, 176, 0.2)" stroke-dasharray="6 6" transform="rotate(-20)"/>
    <ellipse cx="0" cy="0" rx="90" ry="220" fill="none" stroke="rgba(20, 22, 25, 0.12)" transform="rotate(15)"/>
    <circle cx="0" cy="0" r="235" fill="none" stroke="rgba(28, 82, 176, 0.14)"/>
    <circle cx="0" cy="0" r="4" fill="#1c52b0"/>
  </g>

  <!-- Header metadata -->
  <g transform="translate(80, 96)">
    <text font-family="'Courier New', monospace" font-size="14" font-weight="600" fill="#1c52b0" letter-spacing="2">FIG 01 // ENGINEERING DOSSIER</text>
    <circle cx="310" cy="-5" r="3.5" fill="#1c52b0"/>
    <text x="325" y="0" font-family="'Courier New', monospace" font-size="14" fill="#494d56" letter-spacing="1.5">NGUYEN MINH THUAN</text>
  </g>

  <line x1="80" y1="122" x2="1120" y2="122" stroke="#d6d9df" stroke-width="1"/>

  <!-- Main Headline -->
  <g transform="translate(80, 205)">
    <text font-family="Georgia, serif" font-size="52" font-weight="600" fill="#141619" letter-spacing="-1.5">I build backend systems</text>
    <text y="66" font-family="Georgia, serif" font-size="52" font-weight="600" fill="#141619" letter-spacing="-1.5">and search pipelines</text>
    <text y="132" font-family="Georgia, serif" font-size="52" font-weight="600" fill="#1c52b0" letter-spacing="-1.5">that don't hallucinate.</text>
  </g>

  <!-- Subtitle -->
  <g transform="translate(80, 400)">
    <text font-family="sans-serif" font-size="20" fill="#494d56">AI Systems &amp; Backend Engineer · Graduate 2026 (International University VNU-HCM)</text>
    <text y="32" font-family="sans-serif" font-size="16" fill="#5e6470">Agentic Voice Copilots · Ingestion Telemetry · Low-Latency Vector Retrieval</text>
  </g>

  <!-- Verified Metric Badges -->
  <g transform="translate(80, 482)">
    <!-- Badge 1 -->
    <rect x="0" y="0" width="240" height="36" rx="2" fill="#ffffff" stroke="#d6d9df"/>
    <circle cx="16" cy="18" r="3" fill="#1c52b0"/>
    <text x="30" y="23" font-family="'Courier New', monospace" font-size="11.5" font-weight="600" fill="#141619">TOP 13/300+ FPT HACKATHON</text>

    <!-- Badge 2 -->
    <rect x="255" y="0" width="220" height="36" rx="2" fill="#ffffff" stroke="#d6d9df"/>
    <circle cx="271" cy="18" r="3" fill="#1c52b0"/>
    <text x="285" y="23" font-family="'Courier New', monospace" font-size="11.5" font-weight="600" fill="#141619">152K+ xAPI EVENTS STREAM</text>

    <!-- Badge 3 -->
    <rect x="490" y="0" width="225" height="36" rx="2" fill="#ffffff" stroke="#d6d9df"/>
    <circle cx="506" cy="18" r="3" fill="#1c52b0"/>
    <text x="520" y="23" font-family="'Courier New', monospace" font-size="11.5" font-weight="600" fill="#141619">&lt;120MS JMETER STRESS TEST</text>
  </g>

  <!-- Footer metadata -->
  <line x1="80" y1="545" x2="1120" y2="545" stroke="#d6d9df" stroke-width="1"/>
  <g transform="translate(80, 570)">
    <text font-family="'Courier New', monospace" font-size="11.5" fill="#5e6470" letter-spacing="1">HO CHI MINH CITY · VIETNAM</text>
    <text x="1040" y="0" text-anchor="end" font-family="'Courier New', monospace" font-size="11.5" fill="#1c52b0" letter-spacing="1">THUANNM0426@GMAIL.COM</text>
  </g>
</svg>
`;

async function main() {
  if (!fs.existsSync('public')) {
    fs.mkdirSync('public', { recursive: true });
  }
  await sharp(Buffer.from(svg))
    .png()
    .toFile('public/og-image.png');
  console.log('Successfully generated public/og-image.png');
}

main().catch(console.error);
