const PLATFORM_MAP = {"3DO Interactive Multiplayer": "3DO",
                      "Acorn Archimedes": "Archimedes",
                      "Advanced Pico Beena": "AdvancedPicoBeena",
                      "Amazon Fire TV": "fireTV",
                      "Amiga CD32": "CD32",
                      "Amstrad CPC": "CPC",
                      "Amstrad PCW": "PCW",
                      "Analogue Nt": "Nt",
                      "Analogue Nt Mini": "NtMini",
                      "Analogue Super Nt": "SuperNt",
                      "AndroidTV": "atv",
                      "Apple II": "AppleII",
                      "Apple IIGS": "AppleIIGS",
                      "Apple TV": "AppleTV",
                      "Atari 2600": "Atari2600",
                      "Atari 5200": "Atari5200",
                      "Atari 7800": "Atari7800",
                      "Atari 8-bit family (400/800/XL/XE)": "Atari8bit",
                      "Atari Flashback": "AtariFlashback",
                      "Atari Jaguar": "Jaguar",
                      "Atari Jaguar CD": "JaguarCD",
                      "Atari Lynx": "Lynx",
                      "Atari ST": "AtariST",
                      "backwards-compatible PlayStation 3": "BCPS3",
                      "BBC Micro": "BBCMicro",
                      "Commodore 64": "C64",
                      "Commodore CDTV": "CommodoreCDTV",
                      "Commodore VIC-20": "VIC-20",
                      "Dragon 32/64": "D32-64",
                      "Fairchild Channel F": "FCF",
                      "Famicom Disk System": "FDS",
                      "FM Towns": "Towns",
                      "Game Boy": "GB",
                      "Game Boy Advance": "GBA",
                      "Game Boy Color": "GBC",
                      "Game Boy Interface": "GBI",
                      "Game Boy Player": "GBP",
                      "GameCube": "GCN",
                      "Game.Com": "GameCom",
                      "Game & Watch": "G&W",
                      "Google Stadia": "Stadia",
                      "Graphing Calculator": "GraphCalc",
                      "HTC Vive": "Vive",
                      "iQue Player": "iQuePlayer",
                      "Java Phone": "Java",
                      "Leapfrog Didj": "Didj",
                      "Macintosh": "Mac",
                      "Mega Sg": "MegaSg",
                      "NEC PC-88 series": "PC88",
                      "NEC PC-98 series": "PC-98",
                      "Neo Geo AES": "AES",
                      "Neo Geo CD": "NGCD",
                      "Neo Geo Mini": "NGMini",
                      "Neo Geo Pocket Color": "NGPC",
                      "Neo Geo X": "NGX",
                      "NES Classic Mini": "NESClassic",
                      "New Nintendo 3DS": "New3DS",
                      "New Nintendo 3DS Virtual Console": "New3DSVC",
                      "Nintendo 3DS": "3DS",
                      "Nintendo 3DS Virtual Console": "3DSVC",
                      "Nintendo 64": "N64",
                      "Nintendo DS": "DS",
                      "Nintendo Entertainment System": "NES",
                      "Nt Mini Noir": "NtNoir",
                      "Nvidia Shield": "Shield",
                      "Oculus Quest": "Quest",
                      "Oculus VR": "Oculus",
                      "Palm OS": "PalmOS",
                      "PC-FX": "PCFX",
                      "Philips CD-i": "CD-i",
                      "PICO-8": "PICO8",
                      "Pok??mon Mini": "PKMiNi",
                      "PlayStation": "PS",
                      "PlayStation 2": "PS2",
                      "PlayStation 3": "PS3",
                      "PlayStation 4": "PS4",
                      "PlayStation 4 Pro": "PS4Pro",
                      "PlayStation 5": "PS5",
                      "Playstation Classic": "PSClassic",
                      "Playstation Now": "PSNow",
                      "PlayStation Portable": "PSP",
                      "Playstation TV": "PSTV",
                      "PlayStation Vita": "PSVita",
                      "Plug & Play": "Plug&Play",
                      "PSN Download": "PSN",
                      "retroUSB AVS": "AVS",
                      "Sega 32X": "32X",
                      "Sega CD": "SegaCD",
                      "Sega Game Gear": "GameGear",
                      "Sega Genesis": "Genesis",
                      "Sega Genesis Mini": "SGM",
                      "Sega Master System": "SMS",
                      "Sega Pico": "SegaPico",
                      "Sega Saturn": "Saturn",
                      "SG-1000": "SG1000",
                      "Sharp X1": "SharpX1",
                      "SNES Classic Mini": "SNESClassic",
                      "Super Cassette Vision": "SCV",
                      "Super Game Boy": "SGB",
                      "Super Game Boy 2": "SGB2",
                      "Super Nintendo": "SNES",
                      "Switch Virtual Console": "SwitchVC",
                      "Texas Instruments TI-99/4A": "TI-99",
                      "TIC-80": "TIC80",
                      "TurboGrafx-16 CD-ROM": "TG16CD",
                      "TurboGrafx-16 Mini": "TG16Mini",
                      "TurboGrafx-16/PC Engine": "TG-16",
                      "Valve Index": "Index",
                      "Virtual Boy": "VirtualBoy",
                      "Wii Mini": "WiiMini",
                      "Wii U": "WiiU",
                      "Wii U Virtual Console": "WiiUVC",
                      "Wii Virtual Console": "WiiVC",
                      "Windows Mixed Reality": "WindowsMR",
                      "Windows Phone": "WindowsPhone",
                      "Wonderswan Colour": "WSC",
                      "Xbox 360": "X360",
                      "Xbox 360 Arcade": "X360Arcade",
                      "Xbox One": "XboxOne",
                      "Xbox One S": "XboxOneS",
                      "Xbox One X": "XboxOneX",
                      "Xbox Series S": "XboxSeriesS",
                      "Xbox Series X": "XboxSeriesX",
                      "ZX Spectrum": "ZXSpectrum"};

function shorten(platform) {
  if (platform in PLATFORM_MAP)
    return PLATFORM_MAP[platform];
  else if (platform === undefined)
    return "-";
  else
    return platform;
}