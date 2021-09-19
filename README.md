# SRCH Client
SRCH Client (standing for Speedrun.com HTML Client, pronounced "search client") is meant to be an alternative way for people to search for data on [speedrun.com](https://www.speedrun.com). While in no way intended to be a placement for speedrun.com, a subset of its features is displayed in a more accessible format.

This project was mainly inspired by Jorkoh's [SRC Client](https://github.com/Jorkoh/SRC_Client).

## speedrun.com API
Data from speedrun.com is fetched through v1 of its [API](https://github.com/speedruncomorg/api). Original content it provides is licensed under [CC-BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/); images and videos are copyright of their respective owners.

The API caches data, so making the same request twice in a short amount of time will usually return the same data, regardless of any changes made in between. The time needed for the cache to clear does not appear to be consistent, but 30 minutes is usually enough time.

The API is rate-limited, supposedly at 100 requests per minute, but this does not appear to be consistent. All pages that do not display runs will not make more than 2 requests, so it is unlikely that they will trigger a rate-limit. Pages that display runs will make quite a lot of requests, so it is advised not to request multiple run pages in rapid succession.

[to be finished]
