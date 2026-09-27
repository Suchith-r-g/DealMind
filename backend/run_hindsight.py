"""
Runner script for local open source Hindsight API server.
Configures UTF-8 encoding for Windows and sets up local parameters.
"""

import sys
import os

# Ensure UTF-8 output encoding on Windows to prevent UnicodeEncodeError in ascii art
sys.stdout.reconfigure(encoding='utf-8')
sys.stderr.reconfigure(encoding='utf-8')

# Set environment defaults for open source server
os.environ["PYTHONIOENCODING"] = "utf-8"
os.environ["HINDSIGHT_API_PORT"] = "8888"
os.environ["HINDSIGHT_API_HOST"] = "127.0.0.1"

# If no remote embeddings specified, disable reranker to keep local memory fast
if not os.environ.get("HINDSIGHT_API_RERANKER_PROVIDER"):
    os.environ["HINDSIGHT_API_RERANKER_PROVIDER"] = "none"

import hindsight_api.main as server

if __name__ == "__main__":
    sys.argv = ["hindsight-api", "--port", "8888", "--host", "127.0.0.1"]
    print("🚀 Starting local open source Hindsight server on http://127.0.0.1:8888...")
    server.main()
