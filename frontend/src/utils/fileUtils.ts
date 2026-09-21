export const handleViewOrDownloadFile = (url: string, download: boolean = false) => {
    if (!url) return;

    if (url.startsWith('data:')) {
        try {
            // Split the data URI
            const arr = url.split(',');
            const mimeMatch = arr[0].match(/:(.*?);/);
            const mime = mimeMatch ? mimeMatch[1] : 'application/octet-stream';
            
            // Decode base64 to Blob
            const bstr = atob(arr[1]);
            let n = bstr.length;
            const u8arr = new Uint8Array(n);
            while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
            }
            const blob = new Blob([u8arr], { type: mime });
            const blobUrl = URL.createObjectURL(blob);
            
            if (download) {
                const a = document.createElement('a');
                a.href = blobUrl;
                // Infer a generic extension based on mime type
                let ext = 'pdf';
                if (mime.includes('png')) ext = 'png';
                else if (mime.includes('jpeg') || mime.includes('jpg')) ext = 'jpg';
                a.download = `document.${ext}`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            } else {
                window.open(blobUrl, '_blank', 'noopener,noreferrer');
            }
        } catch (e) {
            console.error("Failed to process data URI", e);
        }
    } else {
        const proxyUrl = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1'}/files/proxy?url=${encodeURIComponent(url)}${download ? '&download=true' : ''}`;
        window.open(proxyUrl, '_blank', 'noopener,noreferrer');
    }
};
