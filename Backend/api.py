from flask import Flask, request, jsonify, redirect
from pymongo import MongoClient
import hashlib

app = Flask(__name__)

# Connect to the MongoDB database
client = MongoClient("mongodb://localhost:27017/")
db = client["url_shortener"]
urls_collection = db["urls"]

# Generate a unique key for a given URL
def generate_key(url):
  # Use the SHA-1 hash function to map the URL to a unique key
  key = hashlib.sha1(url.encode()).hexdigest()[:6]
  # Check if the key is already in use
  if urls_collection.find_one({"key": key}):
    # If the key is already in use, generate a new key
    return generate_key(url)
  else:
    return key

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
  existing_url = urls_collection.find_one({"key": short_url})
  if existing_url:
    return jsonify({"error": "Short URL is already in use"}), 400
  # Insert the original URL and the short URL into the database
  urls_collection.insert_one({"original_url": original_url, "key": short_url})
  return jsonify({"short_url": short_url}), 201

# Redirect the user to the original URL when the short URL is accessed
@app.route("/<short_url>")
def redirect_url(short_url):
  # Find the original URL for the given short URL
  url = urls_collection.find_one({"key": short_url})
  if not url:
    return jsonify({"error": "Short URL not found"}), 404
  original_url = url["original_url"]
  # Redirect the user to the original URL
  return redirect(original_url)

# Retrieve analytics data for a specific short URL
@app.route("/analytics/<short_url>", methods=["GET"])
def analytics(short_url):
  # Find the analytics data for the given short URL
  url = urls_collection.find_one({"key": short_url})
  if not url:
    return jsonify({"error": "Short URL not found"}), 404
  analytics_data = url.get("analytics")
  if not analytics_data:
    return jsonify({"error": "Analytics data not found"}), 404
  return jsonify(analytics_data), 200

# Delete a short URL
@app.route("/<short_url>", methods=["DELETE"])
def delete_url(short_url):
  # Find the short URL in the database
  url = urls_collection.find_one({"key": short_url})
  if not url:
    return jsonify({"error": "Short URL not found"}), 404
  # Delete the short URL from the database
  urls_collection.delete_one({"key": short_url})
  return jsonify({"message": "Short URL deleted successfully"}), 200

