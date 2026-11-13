"use client";

import React, { useState, useEffect } from 'react';
import DeckGL from '@deck.gl/react';
import { _GlobeView as GlobeView } from '@deck.gl/core';
import { TileLayer } from '@deck.gl/geo-layers';
import { BitmapLayer, PolygonLayer, ScatterplotLayer } from '@deck.gl/layers';

// FIX: Define the 3D view camera OUTSIDE the component to prevent infinite React re-renders
const GLOBE_VIEW = new GlobeView({ id: 'globe', resolution: 2 });

export default function InteractiveGlobe({ onScanTarget }: { onScanTarget?: (coords: number[]) => void }) {
  const [activeTarget, setActiveTarget] = useState<{ lon: number, lat: number } | null>(null);
  
  const [viewState, setViewState] = useState({
    longitude: 78.9629,
    latitude: 20.5937,
    zoom: 2.5,
    minZoom: 1.5, 
    maxZoom: 12,
    pitch: 15,
  });

  const [isInteracting, setIsInteracting] = useState(false);

  // Auto-rotate the globe slowly when idle
  useEffect(() => {
    let animationFrame: number;
    const rotate = () => {
      if (!isInteracting && !activeTarget) {
        setViewState((v) => ({ ...v, longitude: v.longitude + 0.05 }));
      }
      animationFrame = requestAnimationFrame(rotate);
    };
    rotate();
    return () => cancelAnimationFrame(animationFrame);
  }, [isInteracting, activeTarget]);

  // Esri World Imagery: High-res satellite, 100% free, no API key required
  const baseMapLayer = new TileLayer({
    id: 'base-map',
    data: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    minZoom: 0,
    maxZoom: 19,
    tileSize: 256,
    renderSubLayers: (props) => {
      // Typecast bbox to resolve TS2339
      const bbox = props.tile.bbox as { west: number; south: number; east: number; north: number };
      const { west, south, east, north } = bbox;
      return new BitmapLayer(props, {
        data: undefined, // Replaced null with undefined to resolve TS2322
        image: props.data,
        bounds: [west, south, east, north],
      });
    },
  });

  // Perfectly centered 1x1 degree bounding box based on exact click
  const dynamicBoxLayer = activeTarget ? new PolygonLayer({
    id: 'dynamic-box',
    data: [{
      polygon: [
        [activeTarget.lon - 1.5, activeTarget.lat - 1.5],
        [activeTarget.lon + 1.5, activeTarget.lat - 1.5],
        [activeTarget.lon + 1.5, activeTarget.lat + 1.5],
        [activeTarget.lon - 1.5, activeTarget.lat + 1.5],
        [activeTarget.lon - 1.5, activeTarget.lat - 1.5]
      ]
    }],
    pickable: false,
    stroked: true,
    filled: true,
    lineWidthMinPixels: 2,
    getPolygon: (d: any) => d.polygon,
    getFillColor: [0, 242, 254, 30], 
    getLineColor: [0, 242, 254, 255],
  }) : null;

  // Precision center dot for the AOI (Area of Interest)
  const centerDotLayer = activeTarget ? new ScatterplotLayer({
    id: 'center-dot',
    data: [{ position: [activeTarget.lon, activeTarget.lat] }],
    getPosition: (d: any) => d.position,
    getFillColor: [0, 242, 254, 255],
    getRadius: 30000, 
    radiusMinPixels: 4,
    radiusMaxPixels: 10,
  }) : null;

  const handleMapClick = (info: any) => {
    if (info.coordinate) {
      const [lon, lat] = info.coordinate;
      setActiveTarget({ lon, lat });
      
      // Gently pan the camera to center the clicked target
      setViewState(v => ({
        ...v,
        longitude: lon,
        latitude: lat,
        transitionDuration: 1000,
      }));

      if (onScanTarget) onScanTarget([lon, lat]);
    }
  };

  return (
    <div 
      className="absolute inset-0 z-0 bg-space-950 cursor-crosshair"
      onMouseDown={() => setIsInteracting(true)}
      onMouseUp={() => setIsInteracting(false)}
      onTouchStart={() => setIsInteracting(true)}
      onTouchEnd={() => setIsInteracting(false)}
    >
      <DeckGL
        views={GLOBE_VIEW}
        viewState={viewState}
        onViewStateChange={({ viewState }) => setViewState(viewState as any)}
        controller={true}
        layers={[baseMapLayer, dynamicBoxLayer, centerDotLayer].filter(Boolean)}
        onClick={handleMapClick}
      />
    </div>
  );
}