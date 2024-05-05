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
  created_at: string;
  description: string;
  image: string;
  site_id: string;
}

type TableName = 'BlackList' | 'UserAdded';

interface Payload {
  id?: number;
  created_at?: string;
  location_id?: string;
  email?: string;
  x_coord?: number;
  y_coord?: number;
}

const DashboardPage: React.FC = () => {
  const [pendingRequests, setPendingRequests] = useState<PendingRequest[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchPendingRequests = async () => {
      const { data, error } = await supabaseClient.from('Pending').select('*');
      if (error) {
        console.error('Error fetching pending requests:', error);
      } else {
        setPendingRequests(data || []);
      }
    };
    fetchPendingRequests();
  }, []);

  const handleImageClick = (imageSrc: string) => {
    setSelectedImage(imageSrc);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
    document.body.style.overflow = 'auto';
  };

  const handleInsert = async (tableName: TableName, payload: Payload) => {
    const { error } = await supabaseClient.from(tableName).insert([payload]);
    if (error) {
      console.error(`Error inserting into ${tableName}:`, error);
      return false;
    }
    return true;
  };

  const handleDeleteFromTable = async (tableName: string, requestId: number) => {
    const { error } = await supabaseClient.from(tableName).delete().eq('id', requestId);
    if (error) {
      console.error(`Error deleting from ${tableName}:`, error);
      return false;
    }
    return true;
  };

  const handlePushToUserAddedOrBlackList = async (requestId: number) => {
    const request = pendingRequests.find(request => request.id === requestId);
    if (!request) {
      console.error('Request not found');
      return;
    }

    try {
      if (request.request_type.toLowerCase() === 'add_request') {
        await handleInsert('UserAdded', {
          id: request.id,
          email: request.email,
          x_coord: request.x_coord,
          y_coord: request.y_coord,
          created_at: request.created_at,
        });
      } else if (request.request_type.toLowerCase() === 'delete') {
        await handleInsert('BlackList', {
          id: request.id,
          created_at: new Date().toISOString(), // Assuming you want to set the current timestamp
          location_id: request.site_id, // Replace with the appropriate value if available
          // Include other fields as necessary
        });
      }

      await handleDeleteFromTable('Pending', requestId);
      setPendingRequests(prev => prev.filter(req => req.id !== requestId));
    } catch (error) {
      console.error('Error pushing to UserAdded or BlackList:', error);
    }
  };

  const handleDeleteFromPending = async (requestId: number) => {
    await handleDeleteFromTable('Pending', requestId);
    setPendingRequests(prev => prev.filter(req => req.id !== requestId));
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
                <button className="button greenButton" onClick={() => handlePushToUserAddedOrBlackList(request.id)}>✔</button>
                <button className="button redButton" onClick={() => handleDeleteFromPending(request.id)}>X</button>
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
