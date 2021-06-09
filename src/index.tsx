import "bulmaswatch/superhero/bulmaswatch.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import ReactDOM from "react-dom";
//import CodeCell from "./components/code-cell";
import { Provider } from "react-redux";
import { store } from "./state";
import CellList from "./components/cell-list";

const App = () => {
  return (
    <Provider store={store}>
      <div>
        <CellList />
      </div>
    </Provider>
  );
};
// Direct acess between frames is allowed when:
// 1. the iframe element does not have a 'sandbox' property
// 2. or has a sandbox = 'allow-same-origin' property
// 3. AND we fetch the parent HTML doc and the frame HTML doc
//    from the exact same Domain, Port, Protocal (http vs https)

// using sandbox run very fast but lost the ability of some in-browser feature
// like localStorage

//const html = "<h1>local html doc<h1>";

ReactDOM.render(<App />, document.querySelector("#root"));
