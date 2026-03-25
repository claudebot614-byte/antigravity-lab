#!/usr/bin/env python3
"""
Training Data Collector - Logs interactions for fine-tuning

Collects Q&A pairs from conversations, marks quality,
prepares for SFT/RLHF training.
"""

import json
import os
from datetime import datetime
from pathlib import Path
from typing import Dict, Any, Optional, List
from dataclasses import dataclass, asdict
import aiofiles


@dataclass
class TrainingSample:
    """A single training sample."""
    instruction: str
    input: str
    output: str
    quality: str  # "good", "neutral", "bad"
    source: str  # "telegram", "tui", etc.
    timestamp: str
    metadata: Dict[str, Any]


class TrainingDataCollector:
    """
    Collects and stores training data from interactions.

    Usage:
        collector = TrainingDataCollector()

        # Log interaction
        collector.log(
            instruction="Write a Python function",
            output="def hello(): pass",
            quality="good"
        )
    """

    def __init__(self, output_dir: str = None):
        self.output_dir = Path(output_dir or os.path.expanduser("~/.openclaw/workspace/training-data"))
        self.output_dir.mkdir(parents=True, exist_ok=True)

        self.current_file = self.output_dir / f"samples_{datetime.utcnow().strftime('%Y%m')}.jsonl"
        self.samples_today: List[TrainingSample] = []

    def log(
        self,
        instruction: str,
        output: str,
        input: str = "",
        quality: str = "neutral",
        source: str = "telegram",
        metadata: Optional[Dict] = None
    ):
        """
        Log a training sample.

        Args:
            instruction: User's message/prompt
            output: My response
            input: Additional context (optional)
            quality: "good", "neutral", or "bad"
            source: Where this came from
            metadata: Additional info
        """
        sample = TrainingSample(
            instruction=instruction,
            input=input,
            output=output,
            quality=quality,
            source=source,
            timestamp=datetime.utcnow().isoformat(),
            metadata=metadata or {}
        )

        self.samples_today.append(sample)

        # Append to file
        self._append_sample(sample)

    def _append_sample(self, sample: TrainingSample):
        """Append sample to JSONL file."""
        async def _write():
            async with aiofiles.open(self.current_file, mode='a') as f:
                await f.write(json.dumps(asdict(sample)) + '\n')

        import asyncio
        try:
            loop = asyncio.get_event_loop()
            if loop.is_running():
                asyncio.create_task(_write())
            else:
                asyncio.run(_write())
        except Exception as e:
            # Fallback to sync
            with open(self.current_file, 'a') as f:
                f.write(json.dumps(asdict(sample)) + '\n')

    def mark_quality(self, instruction: str, quality: str):
        """
        Update quality of a recent sample.

        Args:
            instruction: The instruction to find
            quality: New quality rating
        """
        # Find and update in recent samples
        for sample in self.samples_today:
            if sample.instruction == instruction:
                sample.quality = quality
                break

    def get_stats(self) -> Dict[str, Any]:
        """Get collection statistics."""
        if not self.current_file.exists():
            return {"total": 0}

        total = 0
        quality_counts = {"good": 0, "neutral": 0, "bad": 0}

        with open(self.current_file) as f:
            for line in f:
                try:
                    sample = json.loads(line)
                    total += 1
                    quality_counts[sample.get("quality", "neutral")] += 1
                except:
                    pass

        return {
            "total": total,
            "quality": quality_counts,
            "file": str(self.current_file)
        }

    def export_for_training(self, output_path: str, quality_filter: List[str] = None):
        """
        Export samples for training.

        Args:
            output_path: Where to save
            quality_filter: Only include these qualities
        """
        quality_filter = quality_filter or ["good", "neutral"]

        samples = []
        if self.current_file.exists():
            with open(self.current_file) as f:
                for line in f:
                    try:
                        sample = json.loads(line)
                        if sample.get("quality") in quality_filter:
                            samples.append({
                                "instruction": sample["instruction"],
                                "input": sample["input"],
                                "output": sample["output"]
                            })
                    except:
                        pass

        with open(output_path, 'w') as f:
            json.dump(samples, f, indent=2)

        return len(samples)


# Global collector instance
_collector: Optional[TrainingDataCollector] = None


def get_collector() -> TrainingDataCollector:
    """Get or create the global collector."""
    global _collector
    if _collector is None:
        _collector = TrainingDataCollector()
    return _collector


def log_interaction(instruction: str, output: str, quality: str = "neutral", **kwargs):
    """Quick function to log an interaction."""
    collector = get_collector()
    collector.log(instruction=instruction, output=output, quality=quality, **kwargs)


if __name__ == "__main__":
    # Test
    collector = TrainingDataCollector()
    collector.log(
        instruction="What is Python?",
        output="Python is a programming language known for its simplicity and readability.",
        quality="good"
    )

    print(f"Stats: {collector.get_stats()}")
