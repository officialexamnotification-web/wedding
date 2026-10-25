"""Backward-compatible entry point; calculations live in main_simple.py."""
from main_simple import app


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
