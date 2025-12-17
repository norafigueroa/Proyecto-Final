import React from 'react'
import Menu from '../components/Menu/Menu'
import InfoRestaurantes from '../components/Restaurantes/InfoRestaurantes'
import GeneralRestaurantes from '../components/Restaurantes/GeneralRestaurantes'


function Restaurantes() {
  return (
    <div>
      <Menu/>
      <InfoRestaurantes/>
      <GeneralRestaurantes/>
    </div>
  )
}

export default Restaurantes