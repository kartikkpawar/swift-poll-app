import { BrowserRouter, Route, Switch } from "react-router-dom";
import Home from "./Pages/Home/Home";
import CreatePoll from "./Pages/Create Poll/CreatePoll";
import SubmitPoll from "./Pages/Submit Poll/SubmitPoll";
import ViewPoll from "./Pages/View Poll/ViewPoll";

const Routes = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/poll/result/:id" component={ViewPoll} />
        <Route path="/poll/submit/:id" component={SubmitPoll} />
        <Route path="/poll/:id" component={CreatePoll} />
        <Route path="/" component={Home} />
      </Switch>
    </BrowserRouter>
  );
};

export default Routes;
