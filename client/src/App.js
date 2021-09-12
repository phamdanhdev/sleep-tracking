import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import AppHomePage from "./pages/HomePage";
import AppAuthPage from "./pages/AuthPage";

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route exact path="/">
            <AppHomePage />
          </Route>
          <Route exact path="/auth/:isLogin">
            <AppAuthPage />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
