var _, findChild, injectError, ko, props;

_ = require('lodash');

ko = require('knockout');

props = require('pathval');

findChild = function(observable, path) {
  var currentObj, i, j, len, paths, property;
  path = path.replace(/\[/g, '.').replace(/\]/g, '.');
  paths = _.filter(path.split('.'), function(p) {
    return p != null ? p.length : void 0;
  });
  currentObj = observable;
  for (i = j = 0, len = paths.length; j < len; i = ++j) {
    property = paths[i];
    if (ko.unwrap(currentObj)[property] == null) {
      return;
    }
    currentObj = ko.unwrap(currentObj)[property];
  }
  return currentObj;
};

injectError = function(error, observable, translateMessage) {
  var childObservable, meta, ref;
  if (!(error != null ? (ref = error.path) != null ? ref.length : void 0 : void 0)) {
    return;
  }
  childObservable = findChild(observable, error.path);
  if (!childObservable || !_.isFunction(childObservable.getOwnManualErrors)) {
    return;
  }
  meta = void 0;
  if ((childObservable != null ? childObservable.getConfigs : void 0) != null) {
    meta = childObservable.getConfigs();
  }
  return childObservable.getOwnManualErrors.push(translateMessage(error != null ? error.message : void 0, meta));
};

module.exports = function(errors, givenObservable, translateMessage) {
  var observable;
  translateMessage = translateMessage || function(key) {
    return key;
  };
  observable = ko.unwrap(givenObservable);
  return _.each(errors, function(error) {
    return injectError(error, observable, translateMessage);
  });
};
