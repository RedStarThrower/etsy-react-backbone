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
import Backbone from 'bbfire'
import Header from './header'
import ListingView from './listingView'
import DetailView from './detailView'
import FaveButton from './faveButton'

function app() {
    // start app
    // new Router()  

    var FavesColl = Backbone.Firebase.Collection.extend({
        url: "https://etsy-faves.firebaseio.com/favorites"
    })

    var ListModel = Backbone.Model.extend({
        defaults: {
            favorite: false
        }
    }) 

    
    var ListCollection = Backbone.Collection.extend({
    	_apiKey: "aavnvygu0h5r52qes74x9zvo",
    	url: "https://openapi.etsy.com/v2/listings/active.js?",

        parse: function(rawJSON) {
            return rawJSON.results
        },

        model: ListModel
            
    })

     var DetailModel = Backbone.Model.extend({
        _apiKey: "aavnvygu0h5r52qes74x9zvo",
         url: "https://openapi.etsy.com/v2/listings/",

         parse: function(rawJSON) {
            return rawJSON.results[0]
        },

        defaults: {
            favorite: false
        }
    }) 

     var EtsyRouter = Backbone.Router.extend({

         routes: {
             "home": "handleListView",
             "details/:id": "handleDetailView",
             "favorites": "handleFavesView",
             "search/:keywords": "handleSearchView",
             "*default": "handleListView"
         },

         handleListView: function() {
         	this.listingCollection.fetch({
         		dataType: "jsonp",
                data: {
                	includes: "Images,Shop",
                	api_key: this.listingCollection._apiKey
            	}

         	})
           //  promise.then(function(jsonData) {
           //      console.log(jsonData)
           // })
         	var coll = this.listingCollection
         	DOM.render(<ListingView etsyData={coll}/>, document.querySelector('.container'))
         },

         handleDetailView: function(listingId) {
            var detailModel = new DetailModel()
            //console.log(detailModel)
            detailModel.url += listingId + ".js?"
            //console.log(detailModel.url)
            var promise = detailModel.fetch({
                 dataType: "jsonp",
                 data: {
                     includes: "Images,Shop",
                     api_key: detailModel._apiKey
                 }
             })
                // promise.then(function(jsonData) {
                //     console.log(jsonData)
                // })
    
                DOM.render(<DetailView favesColl={new FavesColl()} etsyData={detailModel}/>, document.querySelector('.container'))

         },

         handleFavesView: function() {
            var fc = new FavesColl()
            DOM.render(<ListingView etsyData={fc} />, document.querySelector('.container'))

         },

         handleSearchView: function(keywords) {
            this.listingCollection.fetch({
                 dataType: "jsonp",
                 data: {
                     keywords: keywords,
                     includes: "Images,Shop",
                     api_key: this.listingCollection._apiKey
                 }
             })
            var coll = this.listingCollection
            DOM.render(<ListingView favesColl={new FavesColl()} etsyData={coll}/>, document.querySelector('.container'))
         },

        
         initialize: function() {
            this.listingCollection = new ListCollection()
            Backbone.history.start()
    	 }

     })

	var router = new EtsyRouter()
}	

app()
