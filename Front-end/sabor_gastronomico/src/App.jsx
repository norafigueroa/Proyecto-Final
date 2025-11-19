import { AuthProvider } from './context/AuthContext';
import Routing from './routes/Routing';

function App() {
  return (
    <AuthProvider>
      <div>
        <Routing/>
      </div>
    </AuthProvider>
  )
}

export default App