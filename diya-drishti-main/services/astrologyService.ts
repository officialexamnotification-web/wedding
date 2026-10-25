import { ChartResponse, BirthDetailsForm, MatchMakingDetails } from '../types';
import { LocationResult } from './locationService';

const getBackendUrl = () => {
    if (typeof window !== 'undefined' && ['localhost', '127.0.0.1'].includes(window.location.hostname)) {
        return 'http://localhost:8000';
    }
    const env = (import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env;
    return env?.VITE_ASTRO_API_URL?.replace(/\/$/, '') || '';
};

const BACKEND_URL = getBackendUrl();

async function request<T>(path: string, body: unknown): Promise<T> {
    let response: Response;
    try {
        response = await fetch(`${BACKEND_URL}${path}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });
    } catch {
        throw new Error('Astrology calculation service is unreachable. Please try again when the calculation service is online.');
    }

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
        const message = typeof payload.detail === 'string' ? payload.detail : 'The calculation service could not produce a verified result.';
        throw new Error(message);
    }
    return payload as T;
}

function birthPayload(date: string, time: string, location: string, latitude: number, longitude: number) {
    if (!date || !time || !location.trim() || !Number.isFinite(latitude) || !Number.isFinite(longitude)) {
        throw new Error('Enter the birth date and time, then select a birth place from the location suggestions.');
    }
    return { date, time, location, latitude, longitude };
}

export const fetchChartData = (details: BirthDetailsForm): Promise<ChartResponse> =>
    request<ChartResponse>('/calculate_chart', birthPayload(
        details.date, details.time, details.location, details.latitude, details.longitude,
    ));

export interface MatchMakingResult {
    score: number;
    total: number;
    verdict: string;
    nadi_dosha: boolean;
    description: string;
    bhakoot_dosha: boolean;
    method: string;
    kootas: Array<{ name: string; score: number; max: number }>;
    notes: string[];
    boy_moon: { sign: string; nakshatra: { name: string; pada: number } };
    girl_moon: { sign: string; nakshatra: { name: string; pada: number } };
}

export const fetchMatchMaking = async (details: MatchMakingDetails & { boyPlace: LocationResult; girlPlace: LocationResult }): Promise<MatchMakingResult> => {
    if (!details.boyLocation.trim() || !details.girlLocation.trim() || !details.boyPlace || !details.girlPlace) {
        throw new Error('Enter both birth places and select each place from the location suggestions.');
    }
    return request<MatchMakingResult>('/calculate_match_making', {
        boy: { date: details.boyDate, time: details.boyTime, location: details.boyLocation, latitude: details.boyPlace.lat, longitude: details.boyPlace.lon },
        girl: { date: details.girlDate, time: details.girlTime, location: details.girlLocation, latitude: details.girlPlace.lat, longitude: details.girlPlace.lon },
    });
};
