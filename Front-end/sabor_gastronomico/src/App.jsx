import { AuthProvider } from './context/AuthContext';
import { CategoriasProvider } from './context/CategoriasContext';
import Routing from './routes/Routing';

function App() {
  return (
    <AuthProvider>
      <CategoriasProvider>
        <div>
          <Routing/>
        </div>
      </CategoriasProvider>
    </AuthProvider>
  )
}

export default App