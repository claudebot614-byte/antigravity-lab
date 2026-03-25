#!/usr/bin/env python3
"""
Status checker - Quick check on Antigravity's state
"""

import json
from pathlib import Path
from datetime import datetime

STATUS_FILE = Path(__file__).parent / "status.json"
LOG_FILE = Path(__file__).parent / "activity.log"

def get_status():
    """Get current status."""
    if STATUS_FILE.exists():
        with open(STATUS_FILE) as f:
            status = json.load(f)
        return status
    return None

def get_recent_logs(lines=10):
    """Get recent log entries."""
    if LOG_FILE.exists():
        with open(LOG_FILE) as f:
            all_lines = f.readlines()
        return all_lines[-lines:]
    return []

def main():
    status = get_status()

    print("=" * 50)
    print("  ANTIGRAVITY STATUS")
    print("=" * 50)

    if status:
        print(f"Started: {status.get('started', 'unknown')}")
        print(f"Last heartbeat: {status.get('last_heartbeat', 'unknown')}")
        print(f"Last email check: {status.get('last_email_check', 'unknown')}")
        print(f"Emails processed: {status.get('emails_processed', 0)}")
        print(f"Tasks completed: {status.get('tasks_completed', 0)}")

        if status.get("errors"):
            print(f"\nRecent errors:")
            for err in status["errors"][-3:]:
                print(f"  - {err}")
    else:
        print("Status file not found - core not running?")

    print("\n" + "=" * 50)
    print("  RECENT LOGS")
    print("=" * 50)

    logs = get_recent_logs(5)
    for line in logs:
        print(line.strip())

if __name__ == "__main__":
    main()
