#       Welcome to Hello, URLd! 
###          by Dylan Parent for Cloudflare

## For reference, the API Specification as follows: 

` POST /shorten: This endpoint will be used to create a new short URL. It will take the original URL and the desired short URL (if specified) as input parameters. It will return the short URL if it is successfully created, or an error message if it is not.

GET /{short_url}: This endpoint will be used to redirect the user to the original URL when the short URL is accessed. It will take the short URL as a path parameter and return a redirect response to the original URL.

GET /analytics/{short_url}: This endpoint will be used to retrieve analytics data for a specific short URL. It will take the short URL as a path parameter and return data such as the number of clicks, referrers, and geographical location of users.

DELETE /{short_url}: This endpoint will be used to delete a short URL. It will take the short URL as a path parameter and return a success message if the URL is deleted, or an error message if it is not.

GET /list: This endpoint will be used to retrieve a list of all the short URLs in the system. It will return a list of short URLs and their corresponding original URLs. `