import React, {Component} from 'react'
import Header from './header'
import ListingView from './listingView'
import FaveButton from './faveButton'

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



export default DetailView