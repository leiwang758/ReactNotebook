import MonacoEditor, { EditorDidMount } from "@monaco-editor/react";
import prettier from "prettier";
import parser from "prettier/parser-babel";
import { useRef } from "react";
import "./code-editor.css";
import "./syntax.css";
import codeShift from "jscodeshift";
import Highlighter from "monaco-jsx-highlighter"; // Typescript doesn't have the declaration

interface CodeEditorProps {
  initialValue: string;
  onChange(value: string): void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ initialValue, onChange }) => {
  const editorRef = useRef<any>();

  const onEditorDidMount: EditorDidMount = (getValue, MonacoEditor) => {
    editorRef.current = MonacoEditor;
    MonacoEditor.onDidChangeModelContent(() => {
      onChange(getValue());
    });
    MonacoEditor.getModel()?.updateOptions({ tabSize: 2 });
    const highlighter = new Highlighter(
      // @ts-ignore
      window.monaco,
      codeShift,
      MonacoEditor
    );

    highlighter.highLightOnDidChangeModelContent(
      () => {}, // doesn't console log constantly
      () => {},
      undefined,
      () => {}
    );
  };

  const onFormatClick = () => {
    //console.log(editorRef.current);
    // get current value from editor
    const unformatted = editorRef.current.getModel().getValue();
    // format that value
    const formatted = prettier
      .format(unformatted, {
        parser: "babel",
        plugins: [parser],
        useTabs: false,
        semi: true,
        singleQuote: true,
      })
      .replace(/\n$/, "");
    // new line char at the very end of the string
    // set the formatted value back in the editor
    editorRef.current.setValue(formatted);
  };

  return (
    <div className="editor-wrapper">
      <button
        className="button button-format is-primary is-small"
        onClick={onFormatClick}
      >
        Format
      </button>
      <MonacoEditor
        editorDidMount={onEditorDidMount}
        value={initialValue || "// Write React draft code for preview"}
        theme="dark"
        language="javascript"
        height="100%"
        options={{
          wordWrap: "on",
          minimap: { enabled: false },
          showUnused: false, // not fade out unused statements
          folding: false,
          lineNumbersMinChars: 3,
          fontSize: 16,
          scrollBeyondLastLine: false,
          automaticLayout: true,
        }}
      />
    </div>
  );
};

export default CodeEditor;
