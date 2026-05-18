// Get the HTML elements and store them in simple variables
const aboutButton = document.getElementById('about-btn');
const aboutBox = document.getElementById('about-box');
const closeButton = document.getElementById('close-btn');

// When the user clicks the "About" button, change CSS from 'none' to 'flex' to show it
aboutButton.addEventListener('click', function() {
    aboutBox.style.display = 'flex';
});

// When the user clicks the "Close" button, hide the box again
closeButton.addEventListener('click', function() {
    aboutBox.style.display = 'none';
});

// If the user clicks anywhere outside the pop-up box, hide it too
window.addEventListener('click', function(event) {
    if (event.target === aboutBox) {
        aboutBox.style.display = 'none';
    }
});