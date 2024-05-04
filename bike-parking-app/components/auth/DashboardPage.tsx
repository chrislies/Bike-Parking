"use client";
import React, { useEffect, useState } from 'react';
import { supabaseClient } from '@/config/supabaseClient';
import './Dashboard.page.css';

interface PendingRequest {
  id: number;
  email: string;
  x_coord: number;
  y_coord: number;
  request_type: string;
  site_id:string;
  created_at: string;
  description: string;
  image: string;
}

const DashboardPage: React.FC = () => {
  const [pendingRequests, setPendingRequests] = useState<PendingRequest[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchPendingRequests = async () => {
      const { data, error } = await supabaseClient.from('Pending').select('*');
      if (!error) {
        setPendingRequests(data);
      }
    };
    fetchPendingRequests();
  }, []);

  const handleImageClick = (imageSrc: string) => {
    setSelectedImage(imageSrc);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden'; // Disable scroll on body when modal is open
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
    document.body.style.overflow = 'auto'; // Enable scroll on body when modal is closed
  };

  const handleAddToTableAndRemoveFromPending = async (requestId: number, tableName: 'BlackList' | 'UserAdded') => {
    const request = pendingRequests.find(request => request.id === requestId);
    if (!request) {
      console.error('Request not found');
      return;
    }
  
    let payload;
    if (tableName === 'BlackList') {
      // For BlackList, use x_coord as location_id and generate current timestamp for created_at
      payload = {
        location_id: request.site_id,
        created_at: new Date().toISOString()  // ISO 8601 format, accepted by most databases including PostgreSQL
      };
    } else if (tableName === 'UserAdded') {
      // Assuming UserAdded uses a different schema that you might need to adjust similarly
      payload = {
        email: request.email,
        x_coord: request.x_coord,
        y_coord: request.y_coord
      };
    }
  
    // Insert into BlackList or UserAdded table
    const { error: insertError } = await supabaseClient.from(tableName).insert([payload]);
    if (insertError) {
      console.error('Error inserting to ' + tableName + ':', insertError);
      return;
    }
  
    // If insert successful, then delete from Pending
    const { data: deleteData, error: deleteError } = await supabaseClient.from('Pending').delete().eq('id', requestId);
    if (deleteError) {
      console.error('Error deleting from Pending:', deleteError);
    } else {
      // Update the local state to reflect the change
      setPendingRequests(prevRequests => prevRequests.filter(request => request.id !== requestId));
      console.log('Deleted from Pending:', deleteData);
    }
  };

  return (
    <div className="dashboardContainer">
      <h1 className="dashboardTitle">Pending Requests Dashboard</h1>
      <table className="table">
        <thead>
          <tr>
            <th className="th imageCell">Image</th>
            <th className="th">ID</th>
            <th className="th">Email</th>
            <th className="th">X Coord</th>
            <th className="th">Y Coord</th>
            <th className="th">Request Type</th>
            <th className="th">Created At</th>
            <th className="th">Description</th>
            <th className="th">Actions</th>
          </tr>
        </thead>
        <tbody>
          {pendingRequests.map((request) => (
            <tr key={request.id}>
              <td className="td imageCell" onClick={() => handleImageClick(request.image)}>
                <img src={request.image} alt="Request" className="image" />
              </td>
              <td className="td">{request.id}</td>
              <td className="td">{request.email}</td>
              <td className="td">{request.x_coord}</td>
              <td className="td">{request.y_coord}</td>
              <td className="td">{request.request_type}</td>
              <td className="td">{request.created_at || 'null'}</td>
              <td className="td">{request.description}</td>
              <td className="td">
                <button className="button greenButton" onClick={() => handleAddToTableAndRemoveFromPending(request.id, 'UserAdded')}>✔</button>
                <button className="button redButton" onClick={() => handleAddToTableAndRemoveFromPending(request.id, 'BlackList')}>✘</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <div className="overlay" onClick={closeModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <img src={selectedImage || ''} alt="Enlarged request" className="enlargedImage" />
            <button onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
