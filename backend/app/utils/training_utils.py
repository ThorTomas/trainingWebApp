# app/utils/training_utils.py

def get_main_ttype_definitions():
    return [
        {"id": 1, "code": "Run", "label": "Running", "color": "#A3D9FF"},
        {"id": 2, "code": "Bike", "label": "Cycling", "color": "#FFB3BA"},
        {"id": 3, "code": "Swim", "label": "Swimming", "color": "#FFDFBA"},
        {"id": 4, "code": "Gym", "label": "Strength", "color": "#bfbfbf"},
        {"id": 5, "code": "Ski", "label": "Skiing", "color": "#D0F0C0"},
        {"id": 6, "code": "Other", "label": "Other", "color": "#FFFFFF"},
    ]

def get_sub_ttype_definitions(main_type_code=None):
    # Slovník: hlavní typ -> seznam subtypů
    subtypes_by_main = {
        "Run": [
            {"code": "Endurance", "label": "Basic Endurance", "color": "#FFDFBA"},
            {"code": "AP", "label": "Aerobic Training", "color": "#A3D9FF"},
            {"code": "ANP", "label": "Anaerobic Training", "color": "#FFB3BA"},
            {"code": "Threshold", "label": "Threshold Training", "color": "#FFFFBA"},
            {"code": "Rege", "label": "Regeneration", "color": "#E2F0CB"},
            {"code": "Athletics", "label": "Track Training", "color": "#CBAACB"},
            {"code": "Commute", "label": "Commuting Run", "color": "#C8E6C9"},  # běh do práce / z práce
            {"code": "Hill", "label": "Hill Repeats", "color": "#D2B48C"},  # běh do kopce / hill reps
            {"code": "Race", "label": "Road Racing", "color": "#FFDAB9"},
            {"code": "R-Trail", "label": "Trail Racing", "color": "#F4E2D8"},
            {"code": "R-Track", "label": "Track Racing", "color": "#D3D3D3"},
            {"code": "O-Fo", "label": "Forest Orienteering", "color": "#C8E6C9"},
            {"code": "O-Sp", "label": "Sprint Orienteering", "color": "#FFCCCB"},
        ],
        "Bike": [
            {"code": "Road", "label": "Road Cycling", "color": "#FFB3BA"},
            {"code": "Trail", "label": "MTB / Trail Ride", "color": "#F4E2D8"},  # terénní jízda
            {"code": "Track", "label": "Velodrome / Track", "color": "#D3D3D3"},  # dráhová cyklistika
            {"code": "Commute", "label": "Commuting / Easy Ride", "color": "#C8E6C9"},  # dojíždění / lehká jízda
            {"code": "AP", "label": "Aerobic Pace", "color": "#A3D9FF"},
            {"code": "ANP", "label": "Anaerobic Pace", "color": "#FFB3BA"},
            {"code": "Threshold", "label": "Threshold", "color": "#FFFFBA"},
            {"code": "Rege", "label": "Regeneration", "color": "#E2F0CB"},
            {"code": "Race", "label": "Race", "color": "#FFDAB9"},
        ],
        "Swim": [
            {"code": "Open", "label": "Open Water", "color": "#ADD8E6"},  # plavání na otevřené vodě
            {"code": "Sprint", "label": "Sprint Swim", "color": "#FFCCCB"},  # sprinterský trénink
            {"code": "Technique", "label": "Technique / Drills", "color": "#E6E6FA"},  # technická cvičení
            {"code": "Race", "label": "Race", "color": "#FFDAB9"},  # závodní plavání
            {"code": "Rege", "label": "Regeneration", "color": "#E2F0CB"},
        ],
        "Gym": [
            {"code": "Strength", "label": "Strength", "color": "#bfbfbf"},
            {"code": "Mobility", "label": "Mobility", "color": "#B2F9FC"},
            {"code": "Stretching", "label": "Stretching", "color": "#E6E6FA"},
            {"code": "Yoga", "label": "Yoga / Relax", "color": "#E6E6FA"},
            {"code": "Power", "label": "Power / Explosiveness", "color": "#FFDEAD"},  # výbušná síla
        ],
        "Ski": [
            {"code": "Endurance", "label": "Basic Endurance", "color": "#FFDFBA"},
            {"code": "AP", "label": "Aerobic Pace", "color": "#A3D9FF"},
            {"code": "ANP", "label": "Anaerobic Pace", "color": "#FFB3BA"},
            {"code": "Technique", "label": "Technique / Drills", "color": "#E6E6FA"},  # technická cvičení, např. práce na stylu
            {"code": "Race", "label": "Race", "color": "#FFDAB9"},  # závody
            {"code": "Sk8", "label": "Skating", "color": "#D0F0C0"},  # bruslení
        ],
        "Other": [
            {"code": "Other", "label": "Other", "color": "#FFFFFF"},
            {"code": "Walk", "label": "Hiking / Walking", "color": "#C8E6C9"},
        ],
    }
    if main_type_code is None:
        # Vrátí všechny subtypy napříč sporty (např. pro administraci)
        all_subtypes = []
        for lst in subtypes_by_main.values():
            all_subtypes.extend(lst)
        # Odstraní duplicity podle code
        seen = set()
        unique = []
        for s in all_subtypes:
            if s["code"] not in seen:
                seen.add(s["code"])
                unique.append(s)
        return unique
    return subtypes_by_main.get(main_type_code, [])
