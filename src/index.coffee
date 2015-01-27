_ = require 'lodash'
ko = require 'knockout'
props = require 'pathval'

findChild = (observable, path)->
  paths = path.split('.')
  currentObj = observable
  for property, i in paths
    if !ko.unwrap(currentObj)[property]? then return
    currentObj = ko.unwrap(currentObj)[property]
  return currentObj

injectError = (error, observable, translateMessage)->
  if !error?.path?.length then return
  childObservable = findChild(observable, error.path)
  if !childObservable or !_.isFunction(childObservable.getOwnManualErrors) then return

  meta = undefined
  if childObservable?.getConfigs? then meta = childObservable.getConfigs()
  childObservable.getOwnManualErrors.push translateMessage(error?.message, meta)

module.exports = (errors, givenObservable, translateMessage)->
  translateMessage = translateMessage or (key)-> key
  observable = ko.unwrap(givenObservable)
  _.each errors, (error)->
    injectError(error, observable, translateMessage)
