import React, { useMemo, useRef, useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, Polyline, useMap } from 'react-leaflet'
import L from 'leaflet'
import { getTripLocationSync } from '../../../api/tripApi'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({ iconUrl: '', shadowUrl: '' })

function pinIcon(label, color = '#ca8a04', textColor = '#1e293b') {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="38" height="48" viewBox="0 0 38 48">
    <path d="M19 0C8.507 0 0 8.507 0 19c0 12.5 19 29 19 29S38 31.5 38 19C38 8.507 29.493 0 19 0z" fill="${color}" stroke="#fff" stroke-width="2"/>
    <text x="19" y="22" text-anchor="middle" dominant-baseline="middle" font-size="11" font-weight="700" font-family="Arial,sans-serif" fill="${textColor}">${label}</text>
  </svg>`
  return L.divIcon({
    className: '',
    html: svg,
    iconSize: [38, 48],
    iconAnchor: [19, 48],
    popupAnchor: [0, -50],
  })
}

// Re-fits bounds every time positions array changes
function FitBounds({ positions }) {
  const map = useMap()
  const posKey = JSON.stringify(positions)
  useEffect(() => {
    if (!positions || positions.length === 0) return
    const bounds = L.latLngBounds(positions)
    map.fitBounds(bounds, { padding: [52, 52] })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, posKey])
  return null
}

const formatTime = (ts) => {
  if (!ts) return '-'
  return new Date(ts).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
}

// Clean Plus Code prefixes like "X76W+C9C " from addresses before geocoding
function cleanAddress(addr) {
  if (!addr) return ''
  return addr.trim().replace(/^[A-Z0-9]{4,}\+[A-Z0-9]+\s*/i, '').trim()
}

async function geocode(address) {
  const cleaned = cleanAddress(address)
  if (!cleaned) return null
  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(cleaned)}&format=json&limit=1&countrycodes=in`
    const res = await fetch(url, {
      headers: { 'User-Agent': 'CocoCabsAdmin/1.0', 'Accept-Language': 'en' },
    })
    const data = await res.json()
    if (Array.isArray(data) && data.length > 0) {
      return [parseFloat(data[0].lat), parseFloat(data[0].lon)]
    }
  } catch {
    // silent fail
  }
  return null
}

export function DropLocationsMap({ dropDetailsJSON, dropLocationsRaw, pickupAddress, tripId, tripInfo = {} }) {
  const mapKey = useRef(Date.now()).current
  const [showMap, setShowMap]           = useState(false)
  const [pickupCoords, setPickupCoords] = useState(null)
  const [pathPoints, setPathPoints]     = useState([])
  const [startPoint, setStartPoint]     = useState(null)
  const [showPath, setShowPath]         = useState(false)
  const [pathLoading, setPathLoading]   = useState(false)
  const [pathFetched, setPathFetched]   = useState(false)

  const drops = useMemo(() => {
    if (!dropDetailsJSON) return []
    try {
      const parsed = typeof dropDetailsJSON === 'string' ? JSON.parse(dropDetailsJSON) : dropDetailsJSON
      return [...parsed].sort((a, b) => a.DropOrderNumber - b.DropOrderNumber)
    } catch {
      return []
    }
  }, [dropDetailsJSON])

  const addressLabels = useMemo(() => {
    if (!dropLocationsRaw) return []
    return dropLocationsRaw.split('|').map((s) => s.replace(/^\d+\.\s*/, '').trim())
  }, [dropLocationsRaw])

  // Use startPoint from location-sync as pickup coords (accurate GPS vs geocoded address)
  useEffect(() => {
    if (startPoint) {
      setPickupCoords([startPoint.lat, startPoint.lng])
    }
  }, [startPoint])

  // Fetch location-sync path when map opens
  useEffect(() => {
    if (!showMap || !tripId || pathFetched || pathLoading) return
    setPathLoading(true)
    getTripLocationSync(tripId)
      .then((res) => {
        const data = res?.data ?? []
        // Find "start" event
        const startEvt = data.find((p) => p.EventType === 'start')
        if (startEvt) setStartPoint({ lat: startEvt.Latitude, lng: startEvt.Longitude, time: startEvt.CreatedAt })

        const raw = data.map((p) => [p.Latitude, p.Longitude])
        // Remove consecutive duplicates
        const pts = raw.filter((pt, i) =>
          i === 0 || pt[0] !== raw[i - 1][0] || pt[1] !== raw[i - 1][1]
        )
        setPathPoints(pts)
        setShowPath(pts.length > 0)
        setPathFetched(true)
      })
      .catch(() => { setPathFetched(true) })
      .finally(() => setPathLoading(false))
  }, [showMap, tripId, pathFetched, pathLoading])

  if (drops.length === 0) return null

  const dropPositions = drops.map((d) => [d.DriverDropLatitude, d.DriverDropLongitude])
  const pickupPos     = startPoint ? [[startPoint.lat, startPoint.lng]] : []
  const allPositions  = [...pickupPos, ...dropPositions]
  const center        = dropPositions[0]

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-3">
        <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">
          Drop Locations ({drops.length})
        </div>
        <button
          onClick={() => setShowMap((v) => !v)}
          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-brand-yellow hover:bg-yellow-500 text-slate-900 transition"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
          {showMap ? 'Hide Map' : 'Show Map'}
        </button>
      </div>

      {showMap && (
        <>

          {/* Legend + path toggle */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-4 text-[10px] text-slate-500">
              {pickupCoords && (
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-green-600 inline-block" /> P1 Pickup
                </span>
              )}
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-yellow-500 inline-block" /> Drop locations
              </span>
              {showPath && startPoint && (
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-yellow-400 inline-block" /> A1 Accepted
                </span>
              )}
              {showPath && pathPoints.length > 0 && (
                <span className="flex items-center gap-1" title="Points may overlap — zoom in to see individual GPS readings">
                  <span className="w-3 h-3 rounded-full bg-blue-500 inline-block" /> GPS points ({pathPoints.length})
                </span>
              )}
            </div>
            <button
              onClick={() => setShowPath((v) => !v)}
              disabled={pathLoading || pathPoints.length === 0}
              className={`text-[10px] font-semibold px-2.5 py-1 rounded-lg border transition disabled:opacity-40 disabled:cursor-not-allowed ${
                showPath
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {pathLoading ? 'Loading path…' : pathPoints.length === 0 && pathFetched ? 'No path data' : showPath ? 'Hide Path' : 'Show Driver Path'}
            </button>
          </div>

          <div style={{ height: '600px' }} className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm mb-3">
            <MapContainer
              key={mapKey}
              center={center}
              zoom={14}
              style={{ height: '100%', width: '100%' }}
              scrollWheelZoom={false}
            >
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
                subdomains="abcd"
                maxZoom={20}
              />

              {/* Re-fits when pickup coords arrive */}
              <FitBounds positions={allPositions} />

              {/* Driver route line connecting GPS dots */}
              {showPath && pathPoints.length > 1 && (
                <Polyline
                  positions={pathPoints}
                  pathOptions={{ color: '#3b82f6', weight: 4, opacity: 0.8 }}
                />
              )}

              {/* Driver GPS dots on actual road */}
              {showPath && pathPoints.map((pt, i) => (
                <CircleMarker
                  key={i}
                  center={pt}
                  radius={5}
                  pathOptions={{ color: '#1d4ed8', fillColor: '#ffffff', fillOpacity: 1, weight: 2 }}
                />
              ))}

              {/* Trip start marker — yellow pin */}
              {showPath && startPoint && (
                <Marker
                  position={[startPoint.lat, startPoint.lng]}
                  icon={pinIcon('A1', '#eab308', '#1e293b')}
                >
                  <Popup>
                    <div style={{ minWidth: 160, fontSize: 12 }}>
                      <div style={{ fontWeight: 700, color: '#854d0e', marginBottom: 4 }}>A1 — Trip Accepted</div>
                      <div style={{ color: '#64748b' }}>Time: <strong>{formatTime(startPoint.time)}</strong></div>
                      <div style={{ color: '#64748b', marginTop: 2 }}>
                        {startPoint.lat.toFixed(6)}, {startPoint.lng.toFixed(6)}
                      </div>
                    </div>
                  </Popup>
                </Marker>
              )}

              {/* Pickup marker — green, labeled P1 */}
              {pickupCoords && (
                <Marker position={pickupCoords} icon={pinIcon('P1', '#16a34a', '#fff')}>
                  <Popup>
                    <div style={{ minWidth: 160, fontSize: 12 }}>
                      <div style={{ fontWeight: 700, color: '#16a34a', marginBottom: 4 }}>P1 — Pickup</div>
                      <div style={{ color: '#475569', marginBottom: 4 }}>{pickupAddress?.trim()}</div>
                      {tripInfo.pickupTime && (
                        <div style={{ color: '#64748b' }}>Pickup Time: <strong>{formatTime(tripInfo.pickupTime)}</strong></div>
                      )}
                    </div>
                  </Popup>
                </Marker>
              )}

              {/* Drop markers — yellow at actual drop location, labeled D1, D2… */}
              {drops.map((d, i) => (
                <Marker
                  key={i}
                  position={[d.DriverDropLatitude, d.DriverDropLongitude]}
                  icon={pinIcon(`D${d.DropOrderNumber + 1}`)}
                >
                  <Popup maxWidth={280}>
                    <div style={{ minWidth: 240, fontSize: 12 }}>
                      <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 6 }}>D{d.DropOrderNumber + 1} — Drop {d.DropOrderNumber + 1}</div>
                      {addressLabels[d.DropOrderNumber] && (
                        <div style={{ color: '#475569', marginBottom: 6 }}>{addressLabels[d.DropOrderNumber]}</div>
                      )}
                      <div style={{ color: '#64748b', marginBottom: 2 }}>
                        Status: <span style={{ color: '#16a34a', fontWeight: 600 }}>{d.DropStatusValue}</span>
                      </div>
                      <div style={{ color: '#64748b' }}>Drop Time: <strong>{formatTime(d.DropTimeStamp)}</strong></div>
                      {d.DropDistanceKm != null && (
                        <div style={{ color: '#94a3b8', marginTop: 2 }}>{d.DropDistanceKm} km from destination</div>
                      )}
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </>
      )}

      {/* Drop cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
        {drops.map((d, i) => (
          <div key={i} className="flex items-start gap-2.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-yellow text-slate-900 text-[10px] font-bold flex items-center justify-center mt-0.5">
              D{d.DropOrderNumber + 1}
            </span>
            <div className="min-w-0">
              <div className="text-xs font-medium text-slate-800 leading-snug">
                {addressLabels[d.DropOrderNumber] || `Drop ${d.DropOrderNumber + 1}`}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">{formatTime(d.DropTimeStamp)}</div>
              <div className="text-[10px] text-green-700 font-medium">{d.DropStatusValue}</div>
              {d.DropDistanceKm != null && (
                <div className="text-[10px] text-slate-400">{d.DropDistanceKm} km from dest.</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default DropLocationsMap
