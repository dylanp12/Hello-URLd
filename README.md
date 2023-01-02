#       Welcome to Hello, URLd! 

---------------------------------------------------

# Quick Start Guide

### Prerequisites:
    Docker & Docker compose 
### Building the app
    Start the docker daemon: 
    
    sudo systemctl start docker
    

    In your terminal, inside the root directory of the project run: 
    
    docker compose up --build 

    You can now access the app by typing localhost in your browser, and visiting it. 
    
### Accessing your short URLs:
    To visit the short url, in your browser visit localhost/shorty/<yourShortUrl>

### Running the unit tests:
    In your terminal run pip3 install unittest
    python3 -m unittest discover tests

## For reference, the API Specification: 


# Create a new short URL for a given original URL.

#### Request
```
POST /shorten
```

#### Parameters
original_url: The original URL to be shortened. (required)
short_url: The desired short URL. If not provided, a unique 
short URL will be generated. (optional)

Example:
```
{
  "original_url": "https://www.example.com",
  "short_url": "abc123"
}
```

#### Response
 Success
 Status code: 201 Created

```
{
  "short_url": "abc123"
}
```

#### Error
Status code: 400 Bad Request

```
{
  "error": "Short URL is already in use"
}
```

# Redirect
Redirect the user to the original URL when the short URL is accessed.

#### Request
```
GET /{short_url}
```

#### Parameters
short_url: The short URL. (required)
Example
```
GET /abc123
```

#### Response
```
Success
Status code: 302 Found
```

Location header: The original URL.

# Analytics
Retrieve analytics data for a specific short URL.

#### Request
```
GET /analytics/{short_url}
```

#### Parameters

short_url: The short URL. (required)

Example:
```
GET /analytics/abc123
```

#### Response
```
Success
Status code: 200 OK
```

```
{
  "usage": 0,
  "creation_time": 1617151681.356944
}
```

#### Error
```
Status code: 404 Not Found
```

```
{
  "error": "Short URL not found"
}
```

# Delete URL
Delete a short URL.

#### Request
```
DELETE /modify/{short_url}
```

#### Parameters
short_url: The short URL. (required)
Example
```
DELETE /modify/abc123
```

#### Response
```
Success
Status code: 200 OK
```

```
{
  "message": "Short URL deleted successfully"
}
```

#### Error
```
Status code: 404 Not Found
```

```
{
  "error": "Short URL not found"
}
```


