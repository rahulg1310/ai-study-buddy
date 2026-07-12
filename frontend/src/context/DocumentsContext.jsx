import React, { createContext, useContext, useEffect, useState } from 'react'
import axios from 'axios';
import LoadModal from '../components/LoadModal';
import { UserData } from './UserContext';

export const DocData = createContext();

const DocumentsContext = ({children}) => {
  const [docs, setDocs] = useState([]);
  const [loadModal, setLoadModal] = useState(false);
  const {user} = useContext(UserData);
  useEffect(()=>{
    if(!user) return;
    setLoadModal(true);
    const fetchGames = async ()=>{
      try{
        const token=JSON.parse(localStorage.getItem("token"));
        const res=await axios.get("http://127.0.0.1:8000/documents",{
          headers:{
            Authorization : `Bearer ${token}`
          }
        }
        )
        setDocs(res.data.documents);
      }
      catch(error){
        console.log(error);
      }
      finally{
        setLoadModal(false);
      }
    }
    fetchGames();
  },[user])
  return (
    <div>
      <DocData.Provider value={{docs,setDocs}}>
        {children}
      </DocData.Provider>
      {
        user && loadModal && (<LoadModal />)
      }
    </div>
  )
}

export default DocumentsContext
