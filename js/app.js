// es5, 6, and 7 polyfills, powered by babel
import polyfill from "babel-polyfill"

//
// fetch method, returns es6 promises
// if you uncomment 'universal-utils' below, you can comment out this line
import fetch from "isomorphic-fetch"

// universal utils: cache, fetch, store, resource, fetcher, router, vdom, etc
// import * as u from 'universal-utils'

// the following line, if uncommented, will enable browserify to push
// a changed fn to you, with source maps (reverse map from compiled
// code line # to source code line #), in realtime via websockets
// -- browserify-hmr having install issues right now
// if (module.hot) {
//     module.hot.accept()
//     module.hot.dispose(() => {
//         app()
//     })
// }

// Check for ServiceWorker support before trying to install it
// if ('serviceWorker' in navigator) {
//     navigator.serviceWorker.register('./serviceworker.js').then(() => {
//         // Registration was successful
//         console.info('registration success')
//     }).catch(() => {
//         console.error('registration failed')
//             // Registration failed
//     })
// } else {
//     // No ServiceWorker Support
// }

import DOM from 'react-dom'
import React, {Component} from 'react'

function app() {
    // start app
    // new Router()
    var AppView = React.createClass ({

  //   	componentWillMount: function(){
		// 	var self = this

		// 	this.props.articles.on('sync',function() {self.forceUpdate()})
		// },

    	render: function() {
    		console.log("rendering etsy app")
    		return (
    			<div className="etsyContainer">
    				{/*<Header />*/}
    				<ListingGrid listingData={this.props} />
    			</div>
    		)
    	}
    })

    var ListingGrid = React.createClass({
    	render: function() {
    		console.log(this)
    	}
    })

    // var Listing = React.createClass({

    // })

    var ListModel = Backbone.Model.extend({
    	_apiKey: apiKey,
    	url: "https://openapi.etsy.com/v2/listings/active.js?"
    })

    var EtsyRouter = Backbone.Router.extend({

     routes: {
         "home": "handleListView",
         // "details/:id": "handleDetailView",
         // "search/:keywords": "handleSearchView",
         "*default": "handleListView"
     },

     handleListView: function() {
     	var listModel = new ListModel()
     	var promise = listModel.fetch({
     		dataType: "jsonp",
            data: {
            	includes: "Images,Shop",
            	api_key: listModel._apiKey
        	}

     	})
        promise.then(function(jsonData) {console.log(jsonData)})
     	
     	DOM.render(<AppView etsyData={listModel}/>, document.querySelector('.container'))
     },

     initialize: function() {
			Backbone.history.start()
	 }


	})

	var router = new EtsyRouter()
}	

app()
