import React, { useState, useEffect, useRef } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { MapPin, Phone, Check, Search, ShieldCheck, Sprout } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const AGRI_STORES = [
  {
    id: 1,
    name: "Krishi Seva Kendra",
    city: "Pune",
    lat: 18.5204,
    lng: 73.8567,
    address: "123 Shivaji Road, near Swargate, Pune, Maharashtra 411002",
    phone: "+91 20 2445 6789",
    stock: ["Organic Compost", "Neem Oil", "Copper Oxychloride (2g/L)"],
    rating: 4.8
  },
  {
    id: 2,
    name: "National Agro Agencies",
    city: "Nashik",
    lat: 20.0050,
    lng: 73.7898,
    address: "45 MG Road, Shalimar, Nashik, Maharashtra 422001",
    phone: "+91 253 257 1234",
    stock: ["Mancozeb 75% WP", "Streptomycin Sulfate", "Bacillus subtilis Bio-fungicide"],
    rating: 4.6
  },
  {
    id: 3,
    name: "Maha-Agro Fertilizer Depot",
    city: "Nagpur",
    lat: 21.1458,
    lng: 79.0882,
    address: "88 Central Avenue, Gandhibagh, Nagpur, Maharashtra 440002",
    phone: "+91 712 272 5678",
    stock: ["Balanced NPK", "Bacillus subtilis", "Organic Coconut Husk Mulch"],
    rating: 4.7
  },
  {
    id: 4,
    name: "Harit Krishi Supply",
    city: "Kolhapur",
    lat: 16.7050,
    lng: 74.2433,
    address: "14 Market Yard, near Railway Station, Kolhapur, Maharashtra 416001",
    phone: "+91 231 265 9999",
    stock: ["Chlorothalonil", "Metalaxyl + Mancozeb", "Disease-Resistant Tomato Seeds"],
    rating: 4.9
  }
];

export default function Stores() {
  const { t } = useTranslation();
  const [selectedStore, setSelectedStore] = useState(AGRI_STORES[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapRef = useRef(null);
  const leafletMapInstance = useRef(null);
  const markersRef = useRef({});

  // Dynamic Leaflet loader from CDN to avoid npm dependency issues
  useEffect(() => {
    // Check if Leaflet is already on the window
    if (window.L) {
      setMapLoaded(true);
      return;
    }

    // Add Leaflet CSS
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    link.integrity = "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=";
    link.crossOrigin = "";
    document.head.appendChild(link);

    // Add Leaflet JS
    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.integrity = "sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=";
    script.crossOrigin = "";
    script.onload = () => setMapLoaded(true);
    document.body.appendChild(script);

    return () => {
      // Cleanup leaflet elements if needed
    };
  }, []);

  // Initialize Map
  useEffect(() => {
    if (!mapLoaded || !mapRef.current || leafletMapInstance.current) return;

    const L = window.L;
    
    // Create map instance
    const map = L.map(mapRef.current).setView([selectedStore.lat, selectedStore.lng], 7);
    leafletMapInstance.current = map;

    // Add open street map tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Add markers for all stores
    AGRI_STORES.forEach((store) => {
      const marker = L.marker([store.lat, store.lng])
        .addTo(map)
        .bindPopup(`<b>${store.name}</b><br/>${store.city}<br/><a href="tel:${store.phone}" style="color:#10b981; font-weight:bold;">Call Store</a>`);
      
      markersRef.current[store.id] = marker;
      
      marker.on('click', () => {
        setSelectedStore(store);
      });
    });

  }, [mapLoaded]);

  // Center map on selected store
  const selectStore = (store) => {
    setSelectedStore(store);
    if (leafletMapInstance.current && window.L) {
      leafletMapInstance.current.setView([store.lat, store.lng], 13);
      const marker = markersRef.current[store.id];
      if (marker) {
        marker.openPopup();
      }
    }
  };

  const filteredStores = AGRI_STORES.filter(store => 
    store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    store.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    store.stock.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h3 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <Sprout className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
            Nearby Fertilizer & Pesticide Stores
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Locate authorized agricultural supply outlets, check stock availability for recommended treatments, and find directions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Store List Sidebar */}
          <div className="lg:col-span-5 flex flex-col space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <Search className="h-5 w-5" />
              </span>
              <input
                type="text"
                placeholder="Search by name, city or chemical stock..."
                className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-700 dark:text-white shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* List */}
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {filteredStores.map((store) => (
                <div
                  key={store.id}
                  onClick={() => selectStore(store)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                    selectedStore.id === store.id
                      ? "bg-emerald-500/10 border-emerald-500 dark:bg-emerald-950/20"
                      : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500/50"
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-base text-slate-855 dark:text-white">{store.name}</h4>
                      <span className="text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-full uppercase tracking-wider">
                        {store.city}
                      </span>
                    </div>
                    
                    <p className="text-xs text-slate-555 dark:text-slate-400 mt-1 flex items-start gap-1">
                      <MapPin className="h-4 w-4 shrink-0 text-slate-400" />
                      <span className="truncate">{store.address}</span>
                    </p>

                    <p className="text-xs text-slate-555 dark:text-slate-400 mt-2 flex items-center gap-1">
                      <Phone className="h-4 w-4 text-emerald-500" />
                      <span className="font-semibold">{store.phone}</span>
                    </p>
                  </div>

                  {/* Stock tag snippet */}
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap gap-1.5">
                    {store.stock.slice(0, 2).map((item, idx) => (
                      <span key={idx} className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-350 px-2 py-0.5 rounded-md flex items-center gap-1 font-medium">
                        <Check className="h-3 w-3 text-emerald-500" />
                        {item}
                      </span>
                    ))}
                    {store.stock.length > 2 && (
                      <span className="text-[9px] text-slate-400 font-semibold self-center">
                        +{store.stock.length - 2} more
                      </span>
                    )}
                  </div>
                </div>
              ))}

              {filteredStores.length === 0 && (
                <div className="py-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-center">
                  <MapPin className="h-10 w-10 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">No stores match your search</p>
                </div>
              )}
            </div>
          </div>

          {/* Interactive Leaflet Map Area */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm flex flex-col min-h-[400px]">
            {!mapLoaded ? (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-455">
                <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-sm font-medium">Loading Interactive Map Layer...</p>
              </div>
            ) : (
              <div ref={mapRef} className="flex-1 z-0 min-h-[400px]"></div>
            )}
            
            {/* Selected Store Detailed Info Drawer */}
            {selectedStore && (
              <div className="p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-extrabold text-slate-800 dark:text-white text-lg">{selectedStore.name}</h4>
                    <span className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 font-bold rounded-lg text-xs flex items-center gap-1 border border-emerald-500/20">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      Verified
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{selectedStore.address}</p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <a
                    href={`tel:${selectedStore.phone}`}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center gap-1.5 shadow-md shadow-emerald-600/10 active:scale-95"
                  >
                    <Phone className="h-4 w-4" />
                    Call Store
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
