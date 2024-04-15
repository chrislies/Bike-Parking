"use client";
import React, { useEffect, useState } from 'react';
import { supabaseClient } from '@/config/supabaseClient';
import './Dashboard.page.css'; // Importing CSS

interface PendingRequest {
  id: number;
  email: string;
  x_coord: number;
  y_coord: number;
  request_type: string;
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
      const { data, error } = await supabaseClient
        .from('Pending')
        .select('*');

      if (error) {
        console.error('Error fetching pending requests:', error);
      } else {
        setPendingRequests(data);
      }
    };

    fetchPendingRequests();
  }, []);

  const handleImageClick = (imageSrc: string) => {
    setSelectedImage(imageSrc);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };

  const handleRejectButtonClick = async (requestId: number) => {
    try {
      // Send a delete request to remove the specified request from the "Pending" table
      const { error } = await supabaseClient
        .from('Pending')
        .delete()
        .eq('id', requestId);
  
      if (error) {
        console.error('Error rejecting request:', error.message);
      } else {
        // If deletion is successful, update the local state to remove the deleted request
        setPendingRequests(prevRequests => prevRequests.filter(request => request.id !== requestId));
        console.log('Request rejected successfully!');
      }
    } catch (error: any) {
      console.error('Error rejecting request:', error.message);
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
            <th className="th">Actions</th> {/* Actions column at the end */}
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
              <button className="button greenButton">✔</button>
              <button className="button redButton" onClick={() => handleRejectButtonClick(request.id)}>✘</button>
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