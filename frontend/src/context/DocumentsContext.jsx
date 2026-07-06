import React, { createContext, useState } from 'react'

export const DocData = createContext();

const DocumentsContext = ({children}) => {
  const [docs, setDocs] = useState([])
  return (
    <div>
      <DocData.Provider value={{docs,setDocs}}>
        {children}
      </DocData.Provider>
    </div>
  )
}

export default DocumentsContext
