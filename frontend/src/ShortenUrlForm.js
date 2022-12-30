import React, { useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';

function ShortenUrlForm() {
  const [url, setUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [error, setError] = useState('');
  const [analytics, setAnalytics] = useState('');
  
  const handleSubmit = e => {
    e.preventDefault();
    // Make a POST request to the /shorten endpoint to create a new short URL
    fetch('/shorten', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ original_url: url, short_url: shortUrl })
    })
      .then(res => res.json())
      .then(response => {
        if (response.error) {
          setError(response.error);
        } else {
          setError('');
          setShortUrl(response.short_url);
        }
      })
      .catch(error => console.error(error));
  };

  const handleAnalytics = e => {
    e.preventDefault();
    // Make a GET request to the /analytics/{short_url} endpoint to retrieve analytics data
    fetch(`/analytics/${shortUrl}`)
      .then(res => res.json())
      .then(response => {
        if (response.error) {
          setError(response.error);
        } else {
          setError('');
          setAnalytics(response);
        }
      })
      .catch(error => console.error(error));
  };

  const handleDelete = e => {
    e.preventDefault();
    // Make a DELETE request to the /modify/{short_url} endpoint to delete the short URL
    fetch(`/modify/${shortUrl}`, { method: 'DELETE' })
      .then(res => res.json())
      .then(response => {
        if (response.error) {
          setError(response.error);
        } else {
          setError('');
          setShortUrl('');
          setAnalytics('');
        }
      })
      .catch(error => console.error(error));
  };

  return (
    <Container>
      <Row>
        <Col xs={12} md={6}>
          <h1>Shorten URL</h1>
          {error && <p className="text-danger">{error}</p>}
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formUrl">
              <Form.Label>URL</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter URL"
                value={url}
                onChange={e => setUrl(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formShortUrl">
              <Form.Label>Custom Short URL</Form.Label>
              <Form.Control
                type="text"
                placeholder="Optional"
                value={shortUrl}
                onChange={e => setShortUrl(e.target.value)}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Shorten
            </Button>
          </Form>
        </Col>
        <Col xs={12} md={6}>
          {shortUrl && (
            <>
              <h1>Short URL</h1>
              <a href={shortUrl} target="_blank" rel="noopener noreferrer">
                {shortUrl}
              </a>
              <br />
              <Button variant="secondary" onClick={handleAnalytics}>
                View Analytics
              </Button>
              {' '}
              <Button variant="danger" onClick={handleDelete}>
                Delete
              </Button>
            </>
          )}
          {analytics && (
            <>
              <h1>Analytics</h1>
              <p>
                <strong>Usage:</strong> {analytics.usage}
              </p>
              <p>
                <strong>Creation Time:</strong>{' '}
                {new Date(analytics.creation_time * 1000).toLocaleString()}
              </p>
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default ShortenUrlForm;

