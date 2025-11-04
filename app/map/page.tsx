'use client'

import { useState } from 'react'
import Link from 'next/link'
import { MapPin, Filter, Search, Grid, List, User, LogOut } from 'lucide-react'

// Données de démonstration des programmes
const demoPrograms = [
  {
    id: '1',
    name: 'MSc Finance',
    university: 'London School of Economics',
    country: 'United Kingdom',
    city: 'London',
    duration: '12 months',
    tuition: '£32,000',
    ranking: 3,
    coordinates: [51.5074, -0.1278]
  },
  {
    id: '2',
    name: 'Master in Finance',
    university: 'HEC Paris',
    country: 'France',
    city: 'Paris',
    duration: '16 months',
    tuition: '€39,000',
    ranking: 5,
    coordinates: [48.8566, 2.3522]
  },
  {
    id: '3',
    name: 'MSc Financial Economics',
    university: 'University of Oxford',
    country: 'United Kingdom',
    city: 'Oxford',
    duration: '9 months',
    tuition: '£35,000',
    ranking: 1,
    coordinates: [51.7520, -1.2577]
  },
  {
    id: '4',
    name: 'Master in Finance',
    university: 'INSEAD',
    country: 'France',
    city: 'Fontainebleau',
    duration: '10 months',
    tuition: '€89,000',
    ranking: 2,
    coordinates: [48.4084, 2.7019]
  },
  {
    id: '5',
    name: 'MSc Finance',
    university: 'Imperial College London',
    country: 'United Kingdom',
    city: 'London',
    duration: '12 months',
    tuition: '£34,500',
    ranking: 4,
    coordinates: [51.4988, -0.1749]
  }
]

export default function MapPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCountry, setSelectedCountry] = useState('')
  const [viewMode, setViewMode] = useState<'map' | 'list'>('list')
  const [selectedProgram, setSelectedProgram] = useState<any>(null)

  const countries = [...new Set(demoPrograms.map(p => p.country))]
  
  const filteredPrograms = demoPrograms.filter(program => {
    const matchesSearch = program.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         program.university.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         program.city.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCountry = !selectedCountry || program.country === selectedCountry
    return matchesSearch && matchesCountry
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-2">
              <MapPin className="h-8 w-8 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">Study Map</h1>
            </Link>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Free Plan: 3/5 views</span>
                <Link href="/pricing" className="text-sm bg-blue-600 text-white px-3 py-1 rounded-full hover:bg-blue-700">
                  Upgrade
                </Link>
              </div>
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-600">Demo User</span>
                <button className="text-gray-400 hover:text-gray-600">
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search programs, universities, or cities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            {/* Country Filter */}
            <div className="lg:w-48">
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Countries</option>
                {countries.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            </div>
            
            {/* View Mode */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center space-x-2 px-3 py-1 rounded ${
                  viewMode === 'list' ? 'bg-white shadow-sm' : ''
                }`}
              >
                <List className="h-4 w-4" />
                <span className="text-sm">List</span>
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`flex items-center space-x-2 px-3 py-1 rounded ${
                  viewMode === 'map' ? 'bg-white shadow-sm' : ''
                }`}
              >
                <Grid className="h-4 w-4" />
                <span className="text-sm">Map</span>
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Programs List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-4 border-b">
                <h2 className="text-lg font-semibold text-gray-900">
                  {filteredPrograms.length} Programs Found
                </h2>
              </div>
              
              <div className="divide-y">
                {filteredPrograms.map((program) => (
                  <div
                    key={program.id}
                    className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => setSelectedProgram(program)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {program.name}
                        </h3>
                        <p className="text-blue-600 font-medium mb-2">
                          {program.university}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>📍 {program.city}, {program.country}</span>
                          <span>⏱️ {program.duration}</span>
                          <span>💰 {program.tuition}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium">
                          Rank #{program.ranking}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Program Details */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-6">
              {selectedProgram ? (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Program Details
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900">{selectedProgram.name}</h4>
                      <p className="text-blue-600">{selectedProgram.university}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Location</span>
                        <p className="font-medium">{selectedProgram.city}, {selectedProgram.country}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Duration</span>
                        <p className="font-medium">{selectedProgram.duration}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Tuition</span>
                        <p className="font-medium">{selectedProgram.tuition}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Ranking</span>
                        <p className="font-medium">#{selectedProgram.ranking}</p>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t">
                      <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                        View Full Details
                      </button>
                      <p className="text-xs text-gray-500 mt-2 text-center">
                        This will count as 1 program view
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500">
                  <MapPin className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Select a program to view details</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}