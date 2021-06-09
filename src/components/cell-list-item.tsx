import { Cell } from "../state";
import CodeCell from "./code-cell";
import TextEditor from "./text-editor";
import ActionBar from "./action-bar";
import "./cell-list-item.css";
import { AnimateSharedLayout, motion } from "framer-motion";

interface CellListItemProps {
  cell: Cell;
}

const CellListItem: React.FC<CellListItemProps> = ({ cell }) => {
  let child: JSX.Element;
  if (cell.type === "code") {
    child = (
      <>
        <AnimateSharedLayout>
          <motion.div layout>
            <div className="action-bar-wrapper">
              <ActionBar id={cell.id} />
            </div>
            <CodeCell cell={cell} />
          </motion.div>
        </AnimateSharedLayout>
      </>
    );
  } else {
    child = (
      <>
        <AnimateSharedLayout>
          <motion.div layout>
            <TextEditor cell={cell} />
            <ActionBar id={cell.id} />
          </motion.div>
        </AnimateSharedLayout>
      </>
    );
  }

  return <div className="cell-list-item">{child}</div>;
};

export default CellListItem;
