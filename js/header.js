import React, {Component} from 'react'

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
                        <a href="#search/vintage"><li className="tab">Vintage</li></a>
                        <a href="#favorites">{'\u2764'} Your Favorites</a>
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


export default Header

