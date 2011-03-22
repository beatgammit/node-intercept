Intro
=====

Node-intercept overrides the ServerRequest.write and ServerRequest.end functions in node and provides you with a layered approach to filtering.  Just pass in an array of functions and they will be called in order.

This module is meant to make compression easier. Just pass in a function, compress the chunk, and pass on the data through the callback.

Remember, "with great power comes great responsibility".  I beg of you, please use this module to make your code cleaner and not to do hack something unnatural. Then again, this code is open source, so I suppose there is nothing I can do.

Dependencies
------------

Uses the forEachAsync in futures.  See the main page of futures for more information:

https://github.com/coolaj86/futures

To install:

`npm install futures`

Usage Guide
===========

So far, there are only two methods that are overridden.  The intercept function takes one parameter, an options object, in which you can specify functions to be called when the ServerResponse.write and ServerResponse.end methods are called.  Here are basic usage instructions:

* The two properties that can be specified are write and end
* Each property can be either an array or function
* The first parameter will be a callback, which must be called exactly once.
  * The first parameter will be used to update the the data to be passed to the native method
  * If no parameters are passed, life will go on, but your changes will not
* After all callbacks have been processed, the native method will be called with the updated data object
* If a callback was specified, it will be called last

Source
======

The source is pretty simple and pretty straightforward.

intercept.js
------------

This is where the module lives.  There is only one parameter, an options object. Possible properties are:

* write- a function or an array of functions to be called in order when write is called
* end- a function or an array of functions to be called in order when end is called
