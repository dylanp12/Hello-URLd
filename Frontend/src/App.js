import React from 'react';
import {
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Container,
  Row,
  Col,
  Table
} from 'reactstrap';
import { Modal } from 'react-bootstrap'
import axios from 'axios';
import './App.css';

const API_BASE_URL = 'http://localhost:8000'

class App extends React.Component {
  state = {
    originalUrl: '',
    shortUrl: '',
    urls: [],
    analytics: {},
    url_mapping: {},
  };

  // Fetch the list of URLs when the component is mounted
  componentDidMount() {
    this.getUrls();
  }

  // Retrieve the list of URLs
  getUrls = () => {
    axios.get(`${API_BASE_URL}/list`).then(response => {
      this.setState({ urls: response.data });
    });
  }

  // Handle changes to the original URL input field
  handleOriginalUrlChange = event => {
    this.setState({ originalUrl: event.target.value });
  }

  // Handle changes to the short URL input field
  handleShortUrlChange = event => {
    this.setState({ shortUrl: event.target.value });
  }

  // Create a new short URL
  handleShorten = event => {
    event.preventDefault();

    const data = {
      original_url: this.state.originalUrl,
      short_url: this.state.shortUrl
    };

    axios.post(`${API_BASE_URL}/shorten`, data).then(response => {
      this.setState({ shortUrl: response.data.short_url });
      this.setState({url_mapping: Object.assign(data)})
      this.getUrls();
    });
  }

  // Retrieve analytics data for a specific short URL
  handleAnalytics = shortUrl => {
    axios.get(`${API_BASE_URL}/analytics/${shortUrl}`).then(response => {
      this.setState({ analytics: response.data});
    });

    let stats = ""
    for (const[key, value] of Object.entries(this.state.analytics))
    {
      stats += `${key}: ${value}\n`
    }
  

    return (
      <>
      <Button variant="primary">
        Launch demo modal
      </Button>

      <Modal>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary">
            Close
          </Button>
          <Button variant="primary">
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
    );
    
  }
  

  // Delete a short URL
  handleDelete = shortUrl => {
    axios.delete(`${API_BASE_URL}/modify/${shortUrl}`).then(response => {
      this.getUrls();
    });
  }

  render() {
    return (
      <Container>
        <Row>
          <Col>
            <h1>URL Shortener</h1>
            <Form onSubmit={this.handleShorten}>
              <FormGroup>
                <Label for="originalUrl">Original URL</Label>
                <Input type="text" name="originalUrl" id="originalUrl" value={this.state.originalUrl} onChange={this.handleOriginalUrlChange} />
              </FormGroup>
              <FormGroup>
                <Label for="shortUrl">Short URL (optional)</Label>
                <Input type="text" name="shortUrl" id="shortUrl" value={this.state.shortUrl} onChange={this.handleShortUrlChange} />
              </FormGroup>
              <Button color="primary">Shorten</Button>
            </Form>
          </Col>
        </Row>
        <Row>
          <Col>
            <h2>URLs</h2>
            <Table className='table'>
              <thead>
                <tr>
                  <th>Short URL</th>
                  <th>Original URL</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {this.state.urls.map(url => (
                  <tr key={url}>
                    <td>{url}</td>
                    <td>{this.state.url_mapping[url]}</td>
                    <td>
                      <Button onClick={() => this.handleAnalytics(url)}>Refresh Analytics</Button>{' '}
                      <Button onClick={() => this.handleDelete(url)}>Delete</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default App;
