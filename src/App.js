
import SignUpForm from './components/Form/SignUpForm';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import SignInForm from './components/Form/SignInForm';

function App() {
  return (
    <div className="App">
    <Router>
        <Route exact path ="/">
          <SignUpForm />
        </Route>
        <Route path ="/signup">
          <SignUpForm />
        </Route>
        <Route path="/login">
          <SignInForm />
        </Route>

    </Router>
    </div>
  );
}

export default App;
