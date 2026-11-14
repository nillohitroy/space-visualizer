# Dancing with the SARs: Space Visualizer Platform

## Overview
**Space Visualizer** is a high-throughput web workstation designed to process, analyze, and visualize synthetic aperture radar (SAR) data from NASA and ISRO missions. 

By leveraging dual-band (L-Band and S-Band) radar telemetry, this platform bridges the gap between raw space agency data and interactive, client-side geospatial intelligence. It translates complex radar backscatter into intuitive AI classification masks and time-series telemetry, providing all-weather, real-time Earth observation insights.

## The Challenge
*   **Optical Blindness:** Traditional optical satellites are often useless during natural disasters due to cloud cover (e.g., monsoon floods) or surface obstruction (e.g., canopy cover hiding illegal logging).
*   **Data Accessibility Barrier:** Raw SAR files are massive, multi-megabyte raster arrays (HDF5/GeoTIFF) that standard web browsers cannot natively render without heavy, expensive backend server processing.

## Our Solution
We built a full-stack Next.js web application featuring a custom **client-side GeoTIFF canvas parser**. This engine bypasses browser rendering limitations, parsing heavy geospatial raster bands directly onto HTML5 canvases with zero server-side bottlenecks. 

Backed by a processing pipeline, the application allows users to interactively track surface changes, track natural disasters, and monitor human impact on the environment regardless of weather conditions.

## Key Features

*   **Global Observatory:** An interactive 3D Deck.GL globe where users can click any coordinate to define an Area of Interest (AOI) for real-time PolSAR feature extraction.
*   **Client-Side .TIF Engine:** Renders heavy raster files directly in the browser.
*   **ML TIF Split-Slider:** Directly compares raw satellite backscatter against unsupervised K-Means AI classification masks.
*   **Cloude-Pottier H/α Matrix:** An interactive scatter plot that analyzes surface and volume physics to determine physical scattering mechanisms.
*   **Public Story Maps:** Interactive sliders demonstrating radar's cloud penetration capabilities across global environmental crises.

## Core Scientific Frameworks Integrated

The platform applies robust scientific algorithms to the raw telemetry:
1.  **Radar Vegetation Index (RVI):** Quantifies biomass and canopy structure to track deforestation.
2.  **Dielectric Constant Analysis:** Detects standing water via specular reflection for immediate flood mapping.
3.  **InSAR Phase Unwrapping:** Measures millimeter-scale tectonic or aquifer deformation (e.g., ground subsidence).
4.  **H/α Decomposition:** Differentiates physical scattering mechanisms to track complex environmental changes (e.g., mangrove health).

## Target Beneficiaries & Impact
*   **Disaster Response Teams:** Receive immediate, all-weather flood inundation maps for precise rescue navigation.
*   **Environmental Agencies:** Detect under-canopy illegal logging proactively.
*   **Municipal Authorities:** Track infrastructure subsidence to prevent aqueduct and bridge failures.
*   **Scientific Communities:** Analyze polarimetric scattering behavior through an accessible web interface.

## Technology Stack
*   **Frontend:** Next.js (App Router), React, Tailwind CSS, Deck.GL (3D Globe), Recharts
*   **Geospatial Processing:** `geotiff` (JS library), Rasterio, NumPy, Dask, Scikit-Learn
*   **Data Sources:** NASA ASF DAAC, ISRO Bhoonidhi, NISAR L2-GCOV provisional granules

## References
*   NISAR Science Users' Handbook (2023). Jet Propulsion Laboratory, NASA/ISRO. JPL D-102551.
*   Kim, Y., et al. (2012). "Radar vegetation index for estimating the vegetation water content of rice and soybean." IEEE Geoscience and Remote Sensing Letters.
*   Cloude, S. R., & Pottier, E. (1997). "An entropy based classification scheme for random media scatterers." IEEE Transactions on Geoscience and Remote Sensing, 35(1), 68-78.