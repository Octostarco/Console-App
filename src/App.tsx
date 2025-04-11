import React from 'react';
import './App.css';
import './Console.css';
import { createEvaluator, safeStringify } from './utils/evaluator';
import { getAllGlobalProperties, moveCursorToEnd } from './utils/autocomplete';
import ConsoleOutput from './components/ConsoleOutput';
import { useOctostarContext } from '@octostar/platform-react';

function App() {
  const WELCOME_MESSAGES = [
    { type: 'log', content: '🚀 Welcome to Octostar JavaScript Console! 🌟' },
    {
      type: 'log',
      content:
        'Type your JavaScript commands below and press Enter to execute.',
    },
    {
      type: 'log',
      content:
        'Use the Up Arrow ⬆️ to access your command history and Tab ↹ for autocomplete!',
    },
  ];

  // function getDocumentationPath() {
  //   try {
  //     // Get the domain (hostname) from the parent window
  //     var parentDomain = window.parent.location.hostname;

  //     // Hard-code the static path
  //     var staticPath = "/static/assets/docs/platform-types/index.html";

  //     // Combine the domain and the static path
  //     return parentDomain + staticPath;
  //   } catch (error) {
  //     console.error("Unable to access the parent window:", error);
  //     return null;
  //   }
  // }

  const [output, setOutput] = React.useState([...WELCOME_MESSAGES]);
  const { DesktopAPI, OntologyAPI } = useOctostarContext();
  const [history, setHistory] = React.useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = React.useState(-1);
  const inputRef = React.useRef<HTMLDivElement>(null);
  const consoleRef = React.useRef<HTMLDivElement>(null);
  const [myEval] = React.useState(() =>
    createEvaluator(DesktopAPI, OntologyAPI)
  );

  const predefinedCommands = getAllGlobalProperties();

  const [autocompleteIndex, setAutocompleteIndex] = React.useState(-1);
  const [matchingCommands, setMatchingCommands] = React.useState([
    'DesktopAPI.showToast("Hello Octostar!")',
  ]);

  const executeCommand = async (command: string) => {
    setOutput((prevOutput) => [
      ...prevOutput,
      { type: 'input', content: command },
    ]);

    const originalConsoleLog = console.log;
    console.log = (...args) => {
      const message = args.map((arg) => safeStringify(arg)).join(' ');
      if (!message.includes('PostRobot:')) {
        setOutput((prevOutput) => [
          ...prevOutput,
          {
            type: 'log',
            content: message,
          },
        ]);
        originalConsoleLog(...args);
      }
    };

    try {
      const result = await myEval(command);

      if (result !== undefined) {
        setOutput((prevOutput) => [
          ...prevOutput,
          {
            type: 'output',
            content:
              typeof result === 'object'
                ? safeStringify(result)
                : String(result),
          },
        ]);
      }
    } catch (error) {
      setOutput((prevOutput) => [
        ...prevOutput,
        { type: 'error', content: String(error) },
      ]);
    } finally {
      console.log = originalConsoleLog;
      setHistory((prevHistory: string[]) => [...prevHistory, command]);
      setHistoryIndex(-1);
    }

    setAutocompleteIndex(-1);
    setMatchingCommands([]);
  };

  React.useEffect(() => {
    if (inputRef.current && matchingCommands.length > 0) {
      inputRef.current.innerText = matchingCommands[0];
      inputRef.current.focus();
      moveCursorToEnd(inputRef.current);
    }
  });

  const handleKeyPress = async (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const command = inputRef.current?.innerText.trim();
      if (command) {
        await executeCommand(command);
      }
      if (inputRef.current) {
        inputRef.current.innerText = '';
      }
    } else if (e.key === 'ArrowUp') {
      if (historyIndex < history.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        if (inputRef.current) {
          inputRef.current.innerText = history[history.length - 1 - newIndex];
          moveCursorToEnd(inputRef.current);
        }
      }
      e.preventDefault();
    } else if (e.key === 'ArrowDown') {
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        if (inputRef.current) {
          inputRef.current.innerText = history[history.length - 1 - newIndex];
          moveCursorToEnd(inputRef.current);
        }
      } else {
        setHistoryIndex(-1);
        if (inputRef.current) {
          inputRef.current.innerText = '';
        }
      }
      e.preventDefault();
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const currentInput = inputRef.current?.innerText.trim() || '';

      if (currentInput && autocompleteIndex === -1) {
        const matches = predefinedCommands.filter((cmd) =>
          cmd.toLowerCase().startsWith(currentInput.toLowerCase())
        );

        if (matches.length > 0) {
          if (inputRef.current) {
            inputRef.current.innerHTML = '';
            setTimeout(() => {
              if (inputRef.current) {
                inputRef.current.innerText = matches[0];
                moveCursorToEnd(inputRef.current);
              }
            }, 0);
          }

          setAutocompleteIndex(0);
          return;
        }
      }

      let nextIndex = 0;
      if (
        autocompleteIndex >= 0 &&
        autocompleteIndex < predefinedCommands.length - 1
      ) {
        nextIndex = autocompleteIndex + 1;
      } else {
        nextIndex = 0;
      }

      setAutocompleteIndex(nextIndex);

      if (inputRef.current && predefinedCommands.length > 0) {
        const nextCommand = predefinedCommands[nextIndex];

        inputRef.current.innerHTML = '';

        setTimeout(() => {
          if (inputRef.current) {
            inputRef.current.innerText = nextCommand;
            moveCursorToEnd(inputRef.current);
          }
        }, 0);
      }
    }
  };

  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  }, [output]);

  const clearConsole = () => {
    setOutput([
      ...WELCOME_MESSAGES,
      { type: 'log', content: '🚀 Console cleared! 🌟' },
    ]);
  };

  return (
    <div className="console-container">
      <div ref={consoleRef} className="console-output">
        <ConsoleOutput items={output} />
      </div>
      <div className="console-input-container">
        <span className="console-prompt">&gt;</span>
        <div
          ref={inputRef}
          contentEditable
          onKeyDown={handleKeyPress}
          className="console-input"
        ></div>
      </div>
      <div className="console-header">
        <button className="console-clear-button" onClick={clearConsole}>
          Clear Console
        </button>
      </div>
    </div>
  );
}
export default App;
