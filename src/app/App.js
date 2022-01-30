import React, { Suspense } from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";
// import Users from "./modules/User/pages/Users";
//import NewPlace from "./modules/Places/pages/NewPlace";
import MainNavigation from "./layout/Navigation/MainNavigation";
//import UserPlaces from "./modules/Places/pages/UserPlaces";
//import UpdatePlace from "./modules/Places/pages/UpdatePlace";
//import Auth from "./modules/User/pages/Auth";
import { AuthContext } from "./modules/shared/context/auth-context";
import { useAuth } from "../app/modules/shared/hooks/auth-hook";
import LoadingSpinner from "./modules/shared/components/UI/LoadingSpinner";

const Users = React.lazy(() => import("./modules/User/pages/Users"));
const NewPlace = React.lazy(() => import("./modules/Places/pages/NewPlace"));
const UserPlaces = React.lazy(() =>
  import("./modules/Places/pages/UserPlaces")
);
const UpdatePlace = React.lazy(() =>
  import("./modules/Places/pages/UpdatePlace")
);
const Auth = React.lazy(() => import("./modules/User/pages/Auth"));
function App() {
  const { token, login, logout, userId } = useAuth();

  let routes;

  if (token) {
    routes = (
      <Switch>
        <Route path="/" exact component={Users} />
        <Route path="/:userId/places" exact component={UserPlaces} />
        <Route path="/places/new" exact component={NewPlace} />
        <Route path="/places/:placeId" component={UpdatePlace} />
        <Redirect to="/" />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route path="/" exact component={Users} />
        <Route path="/:userId/places" exact component={UserPlaces} />
        <Route path="/auth" component={Auth} />
        <Redirect to="/auth" />
      </Switch>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        userId: userId,
        login: login,
        logout: logout,
      }}
    >
      <Router>
        <MainNavigation />
        <main>
          <Suspense
            fallback={
              <div className="center">
                <LoadingSpinner />
              </div>
            }
          >
            {routes}
          </Suspense>
        </main>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
