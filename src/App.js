import React, { Component } from 'react';
import classes from './App.css';
import Validation from './Validation/Validation';
import Char from './Char/char'

class App extends Component {
  state = {
    UserInput : ""
  };

  UserInputHandler = (event) => {
    this.setState(
      {UserInput : event.target.value}
    )
  };

  deleteCharacter = (index) => {
    let charsplit = this.state.UserInput.split('');
    charsplit.splice(index,1);
    let Updatedtext = charsplit.join('');
    console.log(Updatedtext)
    this.setState({UserInput: Updatedtext});
  }

  render() {
    let statement = "";
    if (this.state.UserInput.length >= 5){
      this.statement = "Text long enough";
    } else {
      this.statement = "Text too short";
    }
    let charSplit = this.state.UserInput.split('');
    const charList = charSplit.map((ch,index) => {
      return <Char character = {ch} 
      click = {()=>this.deleteCharacter(index)}
      index = {index}/>;
    });
    return (
      <div>
        <input type = "text" onChange = {this.UserInputHandler}
        value = {this.state.UserInput}/>
        <p>{this.state.UserInput.length}</p>
        <Validation inputlength = {this.statement}/>
        {charList}
      </div>
    )
  }
}

export default App;
