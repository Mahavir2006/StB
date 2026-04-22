import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Map as MapIcon } from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Leaflet icon fix for Vite bundler
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom generated HTML marker injected straight into Leaflet
const createCustomIcon = (isActive: boolean) => L.divIcon({
  className: 'bg-transparent border-none', // Override default leaflet divIcon border
  html: `
    <div style="
      width: 32px; 
      height: 32px; 
      border-radius: 50%; 
      display: flex; 
      align-items: center; 
      justify-content: center; 
      background: linear-gradient(135deg, var(--color-accent-primary-start, #C0392B), var(--color-accent-secondary-start, #8E44AD));
      border: 2px solid rgba(255, 255, 255, 0.4); 
      box-shadow: 0 0 16px rgba(192,57,43,0.5);
      transform: ${isActive ? 'scale(1.2)' : 'scale(1)'};
      transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      cursor: pointer;
    ">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
        <circle cx="12" cy="10" r="3"></circle>
      </svg>
    </div>
  `,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

interface Location {
  id: string;
  name: string;
  neighborhood: string;
  memory: string;
  coordinates: [number, number];
}

const MUMBAI_LOCATIONS: Location[] = [
  { id: 'college', name: 'DJ Sanghavi College of Engineering', neighborhood: 'Vile Parle West', memory: "Our college.", coordinates: [19.1075, 72.8373] },
  { id: 'juhu', name: 'Juhu Beach', neighborhood: 'Juhu', memory: "Our go to spot for peace.", coordinates: [19.0988, 72.8267] },
  { id: 'andheri', name: 'Andheri West Station', neighborhood: 'Andheri West', memory: "Catch-25 where we first met.", coordinates: [19.1200, 72.8460] },
  { id: 'banana-leaf', name: 'Banana Leaf', neighborhood: 'Versova Juhu Link Road', memory: "Our favourite spot for dinner.", coordinates: [19.1275, 72.8260] },
  { id: 'kaifi-azmi', name: 'Kaifi Azmi Park', neighborhood: 'Juhu', memory: "When Bijal aunty first saw us.", coordinates: [19.1085, 72.8340] },
];

// Handles camera flying smoothly to active marker or zooming out
function MapController({ activePin }: { activePin: Location | null }) {
  const map = useMap();
  useEffect(() => {
    if (activePin) {
      // Fly to pin and zoom in
      map.flyTo(activePin.coordinates, 15, { duration: 1.5, easeLinearity: 0.25 });
    } else {
      // Re-center on Mumbai overview
      map.flyTo([19.0760, 72.8777], 11, { duration: 1.5, easeLinearity: 0.25 });
    }
  }, [activePin, map]);
  return null;
}

export function GlobeScene() {
  const [activePin, setActivePin] = useState<Location | null>(null);

  // We enforce a dark-theme map layer. 
  // CartoDB Dark Matter matches the site's sleek/aurora aesthetic incredibly well.
  const TILE_URL = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
  const TILE_ATTR = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

  return (
    <div className="w-full max-w-4xl mx-auto py-8 flex flex-col gap-6">
      <div className="text-center">
        <h2 className="text-4xl font-display font-bold uppercase tracking-widest text-[var(--text-primary)]">
          Our Mumbai
        </h2>
        <p className="text-[var(--text-secondary)] mt-2 text-sm font-ui flex items-center justify-center gap-2">
          <MapIcon size={14} className="opacity-70" />
          Every pin is a memory across our city. Click the pins to remember.
        </p>
      </div>

      <div className="relative w-full aspect-[4/3] sm:aspect-[16/9] rounded-3xl overflow-hidden glassmorphism border-[0.5px] border-[var(--border-color)] group z-0">
        
        {/* The Interactive Map Layer */}
        <MapContainer 
          center={[19.0760, 72.8777]} 
          zoom={11} 
          scrollWheelZoom={false}
          className="w-full h-full absolute inset-0 z-0 bg-transparent"
          attributionControl={false} // Clean UI
          zoomControl={false} // Clean UI
        >
          <TileLayer url={TILE_URL} attribution={TILE_ATTR} />
          
          <MapController activePin={activePin} />

          {MUMBAI_LOCATIONS.map((loc) => (
            <Marker 
              key={loc.id} 
              position={loc.coordinates}
              icon={createCustomIcon(activePin?.id === loc.id)}
              eventHandlers={{
                click: () => setActivePin(activePin?.id === loc.id ? null : loc)
              }}
            />
          ))}
        </MapContainer>

        {/* Small non-intrusive tooltip when not interacting on desktop */}
        <div className="absolute top-4 left-4 z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block">
          <span className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-medium text-white/90 border border-white/10">
            You can drag and zoom the map
          </span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activePin && (
          <motion.div
            key={activePin.id}
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="glassmorphism rounded-3xl p-6 relative border-[0.5px] border-[var(--border-color)] overflow-hidden"
          >
            {/* Soft decorative glow background tied to theme colors */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-accent-primary-start,#C0392B)] opacity-10 blur-3xl rounded-full" />

            <button onClick={() => setActivePin(null)}
              className="absolute top-6 right-6 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors z-10 p-2 bg-[var(--surface-color)]/50 rounded-full hover:bg-[var(--surface-color)]"
              aria-label="Close memory">
              <X size={18} />
            </button>
            <div className="relative z-10 pr-12">
              <span className="inline-block px-2 py-0.5 rounded-md bg-[var(--accent-primary-start)]/10 text-[var(--accent-primary-start)] text-[10px] font-bold tracking-wider uppercase mb-2 border border-[var(--accent-primary-start)]/20">
                {activePin.neighborhood}
              </span>
              <h3 className="text-2xl font-display font-bold text-[var(--text-primary)]">
                {activePin.name}
              </h3>
              <p className="text-[var(--text-secondary)] font-emotional italic text-lg mt-3 leading-relaxed border-l-2 border-[var(--accent-primary-start)]/30 pl-4 py-1">
                "{activePin.memory}"
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {MUMBAI_LOCATIONS.map((loc) => (
          <motion.button
            key={loc.id}
            onClick={() => setActivePin(activePin?.id === loc.id ? null : loc)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`flex flex-col gap-1 p-4 rounded-xl text-left transition-all
              border-[0.5px] ${activePin?.id === loc.id
                ? 'border-[var(--color-accent-primary-start,#C0392B)]/50 shadow-sm'
                : 'border-[var(--border-color)] bg-[var(--surface-color)]/40 hover:bg-[var(--surface-color)]/60'
              }`}
            style={activePin?.id === loc.id ? { background: 'rgba(192,57,43,0.06)' } : {}}
          >
            <p className="text-sm font-medium text-[var(--text-primary)] leading-tight">{loc.name}</p>
            <p className="text-xs text-[var(--text-secondary)] mt-1 truncate w-full">{loc.neighborhood}</p>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
