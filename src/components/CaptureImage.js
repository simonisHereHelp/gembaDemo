import { findChapterTitle } from './findTimeStamp'; // Import findChapterTitle function

const captureImage = (videoRef, canvasRef, CANVAS_WIDTH, CANVAS_HEIGHT, chapterId, savedPhotos, setSavedPhotos) => {
    if (!videoRef.current || !canvasRef.current) {
      console.error('Missing DOM element references.');
      return;
    }
        const context = canvasRef.current.getContext('2d');
        canvasRef.current.width = CANVAS_WIDTH;
        canvasRef.current.height = CANVAS_HEIGHT;

        // Draw the video frame on the canvas
        context.save();
        context.beginPath();
        context.moveTo(30, 0);
        context.arcTo(CANVAS_WIDTH, 0, CANVAS_WIDTH, CANVAS_HEIGHT, 30);
        context.arcTo(CANVAS_WIDTH, CANVAS_HEIGHT, 0, CANVAS_HEIGHT, 30);
        context.arcTo(0, CANVAS_HEIGHT, 0, 0, 30);
        context.arcTo(0, 0, CANVAS_WIDTH, 0, 30);
        context.clip();
        context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
        context.restore();

        // Add the date/time watermark
        const currentDate = new Date();
        const formattedDate = currentDate.toLocaleString('en-US', {
            month: '2-digit',
            day: '2-digit',
            year: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
        });

        const chapterTitle = findChapterTitle(chapterId); // Get chapter title dynamically
        const textContent = `MIN0434 - ${chapterTitle} (${formattedDate})`; // Updated watermark text
        context.font = '25px Arial';
        context.fillStyle = 'orange';
        context.textAlign = 'right';
        context.fillText(textContent, CANVAS_WIDTH - 20, 40);
        // Use findChapterTitle() to get the chapter title
        if (!chapterTitle) {
            console.error(`Invalid chapterId: ${chapterId}`);
            return;
        }

        const photoName = `${chapterTitle.replace(/\s+/g, '_')}.png`; 
        // Convert canvas to image and save
        const imageDataURL = canvasRef.current.toDataURL('image/png');

        const updatedPhotos = [...savedPhotos];
        updatedPhotos[chapterId] = { name: photoName, image: imageDataURL };
        setSavedPhotos(updatedPhotos);

};

export default captureImage;
