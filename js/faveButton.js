import React, {Component} from 'react'

// faveButton.backgroundColor = "#FFE3CD"
// faveButton.border = "3px solid #e4685d"  
// faveButton.color = "#e4685d" 

var FaveButton = React.createClass({        

        _addToFave: function(){
            console.log("awesome clicking!")
	      	console.log(this.props)
	      	//this.props.listing.set({favorite: true})

        },

        render: function() {
        	var faveButton = {}
            return <button onClick={this._addToFave} style={faveButton} className="fav-button">{"\u2764"}</button>
        }
    })

export default FaveButton