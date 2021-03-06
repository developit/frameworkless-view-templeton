/**	Provides a Class and mixin to enable event firing and listening.  
 *	If called directly as a function, <code>events()</code> is an alias of {@link events.mixin}.
 *	@module events
 *	@see http://nodejs.org/api/events.html
 *	@example
 *		var events = require('events');
 *		
 *		// create a default evented object:
 *		var hub = events();
 *		
 *		// or, mix {@link EventEmitter} into any existing object:
 *		var hub = { VERSION:1.0 };
 *		events(hub);
 *		
 *		// Now you can fire and hook events on your object:
 *		hub.on('hubba', function() {
 *			console.log('bubba');
 *		});
 *		
 *		hub.emit('hubba');		// "bubba"
 */
(function(factory) {
	if (typeof window.define==='function' && window.define.amd) {
		window.define([], factory);
	}
	else {
		factory();
	}
}(function() {
	var key = '_eventemitterevents';
	
	function copy(t, f, i) {
		for (i in f) {
			if (f.hasOwnProperty(i)) {
				t[i]=f[i];
			}
		}
		return t;
	}
	
	
	/**	Add events to a Class by inheriting from EventEmitter, or instance it to keep event-related methods in the prototype of an object.
	 *	@class EventEmitter
	 *	@memberOf module:events
	 *	@example
	 *		var events = require('events');
	 *		
	 *		function Person() {
	 *			EventEmitter.call(this);
	 *		}
	 *		
	 *		// Option 1: ES5 inheritance
	 *		Person.prototype = Object.create(events.EventEmitter);
	 *		// Option 2: use a library
	 *		util.inherits(Person, events.EventEmitter);
	 *		
	 *		// @fires greet
	 *		Person.prototype.sayHello = function(message) {
	 *			this.emit('greet', message);
	 *		};
	 *		
	 *		// Make a new Person:
	 *		var me = new Person();
	 *		
	 *		// Listen for a "greet" and log it to the console:
	 *		me.on('greet', function(message) {
	 *			console.log('greeting received: ', message);
	 *		});
	 *		
	 *		me.sayHello("Hi");   // "greeting received: Hi"
	 */
	function EventEmitter(obj) {
		if (!(this instanceof EventEmitter)) {
			obj = copy(obj || {}, proto);
			obj[key] = [];
			return obj;
		}
		this[key] = [];
	}
	
	var proto = EventEmitter.prototype;
	copy(proto, /** @lends module:events.EventEmitter# */ {
		
		/**	Register a Function to be called in response to events of a given <code>type</code>.  
		 *	*Note:* Arguments to <code>handler</code> are the arguments passed to {@link EventEmitter#emit}, excluding <code>type</code>.
		 *	@param {String} type		The event type to listen for
		 *	@param {Function} handler	A function to call in response to the event being fired
		 */
		on : function(type, handler) {
			this[key].push([type, handler]);
			return this;
		},
		
		/**	Unsubscribe a function from events of a given <code>type</code>.
		 *	@param {String} type		The event type from which <code>handler</code> should be unsubscribed
		 *	@param {Function} handler	A reference to the Function to be unsubscribed from <code>type</code> events
		 */
		removeListener : function(type, handler) {
			var listeners = this[key],
				i = listeners.length;
			while (i--) {
				if (listeners[i][0]===type && listeners[i][1]===handler) {
					return listeners.splice(i, 1), this;
				}
			}
			return this;
		},
		
		/**	Register an event handler that removes itself after invocation.
		 *	@see module:events.EventEmitter#on
		 */
		once : function(type, handler) {
			return this.on(type, function once() {
				this.removeListener(type, once);
				return handler.apply(this, arguments);
			});
		},
		
		/**	Trigger/emit/fire an event of the given <code>type</code>. All arguments except <code>type</code> get passed on to registered event handlers.
		 *	@param {String} type		The event type from which <code>handler</code> should be unsubscribed
		 *	@param {Any} [args*]		Any arguments to pass to all handlers
		 */
		emit : function(type) {
			var args = [].slice.call(arguments,1),
				listeners = this[key],
				i = listeners.length;
			while (i--) {
				if (listeners[i][0]===type) {
					listeners[i][1].apply(this, args);
				}
			}
			return this;
		}
	});
	
	/**	Alias of {@link module:events.EventEmitter#on on()}
	 *	@function module:events.EventEmitter#addListener
	 */
	proto.addListener = proto.on;
	
	/**	Alias of {@link module:events.EventEmitter#emit emit()}
	 *	@function module:events.EventEmitter#trigger
	 */
	proto.trigger = proto.emit;
	
	/**	Enhance the given object with {@link module:events.EventEmitter EventEmitter} functionality.
	 *	@param {Object} [obj={}]		The object to enhance. If unspecified, a new object will be used.
	 *	@returns Returns the first argument, <code>obj</code>, for convenience.
	 *	@function module:events.mixin
	 */
	EventEmitter.mixin = EventEmitter.EventEmitter = EventEmitter;
	
	return EventEmitter;
}));
