# Timestamp Microservice API

This Timestamp Microservice API takes a date passed in as a string parameter in the url, checks the date's validity, and returns both the Unix timestamp and the natural language form of the date.  If the date is not valid, it returns null for both properties.

Frameworks used: Node.js, Express.js

### Usage

#### Example Usage

```
http://timestamp-ytv.herokuapp.com/1467844008
http://timestamp-ytv.herokuapp.com/June 6, 2016
http://timestamp-ytv.herokuapp.com/Jun 6 16
http://timestamp-ytv.herokuapp.com/6 6 16
```
#### Example Output

```javascript
{
    unix: 1467844008,
    natural: "June 6, 2016"
}
```

### See it Live

```
[http://timestamp-ytv.herokuapp.com/](http://timestamp-ytv.herokuapp.com/)
```

### Launch

Launch this project with node `index.js`.
