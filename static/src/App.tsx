
import { Routes, Route} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'
import { Registration } from './pages/Registration';
import { Home } from './pages/Home';
import { Users } from './pages/Users';
import { Header } from './components/header/Header';
import { ErrorPage } from './pages/ErrorPage';


function App() {
  

  return (
    <>
    <Header />
    <main className='container'>
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/registration' element={<Registration />}/>
        <Route path='/users' element={<Users/>}/>
        <Route path='/error' element={<ErrorPage/>}/>
      </Routes>
    </main>
    </>
  )
}

export default App
