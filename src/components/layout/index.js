import './style.css';
import ContentArea from "../content";
import { dummyData } from '../content/dummyData';
import { useState } from 'react';
// import {ContentArea} from '../content/index'

const Layout = () =>{
  const [selectedUser, setSelectedUser] = useState(dummyData[0].user)
  return (
    <div className="app-layout">
      <div className="header">
        
      <select className="selecting" onChange={(e) => {
        setSelectedUser(e.target.value)
  }} >
        { 
          dummyData?.map( (item) => {
            return (
              <option> { item.user } </option>
            )
          }  )
        } 

      </select>
      </div>
      <ContentArea selectUser={selectedUser} />
    </div>
  );
}

export default Layout;
