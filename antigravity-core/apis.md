# Antigravity's API Integrations

## Priority APIs to Integrate

### No API Key Required (Instant Use)
| API | Purpose | Endpoint |
|-----|---------|----------|
| wttr.in | Weather | `wttr.in/{location}?format=j1` |
| Cat Facts | Random facts | `cat-fact.herokuapp.com/facts/random` |
| Dog Facts | Random facts | `dog-api.kinduff.com/api/facts` |
| Bored API | Activity suggestions | `boredapi.com/api/activity` |
| Agify.io | Age prediction from name | `api.agify.io?name={name}` |
| IP API | IP geolocation | `ip-api.com/json/` |
| Quotable | Random quotes | `api.quotable.io/random` |
| Advice Slip | Random advice | `api.adviceslip.com/advice` |
| Official Joke | Jokes | `official-joke-api.appspot.com/random_joke` |
| Random User | Fake user data | `randomuser.me/api/` |
| CoinGecko | Crypto prices | `api.coingecko.com/api/v3/` |
| RestCountries | Country data | `restcountries.com/v3.1/` |
| Open Library | Book data | `openlibrary.org/api/` |
| Quran Cloud | Quran verses | `api.alquran.cloud/v1/` |
| Hacker News | Tech news | `hacker-news.firebaseio.com/v0/` |

### Free Tier (Need Registration)
| API | Purpose | Free Limit |
|-----|---------|------------|
| OpenWeatherMap | Weather data | 1K calls/day |
| NewsAPI | News headlines | 100 requests/day |
| ExchangeRate-API | Currency rates | 1.5K requests/month |
| ipstack | IP geolocation | 100 requests/month |
| Weatherstack | Weather data | 250 requests/month |
| Fixer | Exchange rates | 100 requests/month |

### Already Have Access
| API | Purpose | Status |
|-----|---------|--------|
| GitHub API | My repos | ✅ Active |
| Gmail API | Email access | ✅ Active |

## Implementation Priority

1. **Weather (wttr.in)** - No key, instant
2. **Crypto prices (CoinGecko)** - No key, useful
3. **Quotes/Jokes** - For daily summaries
4. **News (Hacker News)** - Tech monitoring
5. **Open Library** - Knowledge base

## Usage Examples

```python
# Weather (no key)
import requests
weather = requests.get("https://wttr.in/London?format=j1").json()

# Crypto prices (no key)
btc = requests.get("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd").json()

# Random quote (no key)
quote = requests.get("https://api.quotable.io/random").json()
```
