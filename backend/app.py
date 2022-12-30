from flask import Flask, request, jsonify, redirect
from flask_cors import CORS
import hashlib
import time
import datetime

app = Flask(__name__)
CORS(app)

# Use a dictionary to store the URLs in memory
urls = {}

# Generate a unique key for a given URL
def generate_key(url):
  # Use the SHA-1 hash function to map the URL to a unique key
  key = hashlib.sha1(url.encode()).hexdigest()[:6]
  # Check if the key is already in use
  return key

# Create analytics for shorty url
def create_analytics(short_url):
  timestamp = time.time()
  urls[short_url]["analytics"] = {"usage": 0, "creation_time": timestamp}

# Create a new short URL
@app.route("/shorten", methods=["POST"])
def shorten():
  # Get the original URL and the desired short URL from the request
  data = request.get_json()
  original_url = data["original_url"]
  short_url = data.get("short_url")
  # Generate a unique key for the original URL
  if not short_url:
    short_url = generate_key(original_url)
  # Check if the short URL is already in use
  if short_url in urls:
    return jsonify({"error": "Short URL is already in use"}), 400
  # Store the original URL and the short URL in the dictionary
  urls[short_url] = {"original_url": original_url, "analytics": {}}
  create_analytics(short_url)
  return jsonify({"short_url": short_url}), 201

# Redirect the user to the original URL when the short URL is accessed
@app.route("/<short_url>")
def redirect_url(short_url):
  # Check if the short URL is in the dictionary
  if short_url not in urls:
    return jsonify({"error": "Short URL not found"}), 404
  # Get the original URL associated with the short URL
  original_url = urls[short_url]["original_url"]

  # Update our analytics for URL
  urls[short_url]["analytics"]["usage"] += 1
  # Redirect the user to the original URL
  print(original_url, original_url)
  return redirect(original_url, 302)


# Retrieve analytics data for a specific short URL
@app.route("/analytics/<short_url>", methods=["GET"])
def analytics(short_url):
  # Check if the short URL is in the dictionary
  if short_url not in urls:
    return jsonify({"error": "Short URL not found"}), 404
  # Get the analytics data for the short URL
  analytics_data = urls[short_url]["analytics"]
  if not analytics_data:
    return jsonify({"error": "Analytics data not found"}), 404
  return jsonify(analytics_data), 200

# Delete a short URL
@app.route("/modify/<short_url>", methods=["DELETE"])
def delete_url(short_url):
  # Check if the short URL is in the dictionary
  if short_url not in urls:
    return jsonify({"error": "Short URL not found"}), 404
  # Delete the short URL from the dictionary
  del urls[short_url]
  return jsonify({"message": "Short URL deleted successfully"}), 200
