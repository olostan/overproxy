# overproxy
Overriding HTTP/HTTPS Proxy 

This tool is used for overriding resources on published web sites with local ones. 

## Installation

```
npm install -h overproxy
```

## Usage

To override from http://example.org/ using current folder, you can run:

```
overproxy -t http://example.org -l . 
```

As the result you should have:
```
Overriding proxy for http://example.org/ from /Users/olostan/temp is ready on http://localhost:8080
```

After that opening http://localhost:8080/ will open example.org, except files from folder where overproxy was run.

## Notices

- Using 'compress' option enable very agressive caching, so overriden content will not be re-read when changed.
- If you would like to see result on 'http://example.org', you can [modify 'hosts' file](https://www.howtogeek.com/howto/27350/beginner-geek-how-to-edit-your-hosts-file/).


## Full usage:
```
  Usage: overproxy [options]


  Options:

    -V, --version                output the version number
    -l, --local <path>           Path where local overrides are stored (default: .)
    -t, --target <url>           Target URL
    -p, --port <port>            Port number to use (default: 8080)
    -c, --compress               Use compression when proxying local files (WARNING: aggressive caching)
    -s, --ssl                    Use SSL (key and cert are required)
    -k, --key <path-to-key.pem>  SSL Key (if SSL is enabled)
    --cert <path-to-cert.pem>    SSL Certificate (if SSL is enabled)
    -h, --help                   output usage information

```
