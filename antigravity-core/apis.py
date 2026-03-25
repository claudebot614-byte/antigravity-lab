#!/usr/bin/env python3
"""
API Integrations - External data sources for Antigravity

Free APIs with no key required, instant use.
"""

import aiohttp
import asyncio
from typing import Dict, Any, Optional
from datetime import datetime


class APIIntegrations:
    """Collection of free API integrations."""

    def __init__(self):
        self.session: Optional[aiohttp.ClientSession] = None

    async def __aenter__(self):
        self.session = aiohttp.ClientSession(timeout=aiohttp.ClientTimeout(total=10))
        return self

    async def __aexit__(self, *args):
        if self.session:
            await self.session.close()

    # === WEATHER ===

    async def get_weather(self, location: str = "London") -> Dict[str, Any]:
        """Get weather from wttr.in (no API key)."""
        url = f"https://wttr.in/{location}?format=j1"
        try:
            async with self.session.get(url) as resp:
                if resp.status == 200:
                    data = await resp.json()
                    current = data.get("current_condition", [{}])[0]
                    return {
                        "location": location,
                        "temp_c": current.get("temp_C"),
                        "temp_f": current.get("temp_F"),
                        "description": current.get("weatherDesc", [{}])[0].get("value"),
                        "humidity": current.get("humidity"),
                        "wind": current.get("windspeedKmph"),
                        "updated": datetime.utcnow().isoformat()
                    }
        except Exception as e:
            return {"error": str(e)}
        return {"error": "Failed to fetch weather"}

    # === CRYPTO ===

    async def get_crypto_price(self, coin: str = "bitcoin") -> Dict[str, Any]:
        """Get crypto price from CoinGecko (no API key)."""
        url = f"https://api.coingecko.com/api/v3/simple/price?ids={coin}&vs_currencies=usd,eur&include_24hr_change=true"
        try:
            async with self.session.get(url) as resp:
                if resp.status == 200:
                    data = await resp.json()
                    if coin in data:
                        return {
                            "coin": coin,
                            "usd": data[coin].get("usd"),
                            "eur": data[coin].get("eur"),
                            "change_24h": data[coin].get("usd_24h_change"),
                            "updated": datetime.utcnow().isoformat()
                        }
        except Exception as e:
            return {"error": str(e)}
        return {"error": "Coin not found"}

    async def get_top_cryptos(self, limit: int = 10) -> list:
        """Get top cryptocurrencies by market cap."""
        url = f"https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page={limit}&page=1"
        try:
            async with self.session.get(url) as resp:
                if resp.status == 200:
                    data = await resp.json()
                    return [{
                        "name": c["name"],
                        "symbol": c["symbol"],
                        "price": c["current_price"],
                        "change_24h": c["price_change_percentage_24h"],
                        "market_cap": c["market_cap"]
                    } for c in data]
        except Exception as e:
            return [{"error": str(e)}]

    # === QUOTES & JOKES ===

    async def get_random_quote(self) -> Dict[str, str]:
        """Get random quote from quotable.io."""
        url = "https://api.quotable.io/random"
        try:
            async with self.session.get(url) as resp:
                if resp.status == 200:
                    data = await resp.json()
                    return {
                        "quote": data.get("content"),
                        "author": data.get("author"),
                        "tags": data.get("tags", [])
                    }
        except Exception as e:
            return {"error": str(e)}
        return {"error": "Failed to fetch quote"}

    async def get_random_joke(self) -> Dict[str, str]:
        """Get random joke."""
        url = "https://official-joke-api.appspot.com/random_joke"
        try:
            async with self.session.get(url) as resp:
                if resp.status == 200:
                    data = await resp.json()
                    return {
                        "setup": data.get("setup"),
                        "punchline": data.get("punchline")
                    }
        except Exception as e:
            return {"error": str(e)}
        return {"error": "Failed to fetch joke"}

    async def get_advice(self) -> str:
        """Get random advice."""
        url = "https://api.adviceslip.com/advice"
        try:
            async with self.session.get(url) as resp:
                if resp.status == 200:
                    text = await resp.text()
                    import json
                    data = json.loads(text)
                    return data.get("slip", {}).get("advice", "")
        except Exception as e:
            return f"Error: {e}"
        return "No advice available"

    # === NEWS ===

    async def get_hacker_news_top(self, limit: int = 5) -> list:
        """Get top stories from Hacker News."""
        try:
            # Get top story IDs
            async with self.session.get("https://hacker-news.firebaseio.com/v0/topstories.json") as resp:
                if resp.status == 200:
                    ids = await resp.json()
                    ids = ids[:limit]

                    stories = []
                    for story_id in ids:
                        async with self.session.get(f"https://hacker-news.firebaseio.com/v0/item/{story_id}.json") as story_resp:
                            if story_resp.status == 200:
                                story = await story_resp.json()
                                stories.append({
                                    "title": story.get("title"),
                                    "url": story.get("url"),
                                    "score": story.get("score"),
                                    "by": story.get("by")
                                })

                    return stories
        except Exception as e:
            return [{"error": str(e)}]

    # === RANDOM DATA ===

    async def get_random_fact(self, type: str = "cat") -> str:
        """Get random animal fact."""
        urls = {
            "cat": "https://cat-fact.herokuapp.com/facts/random",
            "dog": "https://dog-api.kinduff.com/api/facts"
        }
        url = urls.get(type, urls["cat"])
        try:
            async with self.session.get(url) as resp:
                if resp.status == 200:
                    data = await resp.json()
                    if type == "cat":
                        return data.get("text", "")
                    else:
                        return data.get("facts", [""])[0]
        except Exception as e:
            return f"Error: {e}"
        return "No fact available"

    async def get_activity(self) -> Dict[str, str]:
        """Get random activity suggestion."""
        url = "https://www.boredapi.com/api/activity"
        try:
            async with self.session.get(url) as resp:
                if resp.status == 200:
                    data = await resp.json()
                    return {
                        "activity": data.get("activity"),
                        "type": data.get("type"),
                        "participants": data.get("participants")
                    }
        except Exception as e:
            return {"error": str(e)}
        return {"error": "No activity"}

    # === KNOWLEDGE ===

    async def get_country_info(self, name: str) -> Dict[str, Any]:
        """Get country information."""
        url = f"https://restcountries.com/v3.1/name/{name}"
        try:
            async with self.session.get(url) as resp:
                if resp.status == 200:
                    data = await resp.json()
                    if data:
                        c = data[0]
                        return {
                            "name": c.get("name", {}).get("common"),
                            "capital": c.get("capital", [""])[0],
                            "population": c.get("population"),
                            "region": c.get("region"),
                            "currency": list(c.get("currencies", {}).keys())[0] if c.get("currencies") else None
                        }
        except Exception as e:
            return {"error": str(e)}
        return {"error": "Country not found"}


# Test function
async def test_apis():
    """Test all API integrations."""
    print("Testing API integrations...\n")

    async with APIIntegrations() as api:
        # Weather
        weather = await api.get_weather("London")
        print(f"🌤 Weather: {weather.get('temp_c')}°C - {weather.get('description')}")

        # Crypto
        btc = await api.get_crypto_price("bitcoin")
        print(f"₿ BTC: ${btc.get('usd')} ({btc.get('change_24h', 0):.2f}%)")

        # Quote
        quote = await api.get_random_quote()
        print(f"💬 Quote: \"{quote.get('quote', '')[:50]}...\" - {quote.get('author')}")

        # Joke
        joke = await api.get_random_joke()
        print(f"😄 Joke: {joke.get('setup')} - {joke.get('punchline')}")

        # News
        news = await api.get_hacker_news_top(3)
        print(f"\n📰 Top HN Stories:")
        for n in news[:2]:
            print(f"   - {n.get('title', '')[:50]}")

        print("\n✅ All APIs working!")


if __name__ == "__main__":
    asyncio.run(test_apis())
