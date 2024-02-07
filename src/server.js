const http = require('http');
const url = require('url');
const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const urlStruct = {
  GET: {
    '/': htmlHandler.getIndex,
    '/style.css': htmlHandler.getCSS,
    '/getUsers': jsonHandler.getUsers,
    '/updateUsers': jsonHandler.updateUser,
    notFound: jsonHandler.notFound,
  },
  HEAD: {
    '/getUsers': jsonHandler.getUsersMeta,
    notFound: jsonHandler.notFoundMeta,
  },
};

const onRequest = (request, response) => {
  const parsedUrl = url.parse(request.url);

  // methodHandlers is either the 'GET' or 'HEAD' object from urlStruct.
  const methodHandlers = urlStruct[request.method];
  if (!methodHandlers) {
    urlStruct.HEAD.notFound(request, response);
  }

  // handlerFunction is specific function based off the object methodHandlers represents.
  const handlerFunction = methodHandlers[parsedUrl.pathname];
  if (handlerFunction) {
    handlerFunction(request, response);
  } else {
    methodHandlers.notFound(request, response);
  }

  // if (urlStruct[parsedUrl.pathname]) {
  //   urlStruct[parsedUrl.pathname](request, response);
  // } else {
  //   urlStruct.notFound(request, response);
  // }
};

http.createServer(onRequest).listen(port, () => {
  console.log(`Listening on 127.0.0.1: ${port}`);
});
