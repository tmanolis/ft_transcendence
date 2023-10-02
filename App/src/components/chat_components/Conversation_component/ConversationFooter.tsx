import React, { useState, FormEvent } from 'react';

const ConversationFooter: React.FC = () => {
  const [inputValue, setInputValue] = useState('');

  const handleOnSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevents the form from submitting the traditional way

    // Handle form submission action here
    console.log('Form Submitted with value: ', inputValue);
  };

  return (
    <form onSubmit={handleOnSubmit}>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <button type="submit">Submit</button>
    </form>
  );
};

export default ConversationFooter;
