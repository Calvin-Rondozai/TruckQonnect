/**
 * Light, low-noise map styling (Google Maps JSON).
 * iOS Apple Maps ignores most keys — use mapType "mutedStandard" there.
 */
export const lightMapStyle = [
  { elementType: 'geometry', stylers: [{ color: '#f4f5f7' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#6b7280' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#f4f5f7' }] },
  { featureType: 'administrative', elementType: 'geometry.stroke', stylers: [{ color: '#e5e7eb' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#ffffff' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#e5e7eb' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#f9fafb' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#dbeafe' }] },
  { featureType: 'poi', stylers: [{ visibility: 'off' }] },
  { featureType: 'transit', stylers: [{ visibility: 'off' }] },
] as const;
