#!/usr/bin/env python3
"""
Lightweight development server for angelheco.
Automatically reads configuration from .env and serves the site with proper MIME types.
"""
import http.server
import json
import os
import socketserver
import sys
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent

def load_env_file(filepath):
    env_vars = {}
    if os.path.exists(filepath):
        with open(filepath, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if not line or line.startswith("#") or "=" not in line:
                    continue
                key, val = line.split("=", 1)
                env_vars[key.strip()] = val.strip()
    return env_vars

class DevServerHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(BASE_DIR), **kwargs)

    def do_GET(self):
        # Dynamically generate /env.js from .env file if requested
        if self.path == "/env.js" or self.path.startswith("/env.js?"):
            env = load_env_file(BASE_DIR / ".env")
            client_env = {
                "SUPABASE_URL": env.get("SUPABASE_URL", "https://unwkuwipxkezilwotkdy.supabase.co"),
                "SUPABASE_ANON_KEY": env.get("SUPABASE_ANON_KEY", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVud2t1d2lweGtlemlsd290a2R5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE1Mjc1NjUsImV4cCI6MjA5NzEwMzU2NX0.7JeOKbF95S-T5pjD1DFZCcfX8VzigGUAcTR5FE2SpUQ"),
                "STORAGE_BUCKET": env.get("STORAGE_BUCKET", "memories"),
            }
            content = f"window.__ENV__ = {json.dumps(client_env, indent=4)};\n".encode("utf-8")
            self.send_response(200)
            self.send_header("Content-Type", "application/javascript; charset=utf-8")
            self.send_header("Content-Length", str(len(content)))
            self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
            self.end_headers()
            self.wfile.write(content)
            return

        return super().do_GET()

def main():
    env = load_env_file(BASE_DIR / ".env")
    port = int(env.get("PORT", 8000))
    
    # Allow port override from CLI arg
    if len(sys.argv) > 1 and sys.argv[1].isdigit():
        port = int(sys.argv[1])

    handler = DevServerHandler
    with socketserver.TCPServer(("", port), handler) as httpd:
        print(f"==================================================")
        print(f" Angelheco Local Dev Server running at:")
        print(f" http://localhost:{port}")
        print(f" Press Ctrl+C to stop the server")
        print(f"==================================================")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down server...")

if __name__ == "__main__":
    main()
