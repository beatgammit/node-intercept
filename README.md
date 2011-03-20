Intro
=====

Node-intercept overrides the res.write and res.end functions in node and provides you with a layered approach to filtering what leaves your server.  Everything is done in synchronously asynchronous layers through promises.  Confusing? Read on.

For example, you want to gzip all of you data unless the outgoing data is binary data.  Everywhere in your code you just do res.write with no second parameter except where you do a res.end, and you specify some kind of binary encoding.  To accomplish this, you would normally pass your data to a compress function of some sort and then pass it to res.write or res.end.  This can get very annoying and hard to manage.

Node-intercept simplifies the entire process.  Now you can register callbacks, and each one will be will be called in the order that they were registered and it will wait until each has finished before moving on to the next one.  This is implemented using a next method in your function.  If you do not call next in your function, your response will never be sent.
