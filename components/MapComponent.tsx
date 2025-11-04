'use client'

import { useEffect, useRef, useCallback } from 'react'
import mapboxgl from 'mapbox-gl'
import { Program } from '../types/program'
import 'mapbox-gl/dist/mapbox-gl.css'

// Set your Mapbox token
mapboxgl.accessToken = 'pk.eyJ1Ijoib3NjYXJvbGl0byIsImEiOiJjbWhpeG56NXUwaWlwMmxxd3Y5OXp6NnJ3In0.ZQMFdoSg8V6Ptg76Sa3zoQ'

interface MapComponentProps {
  programs: Program[]
  onProgramSelect: (program: Program) => void
}

export default function MapComponent({ programs, onProgramSelect }: MapComponentProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const markers = useRef<Map<string, mapboxgl.Marker>>(new Map())
  const popups = useRef<Map<string, mapboxgl.Popup>>(new Map())

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [2.3522, 48.8566], // Paris center
      zoom: 2,
      projection: 'globe' as any
    })

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right')

    // Add fullscreen control
    map.current.addControl(new mapboxgl.FullscreenControl(), 'top-right')

    // Wait for map to load before adding markers
    map.current.on('load', () => {
      console.log('Map loaded successfully')
    })

    return () => {
      // Cleanup
      markers.current.forEach(marker => marker.remove())
      popups.current.forEach(popup => popup.remove())
      markers.current.clear()
      popups.current.clear()
      
      if (map.current) {
        map.current.remove()
        map.current = null
      }
    }
  }, [])

  // Create marker element
  const createMarkerElement = useCallback((program: Program) => {
    const markerElement = document.createElement('div')
    markerElement.className = 'custom-marker'
    markerElement.innerHTML = `
      <div style="
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background-color: #2563eb;
        border: 2px solid white;
        cursor: pointer;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
      ">
        <div style="
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: white;
        "></div>
      </div>
    `

    const markerDiv = markerElement.firstElementChild as HTMLElement

    // Add hover effects
    markerElement.addEventListener('mouseenter', () => {
      if (markerDiv) {
        markerDiv.style.transform = 'scale(1.3)'
        markerDiv.style.backgroundColor = '#1d4ed8'
        markerDiv.style.boxShadow = '0 4px 12px rgba(0,0,0,0.4)'
      }
    })

    markerElement.addEventListener('mouseleave', () => {
      if (markerDiv) {
        markerDiv.style.transform = 'scale(1)'
        markerDiv.style.backgroundColor = '#2563eb'
        markerDiv.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)'
      }
    })

    // Add click handler
    markerElement.addEventListener('click', (e) => {
      e.stopPropagation()
      onProgramSelect(program)
    })

    return markerElement
  }, [onProgramSelect])

  // Create popup
  const createPopup = useCallback((program: Program) => {
    return new mapboxgl.Popup({
      offset: 25,
      closeButton: false,
      closeOnClick: false,
      className: 'custom-popup'
    }).setHTML(`
      <div style="padding: 12px; min-width: 200px;">
        <h3 style="font-weight: 600; font-size: 14px; margin-bottom: 4px; color: #1f2937;">
          ${program.school}
        </h3>
        <p style="font-size: 12px; color: #6b7280; margin-bottom: 2px;">
          ${program.name}
        </p>
        <p style="font-size: 11px; color: #9ca3af;">
          ${program.city}, ${program.country}
        </p>
      </div>
    `)
  }, [])

  // Update markers when programs change
  useEffect(() => {
    if (!map.current) return

    // Remove markers that are no longer needed
    const currentProgramIds = new Set(programs.map(p => p.id))
    markers.current.forEach((marker, id) => {
      if (!currentProgramIds.has(id)) {
        marker.remove()
        markers.current.delete(id)
        
        const popup = popups.current.get(id)
        if (popup) {
          popup.remove()
          popups.current.delete(id)
        }
      }
    })

    // Add or update markers
    programs.forEach(program => {
      const existingMarker = markers.current.get(program.id)
      
      if (!existingMarker) {
        // Create new marker
        const markerElement = createMarkerElement(program)
        const popup = createPopup(program)
        
        const marker = new mapboxgl.Marker({
          element: markerElement,
          anchor: 'center'
        })
          .setLngLat([program.longitude, program.latitude])
          .addTo(map.current!)

        // Add popup events
        markerElement.addEventListener('mouseenter', () => {
          popup.setLngLat([program.longitude, program.latitude]).addTo(map.current!)
        })

        markerElement.addEventListener('mouseleave', () => {
          popup.remove()
        })

        markers.current.set(program.id, marker)
        popups.current.set(program.id, popup)
      } else {
        // Update existing marker position if needed
        existingMarker.setLngLat([program.longitude, program.latitude])
      }
    })

    // Fit map to show all markers if there are programs
    if (programs.length > 0 && map.current.isStyleLoaded()) {
      const bounds = new mapboxgl.LngLatBounds()
      programs.forEach(program => {
        bounds.extend([program.longitude, program.latitude])
      })
      
      map.current.fitBounds(bounds, {
        padding: { top: 50, bottom: 50, left: 50, right: 50 },
        maxZoom: 8,
        duration: 1000
      })
    }
  }, [programs, createMarkerElement, createPopup])

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="w-full h-full" />
      
      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-full bg-primary-600 border-2 border-white shadow flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-white"></div>
          </div>
          <span className="text-sm text-gray-700 dark:text-gray-300">Masters Program</span>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Click markers for details
        </p>
      </div>

      {/* Program Count */}
      <div className="absolute top-4 left-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg px-3 py-2 border border-gray-200 dark:border-gray-700">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {programs.length} programs found
        </span>
      </div>

      {/* Map Style Toggle */}
      <div className="absolute top-4 right-16 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <button
          onClick={() => {
            if (map.current) {
              const currentStyle = map.current.getStyle().name
              const newStyle = currentStyle?.includes('light') 
                ? 'mapbox://styles/mapbox/dark-v10' 
                : 'mapbox://styles/mapbox/light-v11'
              map.current.setStyle(newStyle)
            }
          }}
          className="px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          Toggle Style
        </button>
      </div>
    </div>
  )
}