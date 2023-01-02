import unittest
import json
from backend.app import app



class FlaskTestCase(unittest.TestCase):
  # Ensure the API is working correctly

  def test_shorten(self):
    tester = app.test_client(self)
    response = tester.post('/shorten', data=json.dumps({"original_url": "https://www.example.com"}), content_type='application/json')
    self.assertEqual(response.status_code, 201)
    self.assertIn(b'short_url', response.data)


  def test_shorten_with_custom_url(self):
    tester = app.test_client(self)
    response = tester.post('/shorten', data=json.dumps({"original_url": "https://www.example.com", "short_url": "custom"}), content_type='application/json')
    self.assertEqual(response.status_code, 201)
    self.assertIn(b'custom', response.data)

  def test_shorten_with_existing_custom_url(self):
    tester = app.test_client(self)
    tester.post('/shorten', data=json.dumps({"original_url": "https://www.example.com", "short_url": "custom"}), content_type='application/json')
    response = tester.post('/shorten', data=json.dumps({"original_url": "https://www.example2.com", "short_url": "custom"}), content_type='application/json')
    self.assertEqual(response.status_code, 400)
  
  def test_redirect(self):
    tester = app.test_client(self)
    response = tester.post('/shorten', data=json.dumps({"original_url": "https://www.google.com"}), content_type='application/json')
    self.assertEqual(response.status_code, 201)
    data = json.loads(response.data)
    short_url = data['short_url']
    response = tester.get('/{}'.format(short_url))
    self.assertEqual(response.status_code, 302)
    self.assertEqual(response.headers['Location'], 'https://www.google.com')

  def test_redirect_with_invalid_url(self):
    tester = app.test_client(self)
    response = tester.get('/invalid')
    self.assertEqual(response.status_code, 404)

  def test_analytics(self):
    tester = app.test_client(self)
    # Create a short URL
    response = tester.post('/shorten', data=json.dumps({"original_url": "https://www.yahoo.com"}), content_type='application/json')
    self.assertEqual(response.status_code, 201)
    data = json.loads(response.data)
    short_url = data['short_url']
    # Retrieve analytics data for the short URL
    response = tester.get('/analytics/{}'.format(short_url))
    self.assertEqual(response.status_code, 200)
    analytics_data = json.loads(response.data)
    # Assert that the usage count is 0
    self.assertEqual(analytics_data['usage'], 0)
    # Assert that the creation time is a valid timestamp
    self.assertIsInstance(analytics_data['creation_time'], float)

