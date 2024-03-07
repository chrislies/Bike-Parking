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