'use client'

import { useEffect, useRef, useCallback, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import { SchoolWithPrograms } from '../types/sheets'
import { clusterSchools, ClusterPoint } from '../lib/clustering'
import 'mapbox-gl/dist/mapbox-gl.css'

// Set your Mapbox token
mapboxgl.accessToken = 'pk.eyJ1Ijoib3NjYXJvbGl0byIsImEiOiJjbWhpeG56NXUwaWlwMmxxd3Y5OXp6NnJ3In0.ZQMFdoSg8V6Ptg76Sa3zoQ'

interface SheetMapComponentProps {
  schools: SchoolWithPrograms[]
  onSchoolSelect: (school: SchoolWithPrograms) => void
}

export default function SheetMapComponent({ schools, onSchoolSelect }: SheetMapComponentProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const markers = useRef<Map<string, mapboxgl.Marker>>(new Map())
  const popups = useRef<Map<string, mapboxgl.Popup>>(new Map())
  const [currentZoom, setCurrentZoom] = useState(2)
  const [clusters, setClusters] = useState<ClusterPoint[]>([])
  const [isTransitioning, setIsTransitioning] = useState(false)


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

    // Wait for map to load
    map.current.on('load', () => {
      console.log('Map loaded successfully')
    })

    // Listen for zoom changes (simplified)
    let zoomTimeout: NodeJS.Timeout
    map.current.on('zoomend', () => {
      if (map.current) {
        clearTimeout(zoomTimeout)
        const zoom = Math.round(map.current.getZoom())
        setCurrentZoom(zoom)
      }
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

  // Update clusters when schools or zoom changes (simplified)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const newClusters = clusterSchools(schools, currentZoom)
      setClusters(newClusters)
    }, 100) // Reduced delay for better responsiveness

    return () => clearTimeout(timeoutId)
  }, [schools, currentZoom])

  // Get cluster color based on school count
  const getClusterColor = useCallback((schoolCount: number) => {
    if (schoolCount <= 2) return { bg: '#10b981', border: '#059669' } // Green
    if (schoolCount <= 5) return { bg: '#f59e0b', border: '#d97706' } // Orange  
    if (schoolCount <= 10) return { bg: '#f97316', border: '#ea580c' } // Orange-red
    return { bg: '#dc2626', border: '#b91c1c' } // Red
  }, [])

  // Create cluster marker element
  const createClusterMarker = useCallback((cluster: ClusterPoint) => {
    const markerElement = document.createElement('div')
    markerElement.className = 'cluster-marker'
    
    const schoolCount = cluster.schools.length
    const colors = getClusterColor(schoolCount)
    
    // Size based on count
    const size = Math.min(60, Math.max(40, 30 + schoolCount * 2))
    
    markerElement.innerHTML = `
      <div style="
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background-color: ${colors.bg};
        border: 3px solid white;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        color: white;
        font-weight: bold;
        font-size: ${schoolCount > 99 ? '12px' : '16px'};
      ">
        ${schoolCount}
      </div>
    `

    const markerDiv = markerElement.firstElementChild as HTMLElement

    // Add hover effects
    markerElement.addEventListener('mouseenter', () => {
      if (markerDiv) {
        markerDiv.style.transform = 'scale(1.1)'
        markerDiv.style.boxShadow = '0 6px 16px rgba(0,0,0,0.4)'
      }
    })

    markerElement.addEventListener('mouseleave', () => {
      if (markerDiv) {
        markerDiv.style.transform = 'scale(1)'
        markerDiv.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)'
      }
    })

    // Add click handler for cluster - simple zoom
    markerElement.addEventListener('click', (e) => {
      e.stopPropagation()
      
      if (map.current && !isTransitioning) {
        setIsTransitioning(true)
        
        // Calculate bounds of schools in cluster
        const bounds = new mapboxgl.LngLatBounds()
        cluster.schools.forEach(school => {
          bounds.extend([school.longitude, school.latitude])
        })
        
        // Zoom to cluster with padding
        map.current.fitBounds(bounds, {
          padding: { top: 80, bottom: 80, left: 80, right: 80 },
          maxZoom: 11,
          duration: 600
        })
        
        // Reset transition state after animation
        setTimeout(() => {
          setIsTransitioning(false)
        }, 700)
      }
    })

    return markerElement
  }, [getClusterColor])

  // Create single school marker element
  const createMarkerElement = useCallback((school: SchoolWithPrograms) => {
    const markerElement = document.createElement('div')
    markerElement.className = 'custom-marker'
    
    const programCount = school.programs.length
    
    // Create marker with logo or fallback
    if (school.logo && school.logo.trim() !== '') {
      // Logo marker
      markerElement.innerHTML = `
        <div style="
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: white;
          border: 2px solid white;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        ">
          <img 
            src="${school.logo}" 
            alt="${school.name}"
            style="
              width: 32px;
              height: 32px;
              object-fit: contain;
              border-radius: 50%;
            "
            onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
          />
          <div style="
            display: none;
            width: 100%;
            height: 100%;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            font-weight: bold;
            color: #2563eb;
            background-color: #f3f4f6;
          ">
            ${school.name.charAt(0).toUpperCase()}
          </div>

        </div>
      `
    } else {
      // Fallback marker with school initial
      markerElement.innerHTML = `
        <div style="
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: #2563eb;
          border: 3px solid white;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          font-size: 16px;
          font-weight: bold;
          color: white;
        ">
          ${school.name.charAt(0).toUpperCase()}

        </div>
      `
    }

    const markerDiv = markerElement.firstElementChild as HTMLElement

    // Add hover effects
    markerElement.addEventListener('mouseenter', () => {
      if (markerDiv) {
        markerDiv.style.transform = 'scale(1.2)'
        markerDiv.style.boxShadow = '0 4px 12px rgba(0,0,0,0.4)'
      }
    })

    markerElement.addEventListener('mouseleave', () => {
      if (markerDiv) {
        markerDiv.style.transform = 'scale(1)'
        markerDiv.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)'
      }
    })

    // Add click handler
    markerElement.addEventListener('click', (e) => {
      e.stopPropagation()
      onSchoolSelect(school)
    })

    return markerElement
  }, [onSchoolSelect])

  // Create cluster popup
  const createClusterPopup = useCallback((cluster: ClusterPoint) => {
    const schoolsList = cluster.schools.slice(0, 3).map(school => 
      `<div style="padding: 2px 0;">
        <div style="font-weight: 600; font-size: 11px; color: #1f2937;">${school.name}</div>
        <div style="font-size: 9px; color: #6b7280;">${school.programs.length} programs</div>
      </div>`
    ).join('')
    
    const moreSchools = cluster.schools.length > 3 ? 
      `<div style="padding: 2px 0; font-size: 9px; color: #9ca3af; font-style: italic;">
        +${cluster.schools.length - 3} more schools
      </div>` : ''

    return new mapboxgl.Popup({
      offset: 25,
      closeButton: false,
      closeOnClick: false,
      className: 'cluster-popup'
    }).setHTML(`
      <div style="padding: 8px; min-width: 200px;">
        <div style="font-weight: 600; font-size: 12px; margin-bottom: 4px; color: #1f2937;">
          ${cluster.schools.length} Schools
        </div>
        <div>
          ${schoolsList}
          ${moreSchools}
        </div>
        <div style="margin-top: 4px; padding-top: 4px; border-top: 1px solid #e5e7eb; font-size: 9px; color: #9ca3af; text-align: center;">
          Click to zoom in
        </div>
      </div>
    `)
  }, [])

  // Create popup
  const createPopup = useCallback((school: SchoolWithPrograms) => {
    const programsList = school.programs.slice(0, 3).map(program => 
      `<li style="font-size: 11px; color: #6b7280; margin-bottom: 2px;">• ${program.name}</li>`
    ).join('')
    
    const morePrograms = school.programs.length > 3 ? 
      `<li style="font-size: 11px; color: #9ca3af;">• +${school.programs.length - 3} more programs</li>` : ''

    return new mapboxgl.Popup({
      offset: 25,
      closeButton: false,
      closeOnClick: false,
      className: 'custom-popup'
    }).setHTML(`
      <div style="padding: 12px; min-width: 250px;">
        <div style="display: flex; align-items: center; margin-bottom: 6px;">
          ${school.logo ? `<img src="${school.logo}" alt="${school.name}" style="width: 24px; height: 24px; margin-right: 8px; border-radius: 4px;">` : ''}
          <div>
            <h3 style="font-weight: 600; font-size: 14px; margin: 0; color: #1f2937;">
              ${school.name}
            </h3>
            <p style="font-size: 11px; color: #9ca3af; margin: 0;">
              ${school.country} • ${school.programs.length} programs
            </p>
          </div>
        </div>
        <ul style="margin: 0; padding: 0; list-style: none;">
          ${programsList}
          ${morePrograms}
        </ul>
        <p style="font-size: 10px; color: #9ca3af; margin: 6px 0 0 0; font-style: italic;">
          Click for details
        </p>
      </div>
    `)
  }, [])

  // Update markers when clusters change (simplified for stability)
  useEffect(() => {
    if (!map.current || clusters.length === 0) return

    // Clear all existing markers immediately
    markers.current.forEach(marker => marker.remove())
    popups.current.forEach(popup => popup.remove())
    markers.current.clear()
    popups.current.clear()

    // Add new markers
    clusters.forEach((cluster, index) => {
      const clusterId = `cluster-${index}`
      
      if (cluster.isCluster) {
        // Create cluster marker
        const markerElement = createClusterMarker(cluster)
        const popup = createClusterPopup(cluster)
        
        const marker = new mapboxgl.Marker({
          element: markerElement,
          anchor: 'center'
        })
          .setLngLat([cluster.longitude, cluster.latitude])
          .addTo(map.current!)

        // Add popup events
        markerElement.addEventListener('mouseenter', () => {
          popup.setLngLat([cluster.longitude, cluster.latitude]).addTo(map.current!)
        })

        markerElement.addEventListener('mouseleave', () => {
          popup.remove()
        })

        markers.current.set(clusterId, marker)
        popups.current.set(clusterId, popup)
      } else {
        // Create single school marker
        const school = cluster.schools[0]
        const markerElement = createMarkerElement(school)
        const popup = createPopup(school)
        
        const marker = new mapboxgl.Marker({
          element: markerElement,
          anchor: 'center'
        })
          .setLngLat([school.longitude, school.latitude])
          .addTo(map.current!)

        // Add popup events
        markerElement.addEventListener('mouseenter', () => {
          popup.setLngLat([school.longitude, school.latitude]).addTo(map.current!)
        })

        markerElement.addEventListener('mouseleave', () => {
          popup.remove()
        })

        markers.current.set(school.id, marker)
        popups.current.set(school.id, popup)
      }
    })

    // Only fit bounds on initial load
    if (currentZoom <= 3 && clusters.length > 0 && map.current.isStyleLoaded()) {
      const bounds = new mapboxgl.LngLatBounds()
      clusters.forEach(cluster => {
        bounds.extend([cluster.longitude, cluster.latitude])
      })
      
      map.current.fitBounds(bounds, {
        padding: { top: 50, bottom: 50, left: 50, right: 50 },
        maxZoom: 6,
        duration: 500
      })
    }
  }, [clusters, createMarkerElement, createPopup, createClusterMarker, createClusterPopup, currentZoom])

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="w-full h-full" />
      
      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 border border-gray-200 dark:border-gray-700">
        <h4 className="font-semibold text-sm text-gray-900 dark:text-white mb-2">Legend</h4>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-full bg-green-500 border-2 border-white shadow flex items-center justify-center text-white text-xs font-bold">
              2
            </div>
            <span className="text-xs text-gray-700 dark:text-gray-300">1-2 schools</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-full bg-yellow-500 border-2 border-white shadow flex items-center justify-center text-white text-xs font-bold">
              5
            </div>
            <span className="text-xs text-gray-700 dark:text-gray-300">3-5 schools</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-orange-500 border-2 border-white shadow flex items-center justify-center text-white text-xs font-bold">
              8
            </div>
            <span className="text-xs text-gray-700 dark:text-gray-300">6-10 schools</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-9 h-9 rounded-full bg-red-500 border-2 border-white shadow flex items-center justify-center text-white text-xs font-bold">
              15
            </div>
            <span className="text-xs text-gray-700 dark:text-gray-300">10+ schools</span>
          </div>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          Click clusters to zoom in and separate schools
        </p>
      </div>

      {/* School Count */}
      <div className="absolute top-4 left-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg px-3 py-2 border border-gray-200 dark:border-gray-700">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {schools.length} schools • {schools.reduce((sum, school) => sum + school.programs.length, 0)} programs
        </span>
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Zoom: {Math.round(currentZoom)} • {clusters.filter(c => c.isCluster).length} clusters
        </div>
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