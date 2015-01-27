var findChild, injectError, ko, props, _;

_ = require('lodash');

ko = require('knockout');

props = require('pathval');

findChild = function(observable, path) {
  var currentObj, i, paths, property, _i, _len;
  paths = path.split('.');
  currentObj = observable;
  for (i = _i = 0, _len = paths.length; _i < _len; i = ++_i) {
    property = paths[i];
    if (ko.unwrap(currentObj)[property] == null) {
      return;
    }
    currentObj = ko.unwrap(currentObj)[property];
  }
  return currentObj;
};

injectError = function(error, observable, translateMessage) {
  var childObservable, meta, _ref;
  if (!(error != null ? (_ref = error.path) != null ? _ref.length : void 0 : void 0)) {
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
