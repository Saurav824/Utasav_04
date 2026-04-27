
import React, { useState, useEffect } from 'react';
import { findNearbyFestivals } from '../services/geminiService';
import { GroundingSource } from '../types';
import { MapContainer, TileLayer, Marker, Popup, useMap, Tooltip, GeoJSON } from 'react-leaflet';
import L from 'leaflet';

// Fix Leaflet icon issue
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const RecenterMap: React.FC<{ lat: number, lng: number }> = ({ lat, lng }) => {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], 13);
  }, [lat, lng, map]);
  return null;
};

export const NearbyFestivals: React.FC = () => {
  const [location, setLocation] = useState<{ lat: number, lng: number } | null>(null);
  const [data, setData] = useState<{ text: string, sources: GroundingSource[] } | null>(null);
  const [loading, setLoading] = useState(false);

  // Mock markers for sources since we don't have real coords from grounding yet
  // In a real app, we'd extract these from the grounding metadata if available
  const [markers, setMarkers] = useState<{ lat: number, lng: number, title: string }[]>([]);
  const [geoJsonData, setGeoJsonData] = useState<any>(null);

  useEffect(() => {
    const loadGeoJson = async () => {
      // Reliable GeoJSON source for India states from Highcharts
      const url = "https://raw.githubusercontent.com/highcharts/map-collection-dist/master/countries/in/in-all.geo.json";
      
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        
        // Basic validation to ensure it's a GeoJSON object
        if (data && (data.type === "FeatureCollection" || data.type === "Feature")) {
          setGeoJsonData(data);
        } else {
          throw new Error("Invalid GeoJSON format");
        }
      } catch (err) {
        console.error("Failed to load GeoJSON:", err);
      }
    };

    loadGeoJson();
  }, []);

  const fetchNearby = async (lat?: number, lng?: number) => {
    setLoading(true);
    try {
      const result = await findNearbyFestivals(lat, lng);
      setData(result);
      
      // Generate some mock markers around the user's location for the sources
      if (lat && lng && result.sources.length > 0) {
        const newMarkers = result.sources.map((src, i) => ({
          lat: lat + (Math.random() - 0.5) * 0.05,
          lng: lng + (Math.random() - 0.5) * 0.05,
          title: src.title
        }));
        setMarkers(newMarkers);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setLocation(coords);
        fetchNearby(coords.lat, coords.lng);
      },
      () => {
        fetchNearby();
      }
    );
  }, []);

  return (
    <section className="py-24 px-4 bg-stone-900">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1">
            <h2 className="text-4xl md:text-5xl font-serif text-amber-100 mb-6 leading-tight">Cultural Pulses <br/><span className="text-amber-500">Near You</span></h2>
            <p className="text-stone-400 mb-8 leading-relaxed">
              Using advanced location grounding, Utsav finds temples, cultural landmarks, and ongoing festivities in your vicinity, connecting you to the pulse of tradition.
            </p>
            {loading ? (
              <div className="space-y-4">
                <div className="h-4 bg-stone-800 rounded w-full animate-pulse"></div>
                <div className="h-4 bg-stone-800 rounded w-5/6 animate-pulse"></div>
                <div className="h-4 bg-stone-800 rounded w-4/6 animate-pulse"></div>
              </div>
            ) : data ? (
              <div className="space-y-6">
                <div className="prose prose-invert max-w-none text-stone-300">
                   {data.text}
                </div>
                {data.sources.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-amber-500 uppercase tracking-widest mb-3">Verified Sources</h4>
                    <div className="flex flex-wrap gap-3">
                      {data.sources.map((src, i) => (
                        <a 
                          key={i} 
                          href={src.uri} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="px-4 py-2 glass rounded-full text-xs text-amber-200 border border-amber-500/20 hover:bg-amber-500/10 transition-colors"
                        >
                          <i className="fa-solid fa-location-dot mr-2"></i>
                          {src.title}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-stone-500 italic">No cultural data found for your region yet.</p>
            )}
          </div>
          <div className="flex-1 w-full">
            <div className="h-[500px] w-full glass rounded-3xl overflow-hidden border border-white/10 relative">
              {location ? (
                <MapContainer 
                  center={[location.lat, location.lng]} 
                  zoom={13} 
                  style={{ height: '100%', width: '100%', background: '#1c1917' }}
                  scrollWheelZoom={false}
                >
                  <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                  />
                  {geoJsonData && (
                    <GeoJSON 
                      data={geoJsonData} 
                      style={{
                        fillColor: "#f59e0b",
                        weight: 1,
                        opacity: 1,
                        color: "white",
                        fillOpacity: 0.1
                      }}
                    />
                  )}
                  <Marker position={[location.lat, location.lng]}>
                    <Popup>
                      <span className="font-bold text-stone-900">You are here</span>
                    </Popup>
                  </Marker>
                  {markers.map((m, i) => (
                    <Marker 
                      key={i} 
                      position={[m.lat, m.lng]}
                      eventHandlers={{
                        click: () => {
                          const isFeatured = ['Diwali', 'Holi', 'Onam', 'Pongal', 'Durga Puja', 'Baisakhi'].includes(m.title);
                          if (isFeatured) {
                            const element = document.getElementById('explore');
                            if (element) {
                              element.scrollIntoView({ behavior: 'smooth' });
                            }
                          }
                        }
                      }}
                    >
                      <Popup>
                        <div className="p-2">
                          <h4 className="font-bold text-stone-900 mb-1">{m.title}</h4>
                          <p className="text-xs text-stone-600">Cultural landmark or festival found near you.</p>
                          {['Diwali', 'Holi', 'Onam', 'Pongal', 'Durga Puja', 'Baisakhi'].includes(m.title) ? (
                            <span className="text-[10px] text-amber-600 font-bold mt-2 block">Featured Festival - Click to explore</span>
                          ) : (
                            <span className="text-[10px] text-stone-400 mt-2 block italic">Verified Source</span>
                          )}
                        </div>
                      </Popup>
                      <Tooltip direction="top" offset={[0, -40]} opacity={1} permanent={false}>
                        <span className="font-bold text-stone-900">{m.title}</span>
                      </Tooltip>
                    </Marker>
                  ))}
                  <RecenterMap lat={location.lat} lng={location.lng} />
                </MapContainer>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center p-12">
                  <i className="fa-solid fa-map-location-dot text-6xl text-amber-500/20 mb-6"></i>
                  <h3 className="text-2xl font-serif text-amber-100">Awaiting Location</h3>
                  <p className="text-stone-500 text-sm mt-2">Grant location access to see cultural pulses near you.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
