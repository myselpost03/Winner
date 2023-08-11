import React from 'react'
import { FaArrowLeft } from 'react-icons/fa';
import './AddHeader.scss';

const AddHeader = ({ title, onBack }) => {
  return (
    <div className="header">
      <div className="back-arrow" onClick={onBack}>
        <FaArrowLeft />
      </div>
      <h1 className="title">{title}</h1>
    </div>
  )
}

export default AddHeader
