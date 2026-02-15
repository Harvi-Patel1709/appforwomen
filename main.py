"""
Eraya - Period Wellness App
Minimal Flask app to serve static files for Google App Engine.
"""
import os
from flask import Flask, send_from_directory

app = Flask(__name__, static_folder='.', static_url_path='')


@app.route('/')
def index():
    return send_from_directory('.', 'index.html')


@app.route('/<path:path>')
def serve(path):
    if os.path.isfile(path):
        return send_from_directory('.', path)
    # Try adding .html for clean URLs (optional)
    if os.path.isfile(path + '.html'):
        return send_from_directory('.', path + '.html')
    return send_from_directory('.', path)


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8080))
    app.run(host='0.0.0.0', port=port, debug=True)
