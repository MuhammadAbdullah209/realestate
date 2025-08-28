import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './Pages/Home'
import About from './Pages/About'
import Profile from './Pages/Profile'
import SignUp from './Pages/SignUp'
import NavBar from './Components/NavBar'
import SignIn from './Pages/SignIn'
import Private_route from './Components/Private_route'
import CreateListing from './Pages/CreateListing'
import Lisitng_edit from './Pages/Lisitng_edit'
import ListingPage from './Pages/ListingPage'
import Search from './Pages/Search'
function App() {

  return (
    <>
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/About' element={<About />} />
          <Route path='/search' element ={<Search/>}/>
          <Route path='/Listing/:id' element={<ListingPage/>} />
          <Route element={<Private_route />}>
            <Route path='/Profile' element={<Profile />} />
            <Route path='/Create-Listing' element={<CreateListing />} />
            <Route path='/Edit-Listing/:id' element={<Lisitng_edit />} />
          </Route>
          <Route path='/SignIn' element={<SignIn />} />
          <Route path='/SignUp' element={<SignUp />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
