import React, { useEffect, useRef } from 'react';

export default function GPSMap({ lat = 34.1005, lng = -118.3250, heading = 0, speed = 0 }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const trailRef = useRef(null);
  const leafletLoaded = useRef(false);

  useEffect(() => {
    if (leafletLoaded.current) return;
    leafletLoaded.current = true;

    // Inject Leaflet CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);

    // Inject Leaflet JS
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.onload = () => initMap();
    document.head.appendChild(script);
  }, []);

  const initMap = () => {
    if (!mapRef.current || mapInstanceRef.current) return;
    const L = window.L;

    const map = L.map(mapRef.current, {
      center: [lat, lng],
      zoom: 15,
      zoomControl: false,
      attributionControl: false,
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
    }).addTo(map);

    const arrowIcon = L.divIcon({
      className: '',
      html: `<div style="transform: rotate(${heading}deg); color: #00ff41; text-shadow: 0 0 8px #00ff41; font-size: 24px;">▲</div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    });

    const marker = L.marker([lat, lng], { icon: arrowIcon }).addTo(map);
    markerRef.current = marker;

    const trail = L.polyline([[lat, lng]], {
      color: '#00ff41',
      weight: 2,
      opacity: 0.8,
      dashArray: '4 6',
    }).addTo(map);
    trailRef.current = trail;

    mapInstanceRef.current = map;
  };

  useEffect(() => {
    const L = window.L;
    if (!L || !mapInstanceRef.current || !markerRef.current) return;

    const newLatLng = [lat, lng];
    markerRef.current.setLatLng(newLatLng);
    const el = markerRef.current.getElement();
    if (el) {
      const inner = el.querySelector('div');
      if (inner) inner.style.transform = `rotate(${heading}deg)`;
    }

    mapInstanceRef.current.panTo(newLatLng, { animate: true, duration: 0.8 });

    if (trailRef.current) {
      const lls = trailRef.current.getLatLngs();
      lls.push(newLatLng);
      if (lls.length > 80) lls.shift();
      trailRef.current.setLatLngs(lls);
    }
  }, [lat, lng, heading]);

  return (
    <div className="relative flex flex-col p-4 rounded-lg border w-full h-full overflow-hidden"
      style={{ borderColor: '#22c55e44', background: '#052e1688' }}>
      
      <div className="flex items-center justify-between mb-3 z-10 w-full bg-black/60 px-2 py-1 rounded backdrop-blur-sm border border-green-500/20 absolute top-4 left-0 right-0 mx-auto" style={{ width: '90%' }}>
        <div className="text-xs font-mono tracking-widest text-green-400">SAT-LINK NAVIGATION</div>
        <div className="text-[10px] font-mono text-green-400 opacity-70">
          {lat?.toFixed(4)}°N • {Math.abs(lng)?.toFixed(4)}°W • {speed}km/h
        </div>
      </div>
      
      <div ref={mapRef} className="w-full h-full rounded border border-green-500/20 z-0" style={{ minHeight: '300px', filter: 'contrast(1.2) brightness(0.9)' }} />
    </div>
  );
}