window.CLOUDINARY_CONFIG = {
  cloudName: 'dgdcx4n8s',
  apiKey: '526181251285373'
};

window.getCloudinaryUrl = function(localPath, options) {
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
  
  var transformPath = transformation.length > 0 ? '/' + transformation.join(',') : '';
  var fileName = localPath.split('/').pop();
  
  return baseUrl + transformPath + '/' + fileName;
};

window.convertAllImageSources = function() {
  var images = document.querySelectorAll('img[src], img[data-src]');
  images.forEach(function(img) {
    var currentSrc = img.getAttribute('src') || img.getAttribute('data-src');
    if (currentSrc && currentSrc.startsWith('assets/')) {
      var cloudUrl = window.getCloudinaryUrl(currentSrc);
      if (img.getAttribute('src')) {
        img.setAttribute('src', cloudUrl);
      }
      if (img.getAttribute('data-src')) {
        img.setAttribute('data-src', cloudUrl);
      }
    }
  });
  
  var pictures = document.querySelectorAll('picture source');
  pictures.forEach(function(source) {
    var currentSrcset = source.getAttribute('srcset') || source.getAttribute('data-srcset');
    if (currentSrcset && currentSrcset.includes('assets/')) {
      var urls = currentSrcset.split(',').map(function(item) {
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

document.addEventListener('DOMContentLoaded', function() {
  window.convertAllImageSources();
});
