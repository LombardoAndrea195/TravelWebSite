window.CLOUDINARY_CONFIG = {
    cloudName: 'dgdcx4n8s',
    apiKey: '526181251285373'
};

window.extractAssetImagePath = function (inputPath) {
    if (!inputPath || typeof inputPath !== 'string') {
        return '';
    }

    var cleaned = inputPath.split('#')[0].split('?')[0].trim();
    if (!cleaned) {
        return '';
    }

    if (cleaned.indexOf('assets/img/') === 0) {
        return cleaned;
    }

    var marker = '/assets/img/';
    var markerIndex = cleaned.indexOf(marker);
    if (markerIndex !== -1) {
        return cleaned.slice(markerIndex + 1);
    }

    return '';
};

window.localImagePathToPublicId = function (localPath) {
    var assetPath = window.extractAssetImagePath(localPath);
    if (!assetPath) {
        return '';
    }

    var relative = assetPath.replace(/^assets\/img\//, '');
    var withoutExt = relative.replace(/\.[^.]+$/, '');

    if (relative.indexOf('optimized/') === 0) {
        var noOptimizedPrefix = relative.replace(/^optimized\//, '');
        var noSizeVariant = noOptimizedPrefix.replace(/-(480|768|1200)(\.[^.]+)$/, '$2');
        withoutExt = noSizeVariant.replace(/\.[^.]+$/, '');
    }

    return withoutExt;
};

window.getCloudinaryUrl = function (localPath, options) {
    if (!localPath) return '';

    options = options || {};

    var cloudName = window.CLOUDINARY_CONFIG.cloudName;
    var baseUrl = 'https://res.cloudinary.com/' + cloudName + '/image/upload';

    var transformation = [];
    if (options.width) {
        transformation.push('w_' + options.width);
    }
    if (options.quality) {
        transformation.push('q_' + options.quality);
    }
    if (options.format) {
        transformation.push('f_' + options.format);
    }

    if (!options.format) {
        transformation.push('f_auto');
    }

    if (!options.quality) {
        transformation.push('q_auto');
    }

    var transformPath = transformation.length > 0 ? '/' + transformation.join(',') : '';
    var publicId = window.localImagePathToPublicId(localPath);
    if (!publicId) {
        return localPath;
    }

    return baseUrl + transformPath + '/' + publicId;
};

window.convertAllImageSources = function () {
    var images = document.querySelectorAll('img[src], img[data-src]');
    images.forEach(function (img) {
        var currentSrc = img.getAttribute('src') || img.getAttribute('data-src');
        if (currentSrc && currentSrc.startsWith('assets/')) {
            var cloudUrl = window.getCloudinaryUrl(currentSrc);
            var originalSrc = currentSrc;

            img.setAttribute('data-local-src', originalSrc);
            img.addEventListener('error', function onCloudinaryError() {
                var localSrc = img.getAttribute('data-local-src');
                if (!localSrc) {
                    return;
                }

                img.removeEventListener('error', onCloudinaryError);
                img.setAttribute('src', localSrc);

                var picture = img.closest('picture');
                if (picture) {
                    picture.querySelectorAll('source').forEach(function (source) {
                        var localSrcset = source.getAttribute('data-local-srcset');
                        if (localSrcset) {
                            source.setAttribute('srcset', localSrcset);
                        }
                    });
                }
            });

            if (img.getAttribute('src')) {
                img.setAttribute('src', cloudUrl);
            }
            if (img.getAttribute('data-src')) {
                img.setAttribute('data-src', cloudUrl);
            }
        }
    });

    var pictures = document.querySelectorAll('picture source');
    pictures.forEach(function (source) {
        var currentSrcset = source.getAttribute('srcset') || source.getAttribute('data-srcset');
        if (currentSrcset && currentSrcset.includes('assets/')) {
            source.setAttribute('data-local-srcset', currentSrcset);
            var urls = currentSrcset.split(',').map(function (item) {
                var parts = item.trim().split(/\s+/);
                var path = parts[0];
                var descriptor = parts.slice(1).join(' ');

                if (path.startsWith('assets/')) {
                    path = window.getCloudinaryUrl(path);
                }
                return descriptor ? path + ' ' + descriptor : path;
            });

            var newSrcset = urls.join(', ');
            if (source.getAttribute('srcset')) {
                source.setAttribute('srcset', newSrcset);
            }
            if (source.getAttribute('data-srcset')) {
                source.setAttribute('data-srcset', newSrcset);
            }
        }
    });
};

document.addEventListener('DOMContentLoaded', function () {
    window.convertAllImageSources();
});
