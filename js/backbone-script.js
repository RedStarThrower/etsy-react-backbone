 //Variables

 //Search URL: https://openapi.etsy.com/v2/listings/active.js?api_key=aavnvygu0h5r52qes74x9zvo&keywords=banana+costume&callback=?.

 var apiKey = "aavnvygu0h5r52qes74x9zvo"

 // ---------- Model ---------- //

 var ListModel = Backbone.Model.extend({
     _apiKey: apiKey,
     url: "https://openapi.etsy.com/v2/listings/active.js?"
 })

 var DetailModel = Backbone.Model.extend({
     _apiKey: apiKey,
     url: "https://openapi.etsy.com/v2/listings/"
 })

 // ---------- Views ---------- //

 var ListView = Backbone.View.extend({
     el: "#main-container",

     initialize: function(someModel) { //<= model and view meet each other
         this.model = someModel
         var boundRenderFunction = this._render.bind(this)
             //this.model.on("sync", this._render) //<= "this" loses context if not bound
         this.model.on("sync", boundRenderFunction) //<= as soon as the info loads, render it right away (replace .then)
     },

     events: { // <= Creates an event to switch views 
         "click img": "_triggerDetailView",

     },

     _triggerDetailView: function(clickEvent) {
         //console.log(clickEvent.target) //<= testing; logs where the click happened
         var imgNode = clickEvent.target
         window.location.hash = "details/" + imgNode.getAttribute("listingId") //<= adding each id to the URL after the hash in order to inform the Router to change the view
     },

     _render: function() { // <= promise handler
         //console.log(this.model) 
         var resultsArray = this.model.get("results")
             //console.log(resultsArray) 
         var htmlString = ""
         for (var i = 0; i < resultsArray.length; i++) {
             var listingObj = resultsArray[i]
                 //console.log(listingObj)
             var listingId = listingObj.listing_id
                 //console.log(listingId)
             var title = listingObj.title
             var seller = listingObj.Shop.shop_name
             var price = listingObj.price
             var imageArray = listingObj.Images
                 //console.log(imageArray)
             if (imageArray.length > 0) {
                 var imageURL = imageArray[0].url_170x135
             } else {
                 var imageURL = images/placeholder.png
             }
             htmlString += '<div class="listing">'
             htmlString += '<div class="home-image">' + '<img listingId="' + listingId + '" src="' + imageURL + '">' + '</div>'
             htmlString += '<div class="title-data">' + '<p class="title">' + title + '</p>' + '</div>'
             htmlString += '<div class="seller-data">' + '<p class="seller">' + seller + '</p>'
             htmlString += '<p class="price">' + "$" + price + '</p>' + '</div>'
             htmlString += '</div>'
         }
         this.el.innerHTML = htmlString
     }
 })


 var DetailView = Backbone.View.extend({
     el: "#main-container",

     initialize: function(someModel) {
         this.model = someModel
         var boundRenderFunc = this._render.bind(this)
         this.model.on("sync", boundRenderFunc)
     },

     _render: function() {
         //console.log(this.model)
         var resultsObj = this.model.get("results")
         var htmlString = ""
         var listingObj = resultsObj[0]
             //console.log(listingObj)
         var listingId = listingObj.listing_id
             //console.log(listingId)
         var title = listingObj.title
         var seller = listingObj.Shop.shop_name
         var description = listingObj.description
         var price = listingObj.price
         var imageArray = listingObj.Images
            if (imageArray.length > 0) {
                var imageURL = imageArray[0].url_570xN
            } 
            else {

             var imageURL = images/placeholder.png

            }

         htmlString += '<div class="detail-listing">'
         htmlString += '<div class="detail-title-data">' + '<p class="detail-title">' + title + '</p>' + '</div>'
         htmlString += '<div class="detail-image">' + '<img listingId="' + listingId + '" src="' + imageURL + '">' + '</div>'
         htmlString += '<div class="detail-description-data">' + '<p class="detail-description">' + description + '</p>' + '</div>'

         htmlString += '<div class="detail-seller-data">' + '<p class="detail-seller">' + seller + '</p>'
         htmlString += '<p class="detail-price">' + "$" + price + '</p>' + '</div>'
         htmlString += '</div>'
         this.el.innerHTML = htmlString
     }
 })

 var SearchView = Backbone.View.extend({
     el: "#main-header",

     initialize: function(someModel) {
         this.model = someModel
         var boundRenderFunc = this._render.bind(this)
         this.model.on("sync", boundRenderFunc)
     },

     events: {
         "keydown input": "_searchByKeyword"
     },

     _searchByKeyword: function(keyEvent) {
         var searchTerm = keyEvent.target.value
         console.log(keyEvent.target)
         if (keyEvent.keyCode === 13) {
             location.hash = "search/" + searchTerm
         }
     },

     _render: function() {
         var htmlString = '<div id="etsy-logo"><img id="logo" src="images/etsy-logo.jpg"></div>'
         htmlString += '<input class="search-el" placeholder="Search for items or shops">'
         htmlString += '<header id="nav-header">' + '<ul>' +
             '<a href="#search/clothing accessories"><li class="tab">Clothing & Accessories</li></a>' +
             '<a href="#search/jewelry"><li class="tab">Jewelry</li></a>' +
             '<a href="#search/craft supplies"><li class="tab"> Craft Supplies & Tools</li></a>' +
             '<a href="#search/weddings"><li class="tab">Weddings</li></a>' +
             '<a href="#search/entertainment"><li class="tab">Entertainment</li></a>' +
             '<a href="#search/home living"><li class="tab">Home & Living</li></a>' +
             '<a href="#search/kids baby"><li class="tab">Kids & Baby</li></a>' +
             '<a href="#search/vintage"><li class="tab">Vintage</li></a>' + '</ul>' + '</header>'
         this.el.innerHTML = htmlString
     }
 })

 // ---------- Router ---------- //

 var EtsyRouter = Backbone.Router.extend({

     routes: {
         "home": "handleListView",
         "details/:id": "handleDetailView",
         "search/:keywords": "handleSearchView",
         "*default": "handleListView"
     },

     handleListView: function() {
         var listModel = new ListModel()
         var listView = new ListView(listModel)
         var searchView = new SearchView(listModel)
         var promise = listModel.fetch({
                 dataType: "jsonp",
                 data: {
                     includes: "Images,Shop",
                     api_key: listModel._apiKey
                 }
             })
             //promise.then(function(jsonData) {
             //console.log(jsonData) //<= just to test the model and see the object. Must add #home/
             //})
         promise.then(listView._render.bind(listView)) //<= checking that the model and view are connected and the render method works; binding the callback's "this" to the View   
     },

     handleDetailView: function(listingId) {
         var detailModel = new DetailModel()
         var detailView = new DetailView(detailModel)
         detailModel.url += listingId + ".js?"
             //console.log(detailModel.url)
         var promise = detailModel.fetch({
             dataType: "jsonp",
             data: {
                 includes: "Images,Shop",
                 api_key: detailModel._apiKey
             }
         })
         promise.then(detailView._render.bind(detailView))
     },

     handleSearchView: function(keywords) {
         var searchModel = new ListModel()
         var listView = new ListView(searchModel)
         var searchView = new SearchView(searchModel)
         var promise = searchModel.fetch({
             dataType: "jsonp",
             data: {
                 keywords: keywords,
                 includes: "Images,Shop",
                 api_key: searchModel._apiKey
             }
         })

         promise.then(searchView._render.bind(searchView))
     },

     initialize: function() {
         Backbone.history.start()
     }
 })

 var router = new EtsyRouter()
