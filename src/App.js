import React, { Component } from 'react';
import {BrowserRouter}from "react-router-dom"

//import Button from "./components/UI/Button/Button";
import BreakApp from "./containers/BreakApp/BreakApp";

import './App.css';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <BreakApp></BreakApp>
      </BrowserRouter>
    );
  }
}

export default App;
