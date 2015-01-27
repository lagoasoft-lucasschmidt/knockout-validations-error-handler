# knockout validations error handler

A small function that will grab given errors and insert into an observable that uses extender *knockout-validations-extender*.

Uses feature _manualErrors_ from that extender.

# Params
- errors
  + array of error object (has path, has message). Eg:
  `` {"path": "consumer.id", message: "notNull"} ``
- givenObservable
  + observable that extends *knockout-validations-extender*
- [translateMessage]
  + function that receives a key, can return a translation of a message

