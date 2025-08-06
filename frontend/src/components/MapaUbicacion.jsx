// MapaUbicacion.jsx
import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Corrige el icono por defecto que no carga en algunos entornos
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

delete L.Icon.Default.prototype._getIconUrl

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
})

export default function MapaUbicacion() {
  const [posicion, setPosicion] = useState(null)

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = [pos.coords.latitude, pos.coords.longitude]
        setPosicion(coords)
      },
      (err) => {
        console.error("Error al obtener ubicación:", err)
        // Ubicación por defecto: Ladrillera Casablanca
        setPosicion([7.921417, -72.566972])
      }
    )
  }, [])

  return (
    <div className="w-full h-[300px]">
      {posicion && (
        <MapContainer center={posicion} zoom={16} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={posicion}>
            <Popup>
              Ubicación actual detectada.
            </Popup>
          </Marker>
        </MapContainer>
      )}
    </div>
  )
}
