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
    		//console.log("rendering etsy app")
            //console.log(this.props.etsyData)
    		return (
    			<div className="etsyContainer">
                    <Header />
    				<ListingsGrid listingData={this.props.etsyData} />
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
                    <DetailPage detailData={this.props.etsyData} />
                </div>
            )
        }
    })

    var LoginView = React.createClass ({

        _submitUsername: function(keyEvent) {
            if (keyEvent.keyCode === 13) {
                var username = keyEvent.target.value
                this.props.handleUserSubmit(username)
            }
        },

        render: function() {
            return (
                <div className = "loginContainer">
                    <input onKeyDown={this._submitUsername} name="username"/>
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

        _getDataJsx: function(listingModel, i) {
            //console.log(listingModel)
            return (
                 <Listing key={i} listing={listingModel}/>
             )
                           
        },

    	render: function() {
            //console.log(this)
            //console.log(this.props)
            return (
                <div className="listingGrid">
                    {this.props.listingData.map(this._getDataJsx)}
                </div>
            )
      	}
    })

    var Listing = React.createClass({

        _triggerDetailView: function() {
            location.hash = "details/" + this.props.listing.get('listing_id')
        },

        render: function() {
        //console.log(this)
        var listingObj = this.props.listing
        var imgSrc = "./images/placeholder.png"
        //console.log(listingObj)
        var Imgs = listingObj.get('Images')
        if(Imgs instanceof Array && Imgs.length > 0) {
            imgSrc = Imgs[0]['url_170x135']
        }

        var shopName = ''
        if (listingObj.get('Shop')) shopName = listingObj.get('Shop').shop_name
            
            return(
                <div className="listing">                    
                    <div className="home-image">
                        <FaveButton />
                        <img onClick={this._triggerDetailView} src={imgSrc} />
                    </div>
                    <div className="title-data"><p className="title">{listingObj.get('title')}</p></div>
                    <div className="seller-data"><p className="seller">{shopName}</p>
                    <p className="price">${listingObj.get('price')}</p>
                    </div>
                </div>
            )
            
        }
    })

    var FaveButton = React.createClass({
        render: function() {
            return <button className="fav-button">{"\u2764"}</button>
        }
    })

    var DetailPage = React.createClass({

        render: function() {
            //console.log(this)
            return (
                <div className="detailContainer">
                    <Detail listing={this.props.detailData}/>
                </div>
            )
        }

    })

    var Detail = React.createClass({
        render: function() {
            //console.log(this)
            var detailObj = this.props.listing
            var imgSrc = "./images/placeholder.png"
            //console.log(listingObj)
            var Imgs = detailObj.get('Images')

            if (Imgs instanceof Array && Imgs.length > 0) {
                imgSrc = Imgs[0]['url_570xN']
            }

            var shopName = ''
            if (detailObj.get('Shop')) shopName = detailObj.get('Shop').shop_name

            return(
                <div className="detail-listing">
                    <div className="detail-title-data"><FaveButton /><p className="detail-title">{detailObj.get('title')}</p></div>
                    <div className="detail-image"><img src={imgSrc}></img></div>
                    <div className="detail-description-data"><p className="detail-description">{detailObj.get('description')}</p></div>
                    <div className="detail-seller-data"><p className="detail-seller">{shopName}</p>
                        <p className="detail-price">{detailObj.get('price')}</p></div>              
                </div>
            )
        }
    })

    var ListCollection = Backbone.Collection.extend({
    	_apiKey: "aavnvygu0h5r52qes74x9zvo",
    	url: "https://openapi.etsy.com/v2/listings/active.js?",

        parse: function(rawJSON) {
            return rawJSON.results
        },

        defaults: {
            favorite: false
        }
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
             "search/:keywords": "handleSearchView"
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
    
                DOM.render(<DetailView etsyData={detailModel}/>, document.querySelector('.container'))

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
            DOM.render(<ListingView etsyData={coll}/>, document.querySelector('.container'))
         },

         initialize: function() {
            this.listingCollection = new ListCollection()
            Backbone.history.start()
    	 }

     })

	var router = new EtsyRouter()
}	

app()
