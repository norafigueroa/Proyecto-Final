import React from 'react'
import Inicio from '../components/Inicio/Inicio'
import Menu from '../components/Menu/Menu'
import Header from '../components/Header/Header'
import Footer from '../components/Footer/Footer'

function Home() {
  return (
    <div>
      <Header/>
      <Menu/>
      <Inicio/>
    
      <Footer/>
    </div>
  )
}

export default Home
