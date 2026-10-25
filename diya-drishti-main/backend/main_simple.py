"""Vedic astrology calculations using the local Swiss Ephemeris engine."""
from datetime import datetime
import os
from zoneinfo import ZoneInfo, ZoneInfoNotFoundError
from typing import Any

import swisseph as swe
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, field_validator
from timezonefinder import TimezoneFinder

app = FastAPI(title="Divya Drishti Astrology API")
TIMEZONE_FINDER = TimezoneFinder()
allowed_origins = [origin.strip() for origin in os.getenv(
    "ASTRO_ALLOWED_ORIGINS",
    "https://invitationcards.site,https://www.invitationcards.site,http://localhost:3000,http://127.0.0.1:3000,http://localhost:3001,http://127.0.0.1:3001,http://localhost:5173,http://127.0.0.1:5173",
).split(",") if origin.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)

SIGNS = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
         "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"]
PLANETS = ["Sun", "Moon", "Mercury", "Venus", "Mars", "Jupiter", "Saturn"]
NAKSHATRAS = ["Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra",
              "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni",
              "Uttara Phalguni", "Hasta", "Chitra", "Swati", "Vishakha",
              "Anuradha", "Jyeshtha", "Mula", "Purva Ashadha", "Uttara Ashadha",
              "Shravana", "Dhanishta", "Shatabhisha", "Purva Bhadrapada",
              "Uttara Bhadrapada", "Revati"]
NAK_SIZE = 360.0 / 27.0
NAK_GANA = ["Deva", "Manushya", "Rakshasa", "Manushya", "Deva", "Manushya", "Deva", "Deva", "Rakshasa",
            "Rakshasa", "Manushya", "Manushya", "Deva", "Rakshasa", "Deva", "Rakshasa", "Deva", "Rakshasa",
            "Rakshasa", "Manushya", "Manushya", "Deva", "Rakshasa", "Rakshasa", "Manushya", "Manushya", "Deva"]
NAK_NADI = ["Adi", "Madhya", "Antya", "Antya", "Madhya", "Adi", "Adi", "Madhya", "Antya",
            "Antya", "Madhya", "Adi", "Adi", "Madhya", "Antya", "Antya", "Madhya", "Adi",
            "Adi", "Madhya", "Antya", "Antya", "Madhya", "Adi", "Adi", "Madhya", "Antya"]
NAK_YONI = ["Horse", "Elephant", "Sheep", "Serpent", "Serpent", "Dog", "Cat", "Sheep", "Cat",
            "Rat", "Rat", "Cow", "Buffalo", "Tiger", "Buffalo", "Tiger", "Deer", "Deer", "Dog",
            "Monkey", "Mongoose", "Monkey", "Lion", "Horse", "Lion", "Cow", "Elephant"]
# One North Indian Ashtakoota convention. Yoni and Vashya tables differ by source.
YONIS = ["Horse", "Elephant", "Sheep", "Serpent", "Dog", "Cat", "Rat", "Cow", "Buffalo", "Tiger", "Deer", "Monkey", "Mongoose", "Lion"]
YONI_POINTS = [
 [4,2,3,2,2,3,3,3,0,1,3,2,2,1], [2,4,3,2,2,3,3,3,3,2,2,2,2,0],
 [3,3,4,3,2,3,1,3,3,1,3,0,3,1], [2,2,3,4,2,2,1,1,2,2,2,2,0,2],
 [2,2,2,2,4,1,1,2,2,1,0,2,2,1], [2,2,3,2,1,4,0,2,2,1,2,2,2,2],
 [2,2,2,1,1,0,4,2,2,2,2,2,2,1], [3,2,3,1,2,2,2,4,3,0,3,2,3,1],
 [0,3,3,2,2,2,2,3,4,1,2,2,2,3], [1,2,1,2,1,1,2,0,1,4,2,1,2,2],
 [3,2,3,2,0,2,2,3,2,1,4,2,2,2], [2,3,0,2,2,2,2,2,2,1,2,4,2,3],
 [2,2,3,0,2,2,2,3,2,2,2,2,4,2], [1,0,1,2,1,2,1,1,3,2,2,2,2,4]
]
GANA_POINTS = {"Deva": {"Deva": 6, "Manushya": 5, "Rakshasa": 1},
               "Manushya": {"Deva": 6, "Manushya": 6, "Rakshasa": 0},
               "Rakshasa": {"Deva": 0, "Manushya": 0, "Rakshasa": 6}}
VASHYA_GROUP = {1: "Chatushpada", 2: "Chatushpada", 3: "Dvipada", 4: "Jalachara",
                5: "Chatushpada", 6: "Dvipada", 7: "Dvipada", 8: "Keeta",
                9: "Chatushpada", 10: "Jalachara", 11: "Jalachara", 12: "Jalachara"}
VASHYA_ORDER = ["Dvipada", "Chatushpada", "Jalachara", "Keeta"]
VASHYA_POINTS = [[2, .5, .5, 1], [.5, 2, 2, 2], [.5, 2, 2, 2], [1, 2, 2, 2]]
SIGN_LORDS = ["Mars", "Venus", "Mercury", "Moon", "Sun", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Saturn", "Jupiter"]
FRIENDS = {"Sun": {"Moon", "Mars", "Jupiter"}, "Moon": {"Sun", "Mercury"},
           "Mars": {"Sun", "Moon", "Jupiter"}, "Mercury": {"Sun", "Venus"},
           "Jupiter": {"Sun", "Moon", "Mars"}, "Venus": {"Mercury", "Saturn"},
           "Saturn": {"Mercury", "Venus"}}
ENEMIES = {"Sun": {"Venus", "Saturn"}, "Moon": set(), "Mars": {"Mercury"},
           "Mercury": {"Moon"}, "Jupiter": {"Mercury", "Venus"},
           "Venus": {"Sun", "Moon"}, "Saturn": {"Sun", "Moon", "Mars"}}


class BirthDetails(BaseModel):
    date: str
    time: str
    latitude: float = Field(ge=-90, le=90)
    longitude: float = Field(ge=-180, le=180)
    location: str = Field(min_length=2, max_length=200)

    @field_validator("date")
    @classmethod
    def valid_date(cls, value: str) -> str:
        try:
            datetime.strptime(value, "%Y-%m-%d")
        except ValueError as exc:
            raise ValueError("Birth date must be YYYY-MM-DD") from exc
        return value

    @field_validator("time")
    @classmethod
    def valid_time(cls, value: str) -> str:
        try:
            datetime.strptime(value, "%H:%M")
        except ValueError as exc:
            raise ValueError("Birth time must be HH:MM") from exc
        return value


class MatchPerson(BirthDetails):
    pass


class MatchDetails(BaseModel):
    boy: MatchPerson
    girl: MatchPerson


def _sign(longitude: float) -> tuple[int, str, float]:
    normalized = longitude % 360.0
    index = int(normalized // 30)
    return index, SIGNS[index], normalized % 30


def _nakshatra(longitude: float) -> dict[str, Any]:
    pos = longitude % 360.0
    index = min(26, int(pos / NAK_SIZE))
    pada = min(4, int((pos - index * NAK_SIZE) / (NAK_SIZE / 4)) + 1)
    lords = ["Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury"]
    nadis = NAK_NADI
    return {"index": index, "name": NAKSHATRAS[index], "pada": pada,
            "lord": lords[index % 9], "gana": NAK_GANA[index], "nadi": nadis[index]}


def _make_planet(name: str, longitude: float, asc_sign: int, retrograde: bool) -> dict[str, Any]:
    sign_index, sign_name, degree = _sign(longitude)
    return {
        "name": name, "absolute_degree": longitude % 360,
        "sign": sign_name, "sign_id": sign_index + 1, "degree": degree,
        "is_retrograde": retrograde, "house": ((sign_index - asc_sign) % 12) + 1,
        "nakshatra": _nakshatra(longitude),
    }


def _ashtakoota_scores(boy: dict[str, Any], girl: dict[str, Any]) -> tuple[list[dict[str, Any]], list[str], bool, bool]:
    """Deterministic Moon-based score using the named table convention above."""
    boy_moon = next((p for p in boy["planets"] if p["name"] == "Moon"), None)
    girl_moon = next((p for p in girl["planets"] if p["name"] == "Moon"), None)
    if not boy_moon or not girl_moon:
        raise HTTPException(status_code=502, detail="Moon positions are required for Ashtakoota matching.")

    bi, gi = boy_moon["nakshatra"]["index"], girl_moon["nakshatra"]["index"]
    bs, gs = boy_moon["sign_id"], girl_moon["sign_id"]
    # Rashi varna order: water, fire, earth, air (Brahmin, Kshatriya, Vaishya, Shudra).
    varna_rank = {1: 3, 2: 2, 3: 1, 4: 4, 5: 3, 6: 2, 7: 1, 8: 4, 9: 3, 10: 2, 11: 1, 12: 4}
    vashya_row, vashya_col = VASHYA_ORDER.index(VASHYA_GROUP[gs]), VASHYA_ORDER.index(VASHYA_GROUP[bs])

    def tara_good(start: int, end: int) -> bool:
        tara_number = ((end - start) % 27) % 9 + 1
        return tara_number not in (3, 5, 7)

    tara_points = (int(tara_good(gi, bi)) + int(tara_good(bi, gi))) * 1.5
    yoni_row, yoni_col = YONIS.index(NAK_YONI[gi]), YONIS.index(NAK_YONI[bi])
    lord_girl, lord_boy = SIGN_LORDS[gs - 1], SIGN_LORDS[bs - 1]

    def relation(first: str, second: str) -> str:
        if second in FRIENDS[first]:
            return "friend"
        if second in ENEMIES[first]:
            return "enemy"
        return "neutral"

    relation_girl, relation_boy = relation(lord_girl, lord_boy), relation(lord_boy, lord_girl)
    if lord_girl == lord_boy or (relation_girl == relation_boy == "friend"):
        maitri = 5
    elif {relation_girl, relation_boy} == {"friend", "neutral"}:
        maitri = 4
    elif relation_girl == relation_boy == "neutral":
        maitri = 3
    elif {relation_girl, relation_boy} == {"friend", "enemy"}:
        maitri = 1
    elif {relation_girl, relation_boy} == {"neutral", "enemy"}:
        maitri = .5
    else:
        maitri = 0

    raw_bhakoot = (bs - gs) % 12 in (1, 4, 5, 7, 8, 11)
    same_nadi = NAK_NADI[gi] == NAK_NADI[bi]
    same_rashi = bs == gs
    same_nakshatra = bi == gi
    different_pada = boy_moon["nakshatra"]["pada"] != girl_moon["nakshatra"]["pada"]
    nadi_exception = (same_rashi and not same_nakshatra) or (same_nakshatra and not same_rashi) or (same_rashi and same_nakshatra and different_pada)
    nadi_dosha = same_nadi and not nadi_exception
    mutual_lord_friends = lord_boy in FRIENDS[lord_girl] and lord_girl in FRIENDS[lord_boy]
    bhakoot_exception = raw_bhakoot and (lord_boy == lord_girl or mutual_lord_friends) and not nadi_dosha
    bhakoot_dosha = raw_bhakoot and not bhakoot_exception
    scores = [
        {"name": "Varna", "score": 1 if varna_rank[bs] >= varna_rank[gs] else 0, "max": 1},
        {"name": "Vashya", "score": VASHYA_POINTS[vashya_row][vashya_col], "max": 2},
        {"name": "Tara (Dina)", "score": tara_points, "max": 3},
        {"name": "Yoni", "score": YONI_POINTS[yoni_row][yoni_col], "max": 4},
        {"name": "Graha Maitri", "score": maitri, "max": 5},
        {"name": "Gana", "score": GANA_POINTS[NAK_GANA[gi]][NAK_GANA[bi]], "max": 6},
        {"name": "Bhakoot (Rashi)", "score": 0 if bhakoot_dosha else 7, "max": 7},
        {"name": "Nadi", "score": 0 if same_nadi else 8, "max": 8},
    ]
    notes = []
    if nadi_dosha:
        notes.append("Same Nadi is flagged. This selected table's exceptions depend on sign, nakshatra and pada; consult a qualified practitioner.")
    elif same_nadi and nadi_exception:
        notes.append("Same Nadi occurs, but the selected tradition lists a sign/nakshatra/pada exception. The raw Nadi score remains unchanged.")
    if bhakoot_dosha:
        notes.append("Bhakoot relation is flagged. This selected tradition has cancellation conditions; review the full chart with a qualified practitioner.")
    elif bhakoot_exception:
        notes.append("Bhakoot relation is present, with a possible cancellation under the selected tradition because the sign lords are the same or mutual friends and Nadi is clear.")
    return scores, notes, nadi_dosha, bhakoot_dosha


def _birth_julian_day(details: BirthDetails) -> tuple[float, str]:
    try:
        zone = TIMEZONE_FINDER.timezone_at(lng=details.longitude, lat=details.latitude)
        if not zone:
            raise ValueError("Could not determine the birth place time zone from its coordinates")
        local = datetime.strptime(f"{details.date} {details.time}", "%Y-%m-%d %H:%M").replace(tzinfo=ZoneInfo(zone))
        utc = local.astimezone(ZoneInfo("UTC"))
        utc_hour = utc.hour + utc.minute / 60 + utc.second / 3600 + utc.microsecond / 3_600_000_000
        return swe.julday(utc.year, utc.month, utc.day, utc_hour), zone
    except (ValueError, ZoneInfoNotFoundError) as exc:
        raise HTTPException(status_code=422, detail=f"Invalid birth time or place time zone: {exc}") from exc


@app.get("/")
def root():
    return {"message": "Divya Drishti local calculations", "engine": "Swiss Ephemeris (pyswisseph)", "zodiac": "Lahiri sidereal", "houses": "Whole sign", "external_ephemeris_api": False}


@app.post("/calculate_chart")
def calculate_chart(details: BirthDetails):
    jd, zone = _birth_julian_day(details)
    swe.set_sid_mode(swe.SIDM_LAHIRI)
    ayanamsa = swe.get_ayanamsa_ut(jd)
    flags = swe.FLG_SWIEPH | swe.FLG_SIDEREAL | swe.FLG_SPEED
    try:
        house_data = swe.houses_ex(jd, details.latitude, details.longitude, b"W", swe.FLG_SIDEREAL)
        asc_long = house_data[1][0] % 360
        asc_sign, _, _ = _sign(asc_long)
        ascendant = _make_planet("Ascendant", asc_long, asc_sign, False)
        planets = []
        bodies = [(swe.SUN, "Sun"), (swe.MOON, "Moon"), (swe.MERCURY, "Mercury"),
                  (swe.VENUS, "Venus"), (swe.MARS, "Mars"), (swe.JUPITER, "Jupiter"), (swe.SATURN, "Saturn")]
        engine_flags = []
        for body, name in bodies:
            values, returned_flags = swe.calc_ut(jd, body, flags)
            engine_flags.append(returned_flags)
            planets.append(_make_planet(name, values[0], asc_sign, values[3] < 0))
        node_values, node_flags = swe.calc_ut(jd, swe.MEAN_NODE, flags)
        engine_flags.append(node_flags)
        rahu = _make_planet("Rahu", node_values[0], asc_sign, node_values[3] < 0)
        ketu = _make_planet("Ketu", (node_values[0] + 180) % 360, asc_sign, node_values[3] < 0)
        planets.extend([rahu, ketu])
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"Local Swiss Ephemeris calculation failed: {exc}") from exc
    moon = next(planet for planet in planets if planet["name"] == "Moon")
    engine = "Swiss Ephemeris files" if all(item & swe.FLG_SWIEPH for item in engine_flags) else "Moshier fallback (Swiss Ephemeris library)"
    return {"ascendant": ascendant, "planets": planets, "ayanamsa": ayanamsa,
            "birth_star": moon["nakshatra"],
            "calculation": f"Local {engine}; Lahiri sidereal; whole-sign houses; mean lunar node",
            "ephemeris_engine": engine,
            "timezone": zone}


@app.post("/calculate_match_making")
def calculate_match_making(details: MatchDetails):
    try:
        boy_chart = calculate_chart(details.boy)
        girl_chart = calculate_chart(details.girl)
        scores, notes, nadi_dosha, bhakoot_dosha = _ashtakoota_scores(boy_chart, girl_chart)
        total = sum(item["score"] for item in scores)
        boy_moon = next(p for p in boy_chart["planets"] if p["name"] == "Moon")
        girl_moon = next(p for p in girl_chart["planets"] if p["name"] == "Moon")
        return {
            "score": total, "total": 36, "verdict": "Traditional score only",
            "nadi_dosha": nadi_dosha,
            "bhakoot_dosha": bhakoot_dosha,
            "kootas": scores, "notes": notes,
            "method": "North Indian Ashtakoota convention; Lahiri sidereal Moon sign and nakshatra. Tables and cancellation rules vary by tradition.",
            "description": f"Moon-based Ashtakoota comparison: {boy_moon['sign']} ({boy_moon['nakshatra']['name']}) and {girl_moon['sign']} ({girl_moon['nakshatra']['name']}). This traditional score is not a marriage decision or a complete chart consultation.",
            "boy_moon": {"sign": boy_moon["sign"], "nakshatra": boy_moon["nakshatra"]},
            "girl_moon": {"sign": girl_moon["sign"], "nakshatra": girl_moon["nakshatra"]},
        }
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"Matching calculation failed; no score was generated: {exc}") from exc


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
