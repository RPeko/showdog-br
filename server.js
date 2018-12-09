// const path = require('path');
// const express = require('express');
// const app = express();

// // Serve static files
// app.use(express.static(__dirname + '/dist/showdog-b'));

// // Send all requests to index.html
// app.get('/*', function(req, res) {
//   res.sendFile(path.join(__dirname + '/dist/showdog-b/index.html'));
// });

// // default Heroku port
// app.listen(process.env.PORT || 5000);

//Install express server
const express = require('express');
const path = require('path');

const app = express();

// Serve only the static files form the dist directory
// Replace the '/dist/<to_your_project_name>'
app.use(express.static(__dirname + '/dist/showdog-b'));

app.get('*', function(req,res) {
  // Replace the '/dist/<to_your_project_name>/index.html'
  res.sendFile(path.join(__dirname+ '/dist/showdog-b/index.html'));
});
// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 8080);