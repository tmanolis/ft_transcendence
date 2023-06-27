import { useState } from "react";
import './App.css';

function App() {
  const [currentForm, setCurrentForm] = useState<'login' | 'register'>('login');

  return (
		<div className="App">
			<h2>
				START PAGE
			</h2>
		</div>
  );
}

export default App;