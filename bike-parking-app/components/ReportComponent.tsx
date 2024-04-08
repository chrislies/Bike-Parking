import React, { useState, MouseEvent } from 'react';
import "./css/style.css";

const ReportComponent = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [view, setView] = useState('comments');
  const [selectedOption, setSelectedOption] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [reportText, setReportText] = useState('');


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
  

  const closeModal = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setModalOpen(false);
  };

  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOption(event.target.value);
    setShowAlert(false);
  };

  const handleOtherInputChange = (event: React.FocusEvent<HTMLInputElement>) => {
    if (selectedOption !== 'Other') {
      setShowAlert(true);
      event.target.blur(); // Remove focus from the input box
    }
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
                <p>Here are the comments...</p>
                <button className="report-button" onClick={switchToSubmit}>File a Report</button>
              </div>
            ) : (
              <div>
                {/* <form>
                  <label>Your Report</label>
                  <textarea placeholder='Type your report here...'></textarea>
                  <button type='button' onClick={closeModal}>Submit Report</button>
                </form> */}
                {view === 'submit' && (
  <div>
    <button className="back-button" onClick={switchToComments}>&larr;</button>
    <form>
      <h3 className="report-title">Your Report</h3>
      {/* 其他表单内容 */}
    </form>
  </div>
)}
                <form>
                <h3 className="report-title" >File a Report</h3>
                <h4 className="option-title">Choose Option</h4>
                <div className="options">
                  <label className="option">
                    <input type="radio" name="reportOption" value="Theft" />
                    Theft
                  </label>
                  <label className="option">
                    <input type="radio" name="reportOption" value="Unsafe" />
                    Unsafe
                  </label>
                  <label className="option">
                    <input type="radio" name="reportOption" value="Inaccurate" />
                    Inaccurate
                  </label>
                  {/* <label className="option">
                    <input type="radio" name="reportOption" value="Other"
                      onChange={handleOptionChange} />
                    Other
                  </label> */}
                  {/* <label className="option">
                    <input type="radio" name="reportOption" value="Other" />
                    Other
                    <input type="text" className="other-specify-input" placeholder="Please specify" />
                  </label> */}
                  {/* {selectedOption === 'Other' && (
                    <input type="text" placeholder="Please specify" />
                  )} */}
                  <label className="option">
                    <input
                      type="radio"
                      name="reportOption"
                      value="Other"
                      onChange={handleOptionChange}
                    />
                    Other
                    <input
                      type="text"
                      className="other-specify-input"
                      placeholder="Please specify"
                      disabled={selectedOption !== 'Other'}
                      onFocus={handleOtherInputChange}
                    />
                    </label>
                </div>
                {showAlert && <p className="alert">Please select "Other" to specify.</p>}
                <br/>
                <textarea placeholder='Type your report here...'></textarea>
                <button type='button' onClick={closeModal}>Submit Report</button>
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
