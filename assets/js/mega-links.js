(function () {
    const travelWebsiteFolderUrl = 'https://mega.nz/folder/9iwGgIgY#WCTXZi8Q-n2rVn_-wQHFwA';

    const imageFolderUrl = travelWebsiteFolderUrl;
    const videoFolderUrl = travelWebsiteFolderUrl;

    const imageLinks = Object.create(null);
    const videoLinks = Object.create(null);

    const imageSources = Array.isArray(window.travelGalleryImages)
        ? window.travelGalleryImages.map((item) => item.src)
        : [];

    imageSources.forEach((src) => {
        imageLinks[src] = imageFolderUrl;
    });

    [
        'assets/video/1.mp4',
        'assets/video/2.mp4',
        'assets/video/3.mp4',
        'assets/video/4.mp4',
        'assets/video/5.mp4',
        'assets/video/6.mp4',
        'assets/video/optimized/1-opt.mp4',
        'assets/video/optimized/2-opt.mp4',
        'assets/video/optimized/3-opt.mp4',
        'assets/video/optimized/4-opt.mp4',
        'assets/video/optimized/5-opt.mp4',
        'assets/video/optimized/1-poster.jpg',
        'assets/video/optimized/2-poster.jpg',
        'assets/video/optimized/3-poster.jpg',
        'assets/video/optimized/4-poster.jpg',
        'assets/video/optimized/5-poster.jpg',
        'assets/video/optimized/1-poster.webp',
        'assets/video/optimized/2-poster.webp',
        'assets/video/optimized/3-poster.webp',
        'assets/video/optimized/4-poster.webp',
        'assets/video/optimized/5-poster.webp'
    ].forEach((src) => {
        videoLinks[src] = videoFolderUrl;
    });

    window.travelMegaLinks = {
        root: travelWebsiteFolderUrl,
        imageFolder: imageFolderUrl,
        videoFolder: videoFolderUrl,
        images: imageLinks,
        videos: videoLinks
    };

    window.getMegaLink = function (src) {
        if (!src || !window.travelMegaLinks) {
            return '';
        }

        return window.travelMegaLinks.images[src] || window.travelMegaLinks.videos[src] || window.travelMegaLinks.root || '';
    };

    window.getOptimizedImageBase = function (src) {
        if (!src || typeof src !== 'string' || !src.startsWith('assets/img/')) {
            return '';
        }

        const parts = src.split('/');
        const folder = parts[parts.length - 2];
        const fileName = parts[parts.length - 1];
        const stem = fileName
            .replace(/\.[^.]+$/, '')
            .replace(/-(480|768|1200)$/, '');

        return `assets/img/optimized/${folder}/${stem}`;
    };
})();
