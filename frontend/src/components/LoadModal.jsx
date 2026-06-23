import React from 'react'
import { LoaderCircle } from 'lucide-react'

const LoadModal = () => {
  return (
    <div className='fixed inset-0 bg-black/70 flex justify-center items-center'>
      <div>
        <LoaderCircle className='animate-spin' size={38} color='#ffffff'/>
      </div>
    </div>
  )
}

export default LoadModal
