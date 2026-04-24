import http.server
import socketserver
import os

class DevHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Allow Overleaf to see the file
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Expose-Headers", "Last-Modified")
        # Disable all caching
        self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()

PORT = 8000
# This prevents the "Address already in use" error
socketserver.TCPServer.allow_reuse_address = True

with socketserver.TCPServer(("", PORT), DevHandler) as httpd:
    print(f"📡 Dev Server active on port {PORT}")
    httpd.serve_forever()
