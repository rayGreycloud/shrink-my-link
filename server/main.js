import { Meteor } from 'meteor/meteor';
import { Links } from '../imports/collections/links';
import { WebApp } from 'meteor/webapp';
import ConnectRoute from 'connect-route';

Meteor.startup(() => {
  Meteor.publish('links', function() {
    return Links.find({});
  });
});

function onRoute(req, res, next) {
  // pull token and search for match
  const link = Links.findOne({ token: req.params.token });

  // if match found, redirect to long url
  if (link) {
    // update clicks count
    Links.update(link, { $inc: { clicks: 1}});
    //redirect to original url
    res.writeHead(307, { 'Location': link.url});
    res.end();
  } else {
    // if no match, redirect to app
    next();
  }
}

const middleware = ConnectRoute(function (router) {
  router.get('/:token', onRoute);
});

WebApp.connectHandlers.use(middleware);
