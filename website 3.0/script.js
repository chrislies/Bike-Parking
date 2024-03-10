function showSection(sectionId) {
    /*This declares a function named showSection that takes one parameter sectionId, which represents the id of the section to be shown. */
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.style.display = 'none';
    });
    const sectionToShow = document.getElementById(sectionId);
    if(sectionToShow) {
        sectionToShow.style.display = 'block';
    } else {
        document.getElementById('mainSection').style.display = 'block'; // Show main section by default
    }
}

function proceedAfterAgreement() {
    if(document.getElementById('agreeTerms').checked) {
        // Code to handle the agreement, possibly submitting the form or moving to the next section
        alert('Thank you for agreeing to the terms. Proceeding...');
        // Hide the Terms and Conditions section again
        document.getElementById('TermAndConditionSection').style.display = 'none';
    } else {
        alert('You must agree to the terms and conditions to continue.');
    }
}