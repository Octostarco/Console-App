import React from 'react';

type OutputItem = {
  type: string;
  content: string;
};

interface ConsoleOutputProps {
  items: OutputItem[];
}

const ConsoleOutput: React.FC<ConsoleOutputProps> = ({ items }) => {
  const renderOutputItem = (item: OutputItem, index: number) => {
    const typeClasses = {
      input: 'console-input-text',
      output: 'console-output-text',
      log: 'console-log-text',
      error: 'console-error-text',
    };

    return (
      <div key={index} className="console-item">
        <div>
          <span className={typeClasses[item.type as keyof typeof typeClasses]}>
            {item.type === 'input' ? '>' : item.type === 'output' ? '<' : ''}{' '}
            {item.content}
          </span>
        </div>
      </div>
    );
  };

  return <>{items.map(renderOutputItem)}</>;
};

export default ConsoleOutput;
