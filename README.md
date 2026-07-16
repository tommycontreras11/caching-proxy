# 🚀 Caching Proxy

**Project URL:** https://roadmap.sh/projects/caching-server

A command-line application built with **Node.js** and **Express** that starts a caching proxy server. The proxy forwards HTTP requests to an origin server, caches successful JSON responses in memory, and serves cached responses on subsequent requests to reduce unnecessary network calls.

---

# 🚀 Features

## Proxy Server

* Start a local caching proxy server
* Forward requests to any origin server
* Support any request path using Express middleware
* Preserve the origin server's HTTP status code

## In-Memory Caching

* Cache responses by request URL
* Return cached responses for repeated requests
* Add an `X-Cache` header indicating cache status
* Clear the entire cache from the CLI

## CLI

* Interactive command-line interface
* Required argument validation
* Helpful validation messages
* Invalid command detection

## Error Handling

* Invalid command detection
* Invalid argument detection
* Missing argument detection
* Invalid value detection
* Origin server error handling

---

# 🛠 Technologies Used

* JavaScript (ES Modules)
* Node.js
* Express
* Fetch API

---

# 🏗 Architecture

The application follows a simple modular architecture where each module has a single responsibility.

```text
                User
                  │
                  ▼
          Command Line (stdin)
                  │
                  ▼
         Command Dispatcher
                  │
                  ▼
        Input Validation Module
                  │
                  ▼
          Proxy Server (Express)
                  │
                  ▼
          Cache Lookup (Map)
          ┌────────┴────────┐
          │                 │
        HIT               MISS
          │                 │
          ▼                 ▼
    Return Cache      Origin Server
          │                 │
          └────────┬────────┘
                   ▼
             Client Response
```

## Module Responsibilities

| Module     | Responsibility                        |
| ---------- | ------------------------------------- |
| CLI        | Read user commands                    |
| Validation | Validate arguments and values         |
| Helpers    | Parse CLI input                       |
| Proxy      | Forward requests to the origin server |
| Cache      | Store and retrieve cached responses   |
| Output     | Return responses with cache headers   |

---

# 📂 Project Structure

```text
caching-proxy/
│
├── helper.js
├── index.js
├── package.json
├── .gitignore
└── README.md
```

---

# ▶ Installation

Clone the repository:

```bash
git clone https://github.com/tommycontreras11/caching-proxy.git
```

Navigate to the project:

```bash
cd caching-proxy
```

Install dependencies:

```bash
npm install
```

---

# ▶ Running the Project

Start the CLI:

```bash
npm start
```

Or, during development:

```bash
npm run dev
```

Once running, you can execute commands directly from the terminal.

---

# 💻 Available Commands

## Start the Proxy Server

```bash
caching-proxy --port 3000 --origin https://dummyjson.com
```

This starts the proxy server on port **3000** and forwards all incoming requests to:

```text
https://dummyjson.com
```

Example request:

```http
GET http://localhost:3000/products
```

The proxy forwards the request to:

```http
GET https://dummyjson.com/products
```

---

## Clear the Cache

```bash
caching-proxy --clear-cache
```

Removes all cached responses stored in memory.

---

## Exit the CLI

```bash
exit
```

---

# ⚙ Available Arguments

| Argument   | Description                          |
| ---------- | ------------------------------------ |
| `--port`   | Port where the proxy server will run |
| `--origin` | Origin server URL                    |

---

# 📄 Response Headers

Every response includes an `X-Cache` header.

### Cache Miss

```http
X-Cache: MISS
```

The resource was fetched from the origin server and stored in cache.

### Cache Hit

```http
X-Cache: HIT
```

The resource was served directly from memory.

---

# 📄 Example

Start the proxy:

```bash
caching-proxy --port 3000 --origin https://dummyjson.com
```

First request:

```http
GET http://localhost:3000/products
```

Response headers:

```http
HTTP/1.1 200 OK
X-Cache: MISS
```

Second request:

```http
GET http://localhost:3000/products
```

Response headers:

```http
HTTP/1.1 200 OK
X-Cache: HIT
```

---

# 🔎 How Caching Works

1. A client sends a request to the proxy server.
2. The proxy builds the corresponding URL for the origin server.
3. The application checks whether the URL already exists in the cache.
4. If the response is cached, it is returned immediately.
5. Otherwise, the proxy fetches the resource from the origin server.
6. The response is stored in memory.
7. Future requests for the same URL are served from the cache.

---

# ✅ Input Validation

The CLI validates:

* Unknown commands
* Unknown arguments
* Missing argument values
* Invalid port values
* Missing required arguments

Example:

```bash
caching-proxy --port abc --origin https://dummyjson.com
```

Output:

```text
The id --port must be a number.
```

---

# ❌ Error Handling

The application gracefully handles:

* Invalid commands
* Invalid arguments
* Missing values
* Invalid port numbers
* Network failures
* Origin server errors

Example:

```text
Unable to fetch resource.
```

---

# 💡 Future Improvements

Possible enhancements include:

* Cache expiration (TTL)
* LRU cache eviction
* Disk-based cache persistence
* Forward request headers
* Support binary responses
* Support all content types
* Cache based on HTTP method
* Ignore browser-specific requests (e.g. `.well-known`)
* Logging middleware
* Unit tests
* Integration tests
* Docker support
* Configuration file support

---

# 👨‍💻 Author

**Tommy Contreras**

GitHub: https://github.com/tommycontreras11

---

# 📄 License

This project is licensed under the **MIT License**.
