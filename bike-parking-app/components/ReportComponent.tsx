import React, { useState, useEffect, MouseEvent, useRef } from 'react';
import "./css/style.css";
import useSession from "@/utils/supabase/use-session";
import toast, { Toaster } from "react-hot-toast";
import { debounce } from "@/hooks/useDebounce";
import { createSupabaseBrowserClient } from "@/utils/supabase/browser-client";
import axios from "axios";

interface Report {
  option: string;
  description: string;
  username: string;
  created_at: string;
}

interface ReportComponentProps {
  siteId?: string;
  x?: number;
  y?: number;
}

interface ReportData {
  username: string;
  option: string;
  site_id?: string;
  description: string;

}


const ReportComponent: React.FC<ReportComponentProps> = ({ siteId, x, y }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [view, setView] = useState('comments');
  const [selectedOption, setSelectedOption] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [reportText, setReportText] = useState('');
  const [reports, setReports] = useState<Report[]>([]);
  const session = useSession();
  const username = session?.user.user_metadata.username;
  const uuid = session?.user.id;
  const site_id = siteId;
  const [otherOption, setOtherOption] = useState('');
  const supabase = createSupabaseBrowserClient();
  // For delete Request 
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [description, setdescription] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const email = session?.user.email;
  const [selectedImage, setSelectedImage] = useState<string | null>(null);


  const fetchReports = async () => {
    const { data, error } = await supabase
      .from('Report')
      .select('created_at, username, option, description')
      .eq('location_id', siteId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching reports:', error);
    } else {
      setReports(data);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);


  const openModal = () => {
    setView('comments');
    setModalOpen(true);
    setSelectedOption('');
    setShowAlert(false);
  };

  const switchToSubmit = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setView('submit');
  };
  const switchToRequest = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setView('Delete');
    setDeleteModalOpen(true);
  };

  const switchToComments = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setView('comments');
  };


  // const closeModal = (event: MouseEvent<HTMLButtonElement>) => {
  //   event.stopPropagation();
  //   setModalOpen(false);
  // };

  const closeModal = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setModalOpen(false);
    setReportText('');
    setSelectedOption('');
  };


  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOption(event.target.value);
    setShowAlert(false);
    console.log("Option selected:", event.target.value);
  };

  const handleOtherInputChange = (event: React.FocusEvent<HTMLInputElement>) => {
    if (selectedOption !== 'Other') {
      setShowAlert(true);
      event.target.blur(); // Remove focus from the input box
    }
  };

  const handleSubmitReport = async (event: React.MouseEvent<HTMLButtonElement>) => {

    if (!selectedOption || !reportText.trim()) {
      alert('Please select an option and fill in the description.');
      return;
    }
    event.preventDefault();
    event.stopPropagation();

    if (!uuid) {
      toast.error("Sign in to submit request!");
      return;
    }

    const finalOption = selectedOption === 'Other' && otherOption.trim() !== '' ? otherOption : selectedOption;

    // const newReport = {
    //   //option: selectedOption,
    //   option: finalOption,
    //   description: reportText,
    // };
    // setReports([...reports, newReport]);

    const reportData: ReportData = {
      username: username,
      option: finalOption,
      site_id: site_id,
      description: reportText,
    };

    await addReport(reportData);

    // Reset the state
    setModalOpen(false);
    setReportText('');
    setSelectedOption('');
    setOtherOption('');

    // require information 
    console.log(username);
    console.log(site_id);

  };


  const addReport = debounce(async (reportData: ReportData) => {
    try {

      const { username, option, site_id, description } = reportData;

      const requestData = {
        username: username,
        option: option,
        site_id: site_id,
        description: description,
      };

      const response = await fetch("/api/report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestData)
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log("Report successfully added:", responseData);
        fetchReports();
      } else {
        console.error("Error adding report:", response.statusText);
      }
    } catch (error) {
      console.error("Server error when adding report:", error);
    }
  }, 300);

  const openDeleteModal = () => {
    setDeleteModalOpen(true); // Open the modal when the button is clicked
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false); // Close the modal when needed
  };


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
        const reader = new FileReader();
        reader.onload = (loadEvent: ProgressEvent<FileReader>) => {
          const target = loadEvent.target as FileReader;
          if (target && target.result) {
            setSelectedImage(target.result.toString());
          }
        };
        reader.readAsDataURL(file);
      } else {
        console.log("Only JPG and PNG files are allowed.");
      }
    }
  };
  const handleRemoveImage = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setSelectedImage(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDeleteRequest = async (event: React.MouseEvent<HTMLButtonElement>) => {

    if (!uuid) {
      toast.error("Sign in to delete locations!");
      return;
    }

    // Check if image and description are provided
    if (!description) {
      toast.error("Please provide a description!");
      return;
    }

    event.preventDefault();
    event.stopPropagation();



    setDeleteModalOpen(false);
    const updatePending = debounce(async () => {
      try {
        const requestData = {
          x_coord: x,
          y_coord: y,
          site_id: site_id,
          request_type: "Delete",
          email: email,
          description: description,
          image: selectedImage,

        };

        const response = await axios.post("/api/request", requestData);
        if (response.status === 200) {
          console.log(requestData.image);
          console.log("Request successfully added:", response.data);
        } else {
          console.log("Error adding request:", response.statusText);
        }
      } catch (error) {
        console.error("Server error:", error);
      }
    }, 300)
    updatePending();
       setModalOpen(false);
       setdescription('');
       setSelectedImage('');
  };


  //Generate button text based on the number of reports
  const buttonText = reports.length > 0 ? `[${reports.length} reports]` : 'Report';



  return (
    <div>
      <button className="report-button" onClick={openModal}>{buttonText}</button>
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-button" onClick={closeModal}>&times;</span>
            {view === 'comments' ? (
              <div className="comments-modal-wrapper">
              <div className="comments-header">
                <p className="comments-title">Reports</p>
              </div>
              <div className="comments-scrollable-body">
                {reports.map((report, index) => (
                  <div key={index} className="comment">
                    <p>{report.option} : {report.description}</p>
                    <p>Post by: {report.username}, {report.created_at}</p>
                  </div>
                ))}
              </div>
              <div className="comments-footer">
                <button className="report-button" onClick={switchToSubmit}>File a Report</button>
                <button className="report-button" onClick={switchToRequest}>Delete Request</button>
              </div>
            </div>
            ) :

              (
                <div>
                  {view === 'submit' && (
                    <div>
                      <button className="back-button" onClick={switchToComments}>&larr;</button>
                      { <form>
                    <h3 className="report-title" >File a Report</h3>
                    <h4 className="option-title">Choose Option</h4>
                    <div className="options">
                      <label className="option">
                        <input type="radio" name="reportOption" value="Theft" onChange={handleOptionChange} />
                        Theft
                      </label>
                      <label className="option">
                        <input type="radio" name="reportOption" value="Unsafe" onChange={handleOptionChange} />
                        Unsafe
                      </label>
                      <label className="option">
                        <input type="radio" name="reportOption" value="Inaccurate" onChange={handleOptionChange} />
                        Inaccurate
                      </label>
                      <label className="option">
                        <input type="radio" name="reportOption" value="Other" onChange={handleOptionChange} />
                        Other:
                        <input
                          type="text"
                          className="other-specify-input"
                          placeholder="Please specify"
                          disabled={selectedOption !== 'Other'}
                          value={otherOption}
                          onFocus={handleOtherInputChange}
                          onChange={(e) => setOtherOption(e.target.value)}
                        />
                      </label>
                    </div>
                    {showAlert && <p className="alert">Please select Other to specify.</p>}
                    <br />
                    <h5>Description</h5>
                    {/* <textarea placeholder='Type your report here...'></textarea> */}
                    <textarea
                      placeholder='Type your report here...'
                      value={reportText}
                      onChange={(e) => setReportText(e.target.value)}
                    ></textarea>
                    <button
                      type='button'
                      onClick={handleSubmitReport}
                    //disabled={!selectedOption || !reportText.trim()}
                    >Submit Report
                    </button>
                  </form>}
                    </div>
                  )}
                </div>
              )}
            {/* Delete oPTION */}
            {view === 'Delete' && (
              <div>
                {/* <button className="file-delete-Request" onClick={switchToRequest}>File a Delete Request</button> */}
                {isDeleteModalOpen && (
                  <div className="modal">
                    <div className="modal-content">
                     <button className="back-button" onClick={switchToComments}>&larr;</button> 
                      <h3 className="report-title">Enter Description</h3>
                      <input
                        ref={fileInputRef}
                        className="file-upload-button"
                        type="file"
                        accept=".jpg,.jpeg,.png"
                        onChange={handleFileChange}
                      />
                      {selectedImage && (
                        <div>
                          <img
                            src={selectedImage}
                            alt="Preview"
                            style={{ width: "100%", marginTop: "10px" }}
                          />
                          <button onClick={handleRemoveImage}>Remove</button>
                          <button
                            onClick={handleDeleteRequest}
                            style={{
                              position: "absolute",
                              bottom: "10px",
                              right: "10px",
                              zIndex: 1000,
                            }}
                          >
                            Submit
                          </button>
                        </div>
                      )}
                      <textarea
                        className="delete-description"
                        placeholder="Enter description"
                        value={description}
                        onChange={(e) => setdescription(e.target.value)}
                      ></textarea>

                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
     
    </div>
  );
};

export default ReportComponent;
