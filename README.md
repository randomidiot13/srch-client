# SRCH Client
SRCH Client (standing for Speedrun.com HTML Client, pronounced "search client") is meant to be an alternative way for people to search for data on [speedrun.com](https://www.speedrun.com). While in no way intended to be a placement for speedrun.com, a subset of its features is displayed in a more accessible format.

This project was mainly inspired by Jorkoh's [SRC Client](https://github.com/Jorkoh/SRC_Client).

## speedrun.com API
Data from speedrun.com is fetched through v1 of its [API](https://github.com/speedruncomorg/api). Original content it provides is licensed under [CC-BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/); images and videos are copyright of their respective owners.

The API caches data, so making the same request twice in a short amount of time will usually return the same data, regardless of any changes made in between. The time needed for the cache to clear does not appear to be consistent, but 30 minutes is usually enough time.

The API is rate-limited, supposedly at 100 requests per minute, but this does not appear to be consistent. All pages that do not display runs will not make more than 2 requests, so it is unlikely that they will trigger a rate-limit. Pages that display runs will make quite a lot of requests, so it is advised not to request multiple run pages in rapid succession.

Starting in June 2021, accessing runs beyond offset 10000 has been impossible. Through use of both ascending and descending sorting, up to 20000 runs can be fetched (specifically, the oldest 10000 and newest 10000), but even this is not enough for some categories. Methods to circumvent this may or may not be implemented in the future, but for now please take note that if exactly 20000 runs show up, there are almost certainly more runs that did not get fetched.

## Sort/Filter Options
There are many provided ways to sort and/or filter runs. Below is a breakdown of all of them, with descriptions for some that may not be entirely clear:
- Sorting
    - Date (tiebreak: submission date) is the default (latest first for user, oldest first for category and level)
    - Game, alphabetically (user only)
    - (Primary) time (all)
    - Category, alphabetically (all)
    - Platform, alphabetically (all)
    - Status, in the order verified-pending-rejected (all)
- Filtering
    - Game (user only)
    - Category (level only)
    - Subcategories (category and level only)
    - Status (all)
    - Obsoleteness, a run being slower than its runner's PB (all)
    - Country, using [ISO 3166-2](https://en.wikipedia.org/wiki/ISO_3166-2) country codes (category and level only)
