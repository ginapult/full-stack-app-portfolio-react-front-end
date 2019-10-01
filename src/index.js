import React from "react";
import ReactDOM from "react-dom";

import Header from '../src/components/Header/Header.js';
import Main from '../src/components/Main/Main.js';
import Footer from '../src/components/Footer/Footer.js';

import "./styles.css";

function App() {
  return (
    <div className="App">
      <Header />
      <Main />
      <Footer />
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
