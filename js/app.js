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
import Backbone from 'backbone'

function app() {
    // start app
    // new Router()
    var ListingView = React.createClass ({

    	componentWillMount: function(){
            var self = this
			this.props.etsyData.on('sync',function() {self.forceUpdate()})
        },

        componentWillUnmount: function() {
            this.props.etsyData.off('sync')
        },

    	render: function() {
    		console.log("rendering etsy app")
            console.log(this.props.etsyData)
    		return (
    			<div className="etsyContainer">
                    <Header />
    				<ListingsGrid listingData={this.props} />
       			</div>
    		)
    	}
    })

    var DetailView = React.createClass ({

        componentWillMount: function(){
            var self = this
            this.props.etsyData.on('sync',function() {self.forceUpdate()})
            },

        render: function() {
            //console.log("rendering etsy app")
            //console.log(this)
            return (
                <div className="etsyContainer">
                    <Header />
                    <DetailPage detailData={this.props} />
                </div>
            )
        }
    })

    var Header = React.createClass({
        render: function(){
            return (
                <div className="main-header">
                    <a href="#home"><div className="etsy-logo"><img id="logo" src="./images/etsy-logo.jpg" /></div></a>         
                        <SearchBar/>
                    <header className="nav-header">
                        <ul>
                        <a href="#search/clothing accessories"><li className="tab">Clothing & Accessories</li></a>
                        <a href="#search/jewelry"><li className="tab">Jewelry</li></a>
                        <a href="#search/craft supplies"><li className="tab">Craft Supplies</li></a>
                        <a href="#search/weddings"><li className="tab">Weddings</li></a>
                        <a href="#search/entertainment"><li className="tab">Entertainment</li></a>
                        <a href="#search/home living"><li className="tab">Home Living</li></a>
                        <a href="#search/kids baby"><li className="tab">Kids & Baby</li></a>
                        <a href="#search/vintage"><li className="tab">Vintage</li></a>
                        </ul>                  
                    </header>                 
                </div>
            )

        } 
    })

    var SearchBar = React.createClass({
        
        _search: function(keyEvent) {
            if (keyEvent.keyCode === 13) {
                location.hash = `search/${keyEvent.target.value}`
                keyEvent.target.value = ''
            }
        },

        render: function() {
            return (
                <input className="search-el" placeholder="Search for items or shops" onKeyDown={this._search} />
                )
        }
    })

    var ListingsGrid = React.createClass({

        _getDataJsx: function(resultsObj) {
            //console.log(resultsObj)
            var jsxArray = []
            for (var prop in resultsObj) {
                var component = <Listing key={resultsObj[prop].listing_id} listing={resultsObj[prop]}/>
                jsxArray.push(component)
            }
        
            //console.log(jsxArray)            
            return jsxArray                 
        },

    	render: function() {
            //console.log(this)
            return (
                <div className="listingGrid">
                    {this._getDataJsx(this.props.listingData.etsyData.attributes)}
                </div>
            )
      	}
    })

    var Listing = React.createClass({

        _triggerDetailView: function() {
            location.hash = "details/" + this.props.listing.listing_id
        },

        render: function() {
        //console.log(this)
        var listingObj = this.props.listing
        //console.log(listingObj)
        var imgSrc = "./images/placeholder.png"
        console.log(listingObj)
        if(listingObj.Images.length > 0) {
            imgSrc = listingObj.Images[0].url_170x135
        }
            return(
                <div className="listing">
                    <div className="home-image">
                        <img onClick={this._triggerDetailView} src={imgSrc} />
                    </div>
                    <div className="title-data"><p className="title">{listingObj.title}</p></div>
                    <div className="seller-data"><p className="seller">{listingObj.Shop.shop_name}</p>
                    <p className="price">${listingObj.price}</p>
                    </div>
                </div>
            )
            
        }
    })

    var DetailPage = React.createClass({

        _getDetailDataJsx: function(resultsObj) {
            //console.log(resultsObj)
            var jsxArray = []
            for (var prop in resultsObj) {
                var component = <Detail key={resultsObj[prop].listing_id} listing={resultsObj[prop]}/>
                jsxArray.push(component)
            }
        
            //console.log(jsxArray)            
            return jsxArray   
        },

        render: function() {
            //console.log(this)
            return (
                <div className="detailContainer">
                {this._getDetailDataJsx(this.props.detailData.etsyData.attributes)}
                </div>
            )
        }

    })

    var Detail = React.createClass({
        render: function() {
            //console.log(this)
            var detailObj = this.props.listing
            var imgSrc = "./images/placeholder.png"
            if(detailObj.Images.length > 0) {
                imgSrc = detailObj.Images[0].url_570xN
            }

            return(
                <div className="detail-listing">
                    <div className="detail-title-data"><p className="detail-title">{detailObj.title}</p></div>
                    <div className="detail-image"><img src={imgSrc}></img></div>
                    <div className="detail-description-data"><p className="detail-description">{detailObj.description}</p></div>
                    <div className="detail-seller-data"><p className="detail-seller">{detailObj.Shop.shop_name}</p>
                        <p className="detail-price">{detailObj.price}</p></div>              
                </div>
            )
        }
    })

    var ListModel = Backbone.Model.extend({
    	_apiKey: "aavnvygu0h5r52qes74x9zvo",
    	url: "https://openapi.etsy.com/v2/listings/active.js?",

        parse: function(rawJSON) {
            return rawJSON.results
        }
    })

     var DetailModel = Backbone.Model.extend({
        _apiKey: "aavnvygu0h5r52qes74x9zvo",
         url: "https://openapi.etsy.com/v2/listings/",

         parse: function(rawJSON) {
            return rawJSON.results
        }
    }) 

     var EtsyRouter = Backbone.Router.extend({

         routes: {
             "home": "handleListView",
             "details/:id": "handleDetailView",
             "search/:keywords": "handleSearchView",
              "*default": "handleListView"
         },

         handleListView: function() {
         	this.multiModel.fetch({
         		dataType: "jsonp",
                data: {
                	includes: "Images,Shop",
                	api_key: this.multiModel._apiKey
            	}

         	})
           //  promise.then(function(jsonData) {
           //      console.log(jsonData)
           // })
         	
         	DOM.render(<ListingView etsyData={this.multiModel}/>, document.querySelector('.container'))
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
                DOM.render(<DetailView etsyData={detailModel}/>, document.querySelector('.container'))

         },

         handleSearchView: function(keywords) {
            this.multiModel.fetch({
                 dataType: "jsonp",
                 data: {
                     keywords: keywords,
                     includes: "Images,Shop",
                     api_key: this.multiModel._apiKey
                 }
             })
            DOM.render(<ListingView etsyData={this.multiModel}/>, document.querySelector('.container'))
         },

         initialize: function() {
            this.multiModel = new ListModel()
            Backbone.history.start()
    	 }

     })

	var router = new EtsyRouter()
}	

app()
