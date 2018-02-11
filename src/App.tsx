import * as React from 'react';
import GroupedGrid from './grid/GroupedGrid';
import './App.css';

const logo = require('./logo.svg');

class App extends React.Component {
    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <h1 className="App-title">react-virtualized-sandbox</h1>
                </header>
                <GroupedGrid />
            </div>
        );
    }
}

export default App;
