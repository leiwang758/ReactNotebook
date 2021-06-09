import { useTypedSelector } from "./use-typed-selectors";

export const useCumulativeCode = (cellId: string) => {
  return useTypedSelector((state) => {
    const { data, order } = state.cells;
    const orderedCells = order.map((id) => data[id]);

    // create a pre-defined show function
    const showFunc = `
        import _React from 'react';
        import _ReactDOM from 'react-dom';
    
        var show = (value) => {
          const root = document.querySelector('#root');
          
    
          if (typeof value === 'object'){
            if(value.$$typeof && value.props){
              _ReactDOM.render(value, root);
            }else{
              root.innerHTML = JSOM.stringify(value);
            }
          }else{
            root.innerHTML = value;
          }
        }
        `;
    const showFuncNoop = "var show = () => {}";
    const cumulativeCode = [];

    // filter show functions for each cell
    for (let c of orderedCells) {
      if (c.type === "code") {
        if (c.id === cellId) {
          cumulativeCode.push(showFunc);
        } else {
          cumulativeCode.push(showFuncNoop);
        }
        cumulativeCode.push(c.content);
      }
      if (c.id === cellId) {
        break;
      }
    }
    return cumulativeCode;
  }).join("\n");
};
