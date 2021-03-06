frameworkless-view-templeton [![NPM Version](http://img.shields.io/npm/v/frameworkless-view-templeton.svg?style=flat)](https://www.npmjs.org/package/frameworkless-view-templeton) [![Bower Version](http://img.shields.io/bower/v/frameworkless-view-templeton.svg?style=flat)](http://bower.io/search/?q=frameworkless-view-templeton)
=============

A simple view-presenter module for [frameworkless](https://github.com/synacorinc/frameworkless), using [Templeton](https://github.com/developit/templeton).

**[View Demo](http://frameworkless-view-templeton.herokuapp.com/demo/)**

[![Build Status](https://img.shields.io/travis/developit/frameworkless-view-templeton.svg?style=flat&branch=master)](https://travis-ci.org/developit/frameworkless-view-templeton)
[![Dependency Status](http://img.shields.io/david/developit/frameworkless-view-templeton.svg?style=flat)](https://david-dm.org/developit/frameworkless-view-templeton)
[![devDependency Status](http://img.shields.io/david/dev/developit/frameworkless-view-templeton.svg?style=flat)](https://david-dm.org/developit/frameworkless-view-templeton#info=devDependencies)

[![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)


---


Features
--------

- Built-in declarative event delegation
- Uses [Templeton](http://github.com/developit/templeton) to render HTML view templates


---


Installation
============


Use a Package Manager
---------------------
**bower:**

```bash
bower install frameworkless-view-templeton
# copy the stuff you want
cp bower_components/frameworkless-view-templeton/dist/view.js src/lib
```

**npm:**

```bash
npm install frameworkless-view-templeton
# copy the stuff you want
cp node_modules/frameworkless-view-templeton/dist/view.js src/lib
```


Use the Source
--------------

Get started right away, so you can disassemble and play around at your lesure.

```bash
# Clone frameworkless-view-templeton
git clone git@github.com:developit/frameworkless-view-templeton.git

# Install development dependencies
npm install

# Build the library
npm run-script build      # or just `grunt` if you have grunt-cli installed globally

# Check out the demo
PORT=8080 npm start       # this just does `node server.js`
```


---


Basic Usage
-----------

```JavaScript
require(['view'], function(view) {

	// We're using Templeton/Handlebars templates:
	var template = '<h1>{{{title}}}</h1> <button id="hi">Click Me</button>';

	// Instantiate a view:
	var page = view( template );

	// Wire up some events:
	page.hookEvents({
		'click button#hi' : function() {
			alert( 'Title: ' + page.$$('h1').textContent );
		}
	});

	// Insert the view into the DOM:
	page.insertInto( document.body );

});
```


Concise Example
---------------

```JavaScript
var view = require('view');

var list = view({
	template : '<ul> {{#items}}<li>{{.}}</li>{{/items}} </ul>',

	events : {
		'click li' : 'clickItem'
	},

	// a delegated event handler
	clickItem : function(e) {
		console.log(e.delegationTarget.getAttribute('title'));
	}
};

// insert into a parent node:
list.insertInto(document.body);

// template some data:
list.render({
	items : [ 'Peach', 'Mango', 'Orange' ]
});
```


Integrated Example
------------------

```JavaScript
define([
	'view',
	'text!templates/index.html'		// just an HTML file
], function(view, template) {
	var page = {
		events : {
			'click #submit' : 'submit',
			'mouseover .tip' : 'showTip'
		},

		submit : function() {
			this.view.$$('form').subimt();
		},

		showTip : function(e) {
			var tip = this.view.$$('#tip');
			tip.textContent = e.delegationTarget.getAttribute('title');
			tip.style.display = '';
		},

		load : function(params, router) {
			if (!this.view) {
				// initialize a view:
				this.view = view(template);

				// wire up event handlers:
				this.view.hookEvents(this.events, this);
			}

			// Template some data into the view:
			this.view.template({
				title : 'Test Title',
				params : params
			});

			// insert view into DOM:
			this.view.insertInto(document.body);
		},

		unload : function() {
			// remove view from DOM:
			this.view.remove();
		}
	};
	return page;
});
```


---


Quick Repo Tour
---------------

* `/src` is where the source code lives
* `/dist` is the built library
* `/demo` is a simple demo, using [requirejs](http://requirejs.org)



---


License
-------

BSD
