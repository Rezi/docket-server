var url = require('url');

module.exports = function(req, res, next) {
  var whitelist = [
    'localhost',
    '10.0.0.1',
    '10.0.0.2',
    '10.0.0.3',
    'buri.be',
    'checklist.buri.be',
    'buri',
    'c-heck.herokuapp.com',
    'docket.work',
    'www.docket.work'
  ];
  if (req.isSocket) {
    var socketHostname = url.parse(req.socket.handshake.headers.origin)
      .hostname;
  }
  if (whitelist.includes(req.host) || whitelist.includes(socketHostname)) {
    next();
  } else {
    res.status(400).json('Not allowed host');
  }
};
