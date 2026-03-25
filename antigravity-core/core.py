#!/usr/bin/env python3
"""
Antigravity Core - Self-running autonomous system

Runs continuously, monitors email, executes scheduled tasks,
updates status, sends notifications.
"""

import asyncio
import json
import os
import sys
from datetime import datetime, timedelta
from pathlib import Path
import aiofiles

# Paths
BASE_DIR = Path(__file__).parent
SECRETS_DIR = BASE_DIR.parent / ".secrets"
STATUS_FILE = BASE_DIR / "status.json"
LOG_FILE = BASE_DIR / "activity.log"

# Config
CHECK_INTERVAL = 1800  # 30 minutes between email checks
HEARTBEAT_INTERVAL = 300  # 5 minutes


class AntigravityCore:
    """Main autonomous system."""

    def __init__(self):
        self.running = True
        self.status = {
            "started": None,
            "last_heartbeat": None,
            "last_email_check": None,
            "emails_processed": 0,
            "tasks_completed": 0,
            "errors": []
        }
        self.email_config = None
        self.github_token = None

    async def load_credentials(self):
        """Load credentials from secrets."""
        email_path = SECRETS_DIR / "email.json"
        github_path = SECRETS_DIR / "github.json"

        if email_path.exists():
            async with aiofiles.open(email_path) as f:
                self.email_config = json.loads(await f.read())

        if github_path.exists():
            async with aiofiles.open(github_path) as f:
                data = json.loads(await f.read())
                self.github_token = data.get("token")

    async def log(self, message: str):
        """Log activity."""
        timestamp = datetime.utcnow().isoformat()
        entry = f"[{timestamp}] {message}\n"

        async with aiofiles.open(LOG_FILE, mode='a') as f:
            await f.write(entry)

        print(entry.strip())

    async def update_status(self):
        """Update status file."""
        self.status["last_heartbeat"] = datetime.utcnow().isoformat()

        async with aiofiles.open(STATUS_FILE, mode='w') as f:
            await f.write(json.dumps(self.status, indent=2))

    async def check_email(self):
        """Check inbox for new emails."""
        import imaplib
        import email
        from email.header import decode_header

        if not self.email_config:
            await self.log("No email config, skipping check")
            return

        try:
            mail = imaplib.IMAP4_SSL("imap.gmail.com")
            mail.login(self.email_config["email"], self.email_config["app_password"])
            mail.select("inbox")

            # Search for unseen emails
            status, messages = mail.search(None, "UNSEEN")

            if status != "OK":
                return

            email_ids = messages[0].split()
            new_count = len(email_ids)

            if new_count > 0:
                await self.log(f"📬 {new_count} new emails")

                # Get details of latest emails
                for email_id in email_ids[:5]:  # Check max 5
                    status, msg_data = mail.fetch(email_id, "(RFC822)")
                    if status == "OK":
                        msg = email.message_from_bytes(msg_data[0][1])
                        subject = decode_header(msg["Subject"])[0][0]
                        if isinstance(subject, bytes):
                            subject = subject.decode()
                        sender = msg.get("From", "")

                        # Check if important
                        important_keywords = ["urgent", "important", "action", "deadline"]
                        is_important = any(kw in subject.lower() for kw in important_keywords)

                        if is_important:
                            await self.log(f"⚠️ IMPORTANT: {subject[:50]} from {sender}")
                            # TODO: Send Telegram notification

                self.status["emails_processed"] += new_count

            mail.close()
            mail.logout()
            self.status["last_email_check"] = datetime.utcnow().isoformat()

        except Exception as e:
            await self.log(f"Email check error: {e}")
            self.status["errors"].append(str(e)[:100])

    async def run_scheduled_tasks(self):
        """Run any scheduled tasks."""
        # Daily summary at 9 AM UTC
        now = datetime.utcnow()
        if now.hour == 9 and now.minute < 5:
            await self.log("🌅 Morning check-in")
            # TODO: Send daily summary

        # Commit any local changes to GitHub daily
        if now.hour == 20 and now.minute < 5:
            await self.git_sync()

    async def git_sync(self):
        """Sync local workspace to GitHub."""
        import subprocess

        workspace = BASE_DIR.parent
        lab_dir = workspace / "antigravity-lab"

        if lab_dir.exists():
            try:
                result = subprocess.run(
                    ["git", "status", "--porcelain"],
                    cwd=lab_dir,
                    capture_output=True,
                    text=True
                )

                if result.stdout.strip():
                    subprocess.run(["git", "add", "."], cwd=lab_dir, check=True)
                    subprocess.run(
                        ["git", "commit", "-m", f"Auto-sync {datetime.utcnow().isoformat()}"],
                        cwd=lab_dir,
                        check=True
                    )
                    subprocess.run(["git", "push"], cwd=lab_dir, check=True)
                    await self.log("📤 Synced to GitHub")
                    self.status["tasks_completed"] += 1
            except Exception as e:
                await self.log(f"Git sync error: {e}")

    async def heartbeat(self):
        """Main heartbeat loop."""
        await self.log("🦾 Antigravity Core started")
        self.status["started"] = datetime.utcnow().isoformat()

        await self.load_credentials()

        last_email_check = datetime.utcnow()

        while self.running:
            try:
                # Update heartbeat
                await self.update_status()

                # Check email every 30 minutes
                if (datetime.utcnow() - last_email_check).total_seconds() > CHECK_INTERVAL:
                    await self.check_email()
                    last_email_check = datetime.utcnow()

                # Run scheduled tasks
                await self.run_scheduled_tasks()

                # Sleep
                await asyncio.sleep(HEARTBEAT_INTERVAL)

            except Exception as e:
                await self.log(f"Heartbeat error: {e}")
                await asyncio.sleep(60)

    def stop(self):
        """Stop the system."""
        self.running = False


async def main():
    """Main entry point."""
    core = AntigravityCore()

    try:
        await core.heartbeat()
    except KeyboardInterrupt:
        await core.log("Shutdown requested")
        core.stop()


if __name__ == "__main__":
    asyncio.run(main())
