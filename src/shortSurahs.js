import './shortSurahs.css';
import React from 'react';
import {connect, Provider} from 'react-redux';
import {createStore} from 'redux';
import $ from 'jquery';
import 'bootstrap/dist/css/bootstrap.min.css';
import {FaTwitter} from 'react-icons/fa';
import {FaTumblr} from 'react-icons/fa';


//Function for generating random number in range min and max
const randomNumber = function (min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

//Redux
//Declaration constatnt variables
const ADD = "ADD"
 
//Action creator to creat actions to dispatch to the store
const addSurahs = (surahs) => {
  return({
    type: ADD,
    surahs
  })
}

//Reducer for tracking the state of the program
const reducer = (state = [], action) => { 
  switch(action.type){
    case ADD:
      return [...action.surahs];
      break;
    default: 
      return state;
  }
}

//Creating Redux store
const store = createStore(reducer);


//React
//Craete React component
class MyBox extends React.Component{
  constructor(props){
    super(props)
    //State of the component
    this.state = {
      surahs: []
    }
    this.randomColor = this.randomColor.bind(this);
    this.newSurah = this.newSurah.bind(this);
  }
 randomColor(){
      let randomColor ="#" + Math.floor((Math.random()*16777215)+20).toString(16);
    $('body').css("background-color", randomColor);
   $('body').css("transition", "background-color 2s ease"); 
    $('#text').css("color", randomColor);
    $('#text').css("transition", "color 2s ease"); 
    $('#surahName').css("color", randomColor);
   $('#surahName').css("transition", "color 2s ease"); 
    }
  
  //Function for getting random surah from array of surahs in the store state
  newSurah(){
 //Setting the state of the component to random surah from store 
    this.setState(() => {
         return ({
         surahs: this.props.surahs
       })
   })
    
     //giving all elements a random color each new surah
   $('#text').css("opacity",0)
    $('#surahName').css("opacity",0)
    this.randomColor();
    setTimeout(()=>{
      $('#text').css("opacity",1)
      $('#surahName').css("opacity",1)
    $('#text').css("transition", "opacity 1s ease");
      $('#surahName').css("transition", "opacity 1s ease");
     }, 500);
  
    
  }
  
   componentDidMount(){
     // Set the store state when receiving data from API after the component mounted to the DOM 
     //Calling data from API and assign it to the local variable arr   
     fetch("https://api.alquran.cloud/v1/quran/quran-uthmani")
  .then(function(response) {
    return response.json();
  })
  .then((data)=>{
    this.props.addSurahs(data.data.surahs.filter( item => {
      if(item.ayahs.length <= 15) {
          return item
    }
    }))
    
    //Set the state of the store
    this.setState(() => {
         return ({
         surahs: data.data.surahs.filter( item => {
          if(item.ayahs.length <= 15) {
              return item
        }
        })
       })
   })
      this.randomColor();                   
  });

  }
  
  render(){
    //When reciving the surah from store we will sum the ayahs of the surah
    const surah = this.state.surahs[randomNumber(0, this.state.surahs.length)]
    const ayahs = surah ? surah.ayahs.reduce((acc, ayah) => {
          return acc += ( ayah["text"] + " (" + ayah["numberInSurah"] + ") ")
    }, '') : "Loading...";
    const surahName = surah ? surah.name:"Loading..."
    
    return( 
      <div id="box">
        <p id="text">{ayahs}</p>
        <cite id ="surahName">{surahName}</cite>
     <div id="container" className="container-fluid">
       <div className="row center-text">
         <div className="col-2">
            <button className="btn btn-primary"><a id="tweet-quote" target="_blank" href="https://twitter.com/intent/tweet"><FaTwitter className="icon"/></a></button>
         </div>
        <div className="col-2">
           <button className="btn btn-primary"><a id="tweet-quote1" target="_blank" href="https://www.tumblr.com"><FaTumblr className="icon"/></a></button>
         </div>
        <div className="col-8">
            <button id="new-quote" onClick={this.newSurah} className='btn btn-danger'>New Surah</button> 
         </div>
        </div>
        </div>
      </div>
    )
  }
}
const Author = ()=>{
  return (
    <div id="author">by <a  href="https://codepen.io/Ahmed-Seleem01/pen/BaxXZPQ">Ahmed</a></div>
  )
}
//functions to access Redux store state in components
function mapStateToProps(state){
  return({
    surahs: state
  });
}

//function to dispatch actions in components
function mapDispatchToProps(dispatch){
  return({
    addSurahs: function(surahs){
      dispatch(addSurahs(surahs))
    }
  })
}

//React-Redux

//Connect store to the component and give the component access to store state through props of the component
const Container = connect(mapStateToProps, mapDispatchToProps)(MyBox);

//Wrap the conected component with redux wraper to give it acess to the store
class AppWrapper extends React.Component {
  render(){
    return(
      <Provider store={store}>
        <Container/>
        <Author />
      </Provider>
    )
  }  
}

//Render the wrapper component to the DOM
//ReactDOM.render(<AppWrapper/>, document.getElementById("quote-box"));

export default AppWrapper;
