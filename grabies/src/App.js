import logo from './logo.svg';
import './App.css';
import Driver from './Agents/driver.js';
import Passenger from './Agents/passenger.js';

function App() {
  let driver = new Driver(0);
  let passenger = new Passenger(3, 10);
  return (
    <div className="App">
      <Passenger location = {3} destination = {10}/>
    </div>
  );
}

export default App;
