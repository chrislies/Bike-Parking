import React, { useState, MouseEvent } from 'react';
import "./css/style.css";
import useSession from "@/utils/supabase/use-session";
import toast, { Toaster } from "react-hot-toast";


interface Report {
  option: string;
  description: string;
}

interface ReportComponentProps {
  siteId: string;
}

const ReportComponent: React.FC<ReportComponentProps> = ({ siteId }) => {
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

  const handleSubmitReport = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (!uuid) {
      toast.error("Sign in to submit request!");
      return;
    }

    const newReport = {
      option: selectedOption,
      description: reportText,
    };
    setReports([...reports, newReport]);
    setModalOpen(false);
    setReportText('');
    setSelectedOption('');

    console.log(username);
    console.log(site_id);
  };





  return (
    <div>
      <button className="report-button" onClick={openModal}>Report</button>
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-button" onClick={closeModal}>&times;</span>
            {view === 'comments' ? (
              <div>
                {/* <p>Here are the comments...</p>
                <button className="report-button" onClick={switchToSubmit}>File a Report</button> */}
                <p className="comments-title">Reports</p>
                {reports.map((report, index) => (
                  <div key={index} className="comment">
                    <p>{report.option} : {report.description}</p>
                    <p></p>
                  </div>
                ))}
                <button className="report-button" onClick={switchToSubmit}>File a Report</button>
              </div>
            ) : (
              <div>
                {view === 'submit' && (
                  <div>
                    <button className="back-button" onClick={switchToComments}>&larr;</button>
                    {/* <form>
                      <h3 className="report-title">Your Report</h3>
                    </form> */}
                  </div>
                )}
                <form>
                  <h3 className="report-title" >File a Report</h3>
                  <h4 className="option-title">Choose Option</h4>
                  <div className="options">
                    <label className="option">
                      <input type="radio" name="reportOption" value="Theft" onChange={handleOptionChange}/>
                      Theft
                    </label>
                    <label className="option">
                      <input type="radio" name="reportOption" value="Unsafe" onChange={handleOptionChange}/>
                      Unsafe
                    </label>
                    <label className="option">
                      <input type="radio" name="reportOption" value="Inaccurate" onChange={handleOptionChange}/>
                      Inaccurate
                    </label>
                    <label className="option">
                      <input type="radio" name="reportOption" value="Other" onChange={handleOptionChange}/>
                      Other: 
                      <input
                        type="text"
                        className="other-specify-input"
                        placeholder="Please specify"
                        disabled={selectedOption !== 'Other'}
                        onFocus={handleOtherInputChange}
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
                  <button type='button' onClick={handleSubmitReport}>Submit Report</button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportComponent;
