// Profile.js

import React from 'react';
import './profile.css'; // Import CSS file for styling
import { useAuth } from '../../context/auth';
import { useState } from 'react';
import EditProfile from './editProfile';

const Profile = () => {
  const {port,user,token} = useAuth();
  const [editOpen,setEditOpen] = useState(false);

  if (!user) {
    return <div>Loading...</div>; // You can render a loading indicator or handle the loading state
  }
  
  const handleEdit = ()=>{
    setEditOpen(true);
  }

  const onClose = ()=>{
    setEditOpen(false);
  }

  return (
    <div className="user-profile">
      <div className="user-info">
        <h2>User Information</h2>
        <p><strong>Name:</strong> {user.name} </p>
        <p><strong>Email:</strong> {user.email} </p>
        <p><strong>Phone:</strong> {user.phone} </p>
        <p><strong>Address:</strong> {user.address} </p>
        <button className="edit-profile-btn" onClick={handleEdit}>Edit Profile</button>
      </div>

      {editOpen && (
        <EditProfile onClose={onClose} user={user}/>
      )}
     
    </div>
  );
}

export default Profile;
