import { SchoolWithPrograms } from '../types/sheets'

export interface ClusterPoint {
  latitude: number
  longitude: number
  schools: SchoolWithPrograms[]
  isCluster: boolean
}

// Distance threshold in kilometers for clustering
const CLUSTER_DISTANCE_KM = 100

// Calculate distance between two points using Haversine formula
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371 // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}

// Optimized clustering algorithm with caching
const clusterCache = new Map<string, ClusterPoint[]>()

export function clusterSchools(schools: SchoolWithPrograms[], zoomLevel: number): ClusterPoint[] {
  if (schools.length === 0) return []

  // Create cache key (simplified for better performance)
  const cacheKey = `${schools.length}-${zoomLevel}`
  
  // Return cached result if available (but not for high zoom levels to ensure responsiveness)
  if (zoomLevel < 8 && clusterCache.has(cacheKey)) {
    return clusterCache.get(cacheKey)!
  }

  // Disable clustering at high zoom levels for performance
  if (zoomLevel >= 9) {
    const individualClusters = schools.map(school => ({
      latitude: school.latitude,
      longitude: school.longitude,
      schools: [school],
      isCluster: false
    }))
    clusterCache.set(cacheKey, individualClusters)
    return individualClusters
  }

  // Adjust clustering distance based on zoom level
  const adjustedDistance = CLUSTER_DISTANCE_KM * Math.max(0.2, (9 - zoomLevel) / 9)
  
  const clusters: ClusterPoint[] = []
  const processed = new Set<string>()

  schools.forEach(school => {
    if (processed.has(school.id)) return

    const cluster: ClusterPoint = {
      latitude: school.latitude,
      longitude: school.longitude,
      schools: [school],
      isCluster: false
    }

    // Find nearby schools (optimized loop)
    for (const otherSchool of schools) {
      if (otherSchool.id === school.id || processed.has(otherSchool.id)) continue

      const distance = calculateDistance(
        school.latitude, school.longitude,
        otherSchool.latitude, otherSchool.longitude
      )

      if (distance <= adjustedDistance) {
        cluster.schools.push(otherSchool)
        processed.add(otherSchool.id)
      }
    }

    // Mark as cluster if it contains multiple schools
    if (cluster.schools.length > 1) {
      cluster.isCluster = true
      // Calculate center point of cluster
      const avgLat = cluster.schools.reduce((sum, s) => sum + s.latitude, 0) / cluster.schools.length
      const avgLng = cluster.schools.reduce((sum, s) => sum + s.longitude, 0) / cluster.schools.length
      cluster.latitude = avgLat
      cluster.longitude = avgLng
    }

    processed.add(school.id)
    clusters.push(cluster)
  })

  // Cache result (limit cache size)
  if (clusterCache.size > 10) {
    clusterCache.clear()
  }
  clusterCache.set(cacheKey, clusters)

  return clusters
}

// Get cluster bounds for fitting map view
export function getClusterBounds(clusters: ClusterPoint[]) {
  if (clusters.length === 0) return null

  let minLat = clusters[0].latitude
  let maxLat = clusters[0].latitude
  let minLng = clusters[0].longitude
  let maxLng = clusters[0].longitude

  clusters.forEach(cluster => {
    minLat = Math.min(minLat, cluster.latitude)
    maxLat = Math.max(maxLat, cluster.latitude)
    minLng = Math.min(minLng, cluster.longitude)
    maxLng = Math.max(maxLng, cluster.longitude)
  })

  return { minLat, maxLat, minLng, maxLng }
}