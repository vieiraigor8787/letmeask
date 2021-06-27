import { BrowserRouter, Route, Switch } from "react-router-dom";

import { Home } from "./pages/Home";
import { NewRoom } from "./pages/NewRoom";
import { Room } from "./pages/Room";
import { AdminRoom } from "./pages/AdminRoom";

import { AuthContextProvider } from "../src/contexts/AuthContext";
import { ThemeContextProvider } from "../src/contexts/ThemeContext";

function App() {
  return (
    <ThemeContextProvider>
      <AuthContextProvider>
        <BrowserRouter>
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/rooms/new" component={NewRoom} />
            <Route path="/rooms/:id" component={Room} />

            <Route path="/admin/rooms/:id" component={AdminRoom} />
          </Switch>
        </BrowserRouter>
      </AuthContextProvider>
    </ThemeContextProvider>
  );
}
export default App;
