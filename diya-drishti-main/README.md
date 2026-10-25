# Divya Drishti - Astrology Tools

A React and Python astrology project. Birth-chart positions and Ashtakoota chart inputs are computed in the local Python backend with `pyswisseph` (Swiss Ephemeris). No external astrology calculation API or astrology API key is used. Astrological interpretations are traditional belief-based content, not scientifically established predictions.

## Features

- **Janampatri** - Local Swiss Ephemeris calculations in Lahiri sidereal mode, with whole-sign houses and mean lunar nodes
- **Kundali Matching** - Deterministic Moon-based Ashtakoota score using one documented North Indian table convention; regional tables and cancellation rules vary
- **Numerology and gemstone pages** - Local deterministic calculations/traditional associations; these are not scientific or personalized professional advice
- **Multi-language support** - English, Hindi, Marathi, Bengali, Gujarati, Tamil, Telugu, Kannada and Malayalam
- **Print-ready reports**

## Run locally

Prerequisites: Node.js and Python 3.10+.

```bash
npm install
cd backend
python -m pip install -r requirements.txt
python main_simple.py
```

In a second terminal, from the project root:

```bash
npm run dev
```

The Vite frontend runs on `http://localhost:5173`; the FastAPI calculation backend runs on `http://localhost:8000`. `services/astrologyService.ts` points local browser sessions to port 8000. For a separately hosted frontend/backend, set `VITE_ASTRO_API_URL` at frontend build time and set `ASTRO_ALLOWED_ORIGINS` on the backend to the exact frontend origins.

## Calculation conventions and limits

- The backend computes chart positions locally with the Swiss Ephemeris Python binding. Lahiri ayanamsa and whole-sign houses are used; Rahu is the mean lunar node and Ketu is opposite it.
- Birth time is treated as local civil time at the selected coordinates. `timezonefinder` resolves the IANA timezone and `tzdata` supplies timezone rules. Incorrect birth time or place can change ascendant, houses and Moon-based matching.
- Swiss Ephemeris can use its Moshier fallback if the compressed Swiss ephemeris data files are not present. The selected engine/flags should be checked for the deployed runtime if Swiss-file mode is required.
- Ashtakoota totals use one stated convention; they are not universal or a marriage decision. Consult an experienced practitioner for tradition-specific interpretation.
- Location suggestions use OpenStreetMap Nominatim over the internet. This is only geocoding; planetary calculations and matching are local and do not call CosmyDay or another astrology service.
- No result is promised to be “perfect.” Validate important charts against a trusted reference using the same timezone, Lahiri mode, node convention and house system.

## Swiss Ephemeris licensing

Swiss Ephemeris is dual-licensed. Before distributing software containing it or activating a public service, its developer must choose and comply with either the AGPL or the Swiss Ephemeris Professional License. AGPL has source-availability obligations; the professional license is paid. Review the [official Swiss Ephemeris licensing terms](https://www.astro.com/swisseph/swisseph.htm) and obtain legal advice for the intended deployment. This repository does not claim that public/commercial deployment is license-cleared.

## Structure

- `backend/main_simple.py` - Local chart and matching calculations
- `backend/main.py` - Backward-compatible FastAPI entry point
- `components/` - React UI
- `services/` - Frontend calculation and location services

## License

This application is licensed under the GNU Affero General Public License, version 3 or later. See [`LICENSE`](LICENSE). The local Swiss Ephemeris integration uses the AGPL licensing option; this release does not use the separately paid Professional License. The public app footer links to the complete source repository for users interacting with the hosted service.
