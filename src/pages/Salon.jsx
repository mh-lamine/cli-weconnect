import React from 'react'
import { Link } from 'react-router-dom'

export default function Salon() {
  return (
    <div>Salon
      <Link to="/profile">Profile</Link>
      <Link to="/">accueil</Link>
    </div>
  )
}
