// DocContainer.js
export function initializeLauncher(context) {
    // Target the main Docusaurus content container
    const mainContainer = document.querySelector('main.docMainContainer');

    if (mainContainer && !context.state.initialized) {
        // Create the ControlCenter launcher element
        const controlCenterDiv = document.createElement('div');
        controlCenterDiv.id = 'ControlCenter';
        controlCenterDiv.className = 'launcher';

        // Inner HTML for the launcher button
        controlCenterDiv.innerHTML = `
            <button class="launcher_button">
                load video and microscope...
            </button>
        `;

        // Append the launcher as a sibling to the main container
        mainContainer.parentElement.appendChild(controlCenterDiv);

        // Set dimensions and positioning to match the main container
        const { width, height, top, left } = mainContainer.getBoundingClientRect();
        controlCenterDiv.style.width = `${width}px`;
        controlCenterDiv.style.height = `${height}px`;
        controlCenterDiv.style.position = 'absolute';
        controlCenterDiv.style.top = `${top}px`;
        controlCenterDiv.style.left = `${left}px`;
        controlCenterDiv.style.zIndex = 1500;

        // Add click event listener for the button
        const launcherButton = controlCenterDiv.querySelector('.launcher_button');
        launcherButton.addEventListener('click', () => {
            context.swishAudio.currentTime = 0;
            context.swishAudio.play();
            context.openControlCenter();
        });
    }
}
