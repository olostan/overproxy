#!/usr/bin/env node

const program = require('commander');
      https = require('https'),
      http = require('http'),
      httpProxy = require('http-proxy'),
      serveStatic = require('serve-static'),
      createStatic = require('connect-static'),
      fs = require('fs'),
      path = require('path')
;

program
.version('0.1.0')
.option('-l, --local <path>', 'Path where local overrides are stored','.')
.option('-t, --target <url>', 'Target URL')
.option('-p, --port <port>','Port number to use','8080', parseInt)
.option('-c, --compress', 'Use compression when proxying local files (WARNING: aggressive caching)')
.option('-s, --ssl', 'Use SSL (key and cert are required)')
.option('-k, --key <path-to-key.pem>', 'SSL Key (if SSL is enabled)')
.option('--cert <path-to-cert.pem>', 'SSL Certificate (if SSL is enabled)')
.parse(process.argv);

if (!program.target) error("Target URL is required");
if (!(program.target.startsWith('http://') || program.target.startsWith('https://')) ) 
  error("Target URL should be https:// or http://");

if (!fs.existsSync(program.local))
  error("Can't access to path where local overrides located");

if (program.ssl) {
  if (!program.key) error("No SSL Key file specified, but it is required for SSL");
  if (!program.cert) error("No SSL Certificate file specified, but it is required for SSL");
  if (!fs.existsSync(program.key)) error("Specified SSL key file was not found: "+program.key);
  if (!fs.existsSync(program.key)) error("Specified SSL certificate file was not found: "+program.cert);
}

const proxy = httpProxy.createProxyServer({
  secure: false,
  changeOrigin: true
});

const spath = path.resolve(program.local);

function createOverrides(fn) {
  const staticOptions = { dir: spath};  
   if (program.compress) createStatic(staticOptions,fn);
   else fn(null, serveStatic(staticOptions.dir));
}

var serveOverrides = serveStatic(spath, {'index': ['index.html', 'index.htm']})

function setupServer() {
  let handler = function (req, res) {
    serveOverrides(req,res, () => {
     // console.log("Resource was not overrided:", req.url);
      proxy.web(req, res, {
          target: program.target
      });
      }
    );
  }

  createOverrides(function(err, serveOverrides) {
    const server = program.ssl?
      https.createServer(
        {
          key: fs.readFileSync(program.key, 'utf8').toString(),
          cert: fs.readFileSync(program.cert, 'utf8').toString()
        }, handler):
      http.createServer(handler);
    server.on('error', (e) => error(e.code));

    server.listen(program.port, () => 
      console.log(`Overriding proxy for ${program.target} from ${spath} is ready on http${program.ssl?'s':''}://localhost:${program.port}`)
    );
  });
}
setupServer();


function error(msg) {
  console.log("ERROR:", msg);
  process.exit(100);
}
