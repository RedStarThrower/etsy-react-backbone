import React, {Component} from 'react'
import Header from './header'
import DetailView from './detailView'
import FaveButton from './faveButton'

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
            //console.log(this)
    		return (
    			<div className="etsyContainer">
                    <Header />
    				<ListingsGrid updater={this._updater} favesColl={this.props.favesColl} listingData={this.props.etsyData} />
       			</div>
    		)
    	}
    })

    var ListingsGrid = React.createClass({

        _getDataJsx: function(listingModel, i) {
            console.log(this)
            return (
                 <Listing updater={this._updater} favesColl={this.props.favesColl} key={i} listing={listingModel}/>
             )
                           
        },

        _updater: function() {
            this.setState({
                etsyData: this.state.etsyData
            })
        },

        getInitialState: function() {
            return{
                etsyData: this.props.etsyData
            }
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
        console.log(this)
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
                        <FaveButton updater={this.props.updater} favesColl={this.props.favesColl}/>
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

export default ListingView