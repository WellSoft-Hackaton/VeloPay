"use client";

import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import dynamic from "next/dynamic";

// ── Dynamically import Globe (no SSR – it uses WebGL) ────────────────────
const Globe = dynamic(() => import("react-globe.gl"), { ssr: false });

// ── Financial hub cities ─────────────────────────────────────────────────
const CITIES = [
  // Gulf & Middle East (primary – VeloPay core region)
  { name: "Riyadh",      lat: 24.71, lng: 46.67, size: 1.4, color: "#13B601" },
  { name: "Dubai",       lat: 25.20, lng: 55.27, size: 1.3, color: "#13B601" },
  { name: "Abu Dhabi",   lat: 24.45, lng: 54.65, size: 1.0, color: "#0ff"    },
  { name: "Doha",        lat: 25.28, lng: 51.52, size: 1.0, color: "#0ff"    },
  { name: "Kuwait City", lat: 29.37, lng: 47.97, size: 1.0, color: "#0ff"    },
  { name: "Muscat",      lat: 23.58, lng: 58.38, size: 0.8, color: "#0ff"    },
  { name: "Manama",      lat: 26.22, lng: 50.58, size: 0.8, color: "#0ff"    },
  // Levant
  { name: "Amman",       lat: 31.95, lng: 35.93, size: 1.2, color: "#13B601" },
  { name: "Beirut",      lat: 33.89, lng: 35.50, size: 0.9, color: "#ff6ec7" },
  { name: "Damascus",    lat: 33.51, lng: 36.29, size: 0.8, color: "#ff6ec7" },
  { name: "Baghdad",     lat: 33.31, lng: 44.37, size: 1.0, color: "#ff6ec7" },
  { name: "Jerusalem",   lat: 31.77, lng: 35.23, size: 0.9, color: "#ff6ec7" },
  // North Africa
  { name: "Cairo",       lat: 30.04, lng: 31.24, size: 1.3, color: "#13B601" },
  { name: "Tripoli",     lat: 32.90, lng: 13.18, size: 0.7, color: "#a855f7" },
  { name: "Tunis",       lat: 36.81, lng: 10.18, size: 0.7, color: "#a855f7" },
  { name: "Algiers",     lat: 36.75, lng:  3.06, size: 0.7, color: "#a855f7" },
  { name: "Casablanca",  lat: 33.57, lng: -7.59, size: 0.8, color: "#a855f7" },
  // Sub-Saharan Africa
  { name: "Lagos",       lat:  6.52, lng:  3.38, size: 0.9, color: "#0ff"    },
  { name: "Nairobi",     lat: -1.29, lng: 36.82, size: 0.8, color: "#0ff"    },
  { name: "Johannesburg",lat: -26.20,lng: 28.04, size: 0.9, color: "#0ff"    },
  // Europe (secondary)
  { name: "London",      lat: 51.51, lng: -0.13, size: 1.0, color: "#a855f7" },
  { name: "Frankfurt",   lat: 50.11, lng:  8.68, size: 0.7, color: "#a855f7" },
  { name: "Istanbul",    lat: 41.01, lng: 28.98, size: 1.0, color: "#a855f7" },
  // Asia
  { name: "Mumbai",      lat: 19.08, lng: 72.88, size: 0.8, color: "#0ff"    },
  { name: "Singapore",   lat:  1.35, lng: 103.82,size: 0.8, color: "#0ff"    },
  { name: "Tokyo",       lat: 35.68, lng: 139.69,size: 0.7, color: "#0ff"    },
  // Americas (far off, faint)
  { name: "New York",    lat: 40.71, lng: -74.01, size: 0.7, color: "#a855f7"},
];

// ── Arc colour palette (cyberpunk neons) ─────────────────────────────────
const ARC_COLORS = [
  ["#13B601", "#0ff"],        // green → cyan
  ["#ff006a", "#ff6ec7"],     // red → pink
  ["#a855f7", "#7c3aed"],     // purple
  ["#0ff",    "#13B601"],     // cyan → green
  ["#ff6ec7", "#a855f7"],     // pink → purple
  ["#13B601", "#ff6ec7"],     // green → pink
];

// ── Generate arcs between cities ─────────────────────────────────────────
function generateArcs() {
  const arcs: Array<{
    startLat: number; startLng: number;
    endLat: number;   endLng: number;
    color: string[];  stroke: number;
    dashLength: number; dashGap: number;
    animateTime: number;
  }> = [];

  // Main financial corridors (Gulf ↔ Levant, Africa, Europe)
  const corridors = [
    [0, 7],  // Riyadh → Amman
    [0, 12], // Riyadh → Cairo
    [1, 7],  // Dubai → Amman
    [1, 12], // Dubai → Cairo
    [1, 23], // Dubai → Mumbai
    [0, 1],  // Riyadh → Dubai
    [3, 7],  // Doha → Amman
    [4, 10], // Kuwait → Baghdad
    [7, 8],  // Amman → Beirut
    [7, 11], // Amman → Jerusalem
    [12, 17],// Cairo → Lagos
    [12, 18],// Cairo → Nairobi
    [1, 22], // Dubai → Istanbul
    [0, 20], // Riyadh → London
    [1, 24], // Dubai → Singapore
    [20, 26],// London → New York
    [22, 12],// Istanbul → Cairo
    [7, 9],  // Amman → Damascus
    [19, 20],// Johannesburg → London
    [0, 4],  // Riyadh → Kuwait
    [1, 3],  // Dubai → Doha
    [12, 14],// Cairo → Tunis
    [16, 20],// Casablanca → London
    [0, 5],  // Riyadh → Muscat
    [1, 6],  // Dubai → Manama
    [7, 12], // Amman → Cairo
    [21, 20],// Frankfurt → London
    [1, 25], // Dubai → Tokyo
    [0, 23], // Riyadh → Mumbai
    [15, 20],// Algiers → London
  ];

  corridors.forEach(([from, to], i) => {
    const cPalette = ARC_COLORS[i % ARC_COLORS.length];
    arcs.push({
      startLat: CITIES[from].lat,
      startLng: CITIES[from].lng,
      endLat: CITIES[to].lat,
      endLng: CITIES[to].lng,
      color: cPalette,
      stroke: 0.35 + Math.random() * 0.3,
      dashLength: 0.4 + Math.random() * 0.5,
      dashGap: 0.1 + Math.random() * 0.15,
      animateTime: 2000 + Math.random() * 4000,
    });
  });

  return arcs;
}

// ── Generate rings (expanding pulse at key cities) ───────────────────────
function generateRings() {
  const keyIndices = [0, 1, 7, 12, 20, 22]; // Riyadh, Dubai, Amman, Cairo, London, Istanbul
  return keyIndices.map((idx) => ({
    lat: CITIES[idx].lat,
    lng: CITIES[idx].lng,
    maxR: 3 + Math.random() * 2,
    propagationSpeed: 2 + Math.random() * 2,
    repeatPeriod: 1200 + Math.random() * 1800,
    color: CITIES[idx].color,
  }));
}

// ══════════════════════════════════════════════════════════════════════════
// Component
// ══════════════════════════════════════════════════════════════════════════
export function GlobeBackground() {
  const globeRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ w: 800, h: 600 });
  const [mounted, setMounted] = useState(false);

  const arcsData = useMemo(() => generateArcs(), []);
  const ringsData = useMemo(() => generateRings(), []);

  // ── Resize observer ─────────────────────────────────────────────────
  useEffect(() => {
    setMounted(true);
    const el = containerRef.current;
    if (!el) return;

    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setDimensions({ w: width, h: height });
      }
    });
    ro.observe(el);
    setDimensions({ w: el.offsetWidth, h: el.offsetHeight });

    return () => ro.disconnect();
  }, []);

  // ── Set initial camera once globe is ready ──────────────────────────
  const handleGlobeReady = useCallback(() => {
    const globe = globeRef.current;
    if (!globe) return;

    // Point-of-view on Middle East (lat 25, lng 42) with moderate zoom
    globe.pointOfView({ lat: 25, lng: 42, altitude: 2.2 }, 0);

    // Auto-rotate
    const controls = globe.controls();
    if (controls) {
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.4;
      controls.enableZoom = false;
      controls.enablePan = false;
      controls.enableRotate = false;
    }
  }, []);

  if (!mounted) {
    return (
      <div
        ref={containerRef}
        className="absolute inset-0"
        style={{ zIndex: 0, background: "transparent" }}
      />
    );
  }

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    >
      {/* @ts-ignore – react-globe.gl types are imprecise */}
      <Globe
        ref={globeRef}
        width={dimensions.w}
        height={dimensions.h}
        backgroundColor="rgba(0,0,0,0)"
        // ── Globe surface ─────────────────────────────────────────────
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        // ── Atmosphere ────────────────────────────────────────────────
        showAtmosphere={true}
        atmosphereColor="#13B601"
        atmosphereAltitude={0.18}
        // ── Points (cities as glowing dots) ───────────────────────────
        pointsData={CITIES}
        pointLat="lat"
        pointLng="lng"
        pointColor="color"
        pointAltitude={0.01}
        pointRadius={(d: any) => d.size * 0.35}
        pointsMerge={false}
        // ── Arcs (animated dashes) ────────────────────────────────────
        arcsData={arcsData}
        arcStartLat="startLat"
        arcStartLng="startLng"
        arcEndLat="endLat"
        arcEndLng="endLng"
        arcColor="color"
        arcStroke="stroke"
        arcDashLength="dashLength"
        arcDashGap="dashGap"
        arcDashAnimateTime="animateTime"
        arcAltitudeAutoScale={0.35}
        arcsTransitionDuration={0}
        // ── Rings (expanding pulses at key cities) ────────────────────
        ringsData={ringsData}
        ringLat="lat"
        ringLng="lng"
        ringColor={(d: any) => (t: number) =>
          `rgba(${hexToRgb(d.color)},${1 - t})`
        }
        ringMaxRadius="maxR"
        ringPropagationSpeed="propagationSpeed"
        ringRepeatPeriod="repeatPeriod"
        // ── Interaction ───────────────────────────────────────────────
        enablePointerInteraction={false}
        animateIn={true}
        onGlobeReady={handleGlobeReady}
      />
    </div>
  );
}

// ── Utility: hex → "r,g,b" string ────────────────────────────────────────
function hexToRgb(hex: string): string {
  // Handle short hex like #0ff
  let h = hex.replace("#", "");
  if (h.length === 3) h = h[0]+h[0]+h[1]+h[1]+h[2]+h[2];
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `${r},${g},${b}`;
}
