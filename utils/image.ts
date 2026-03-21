export const ImageUtils = {
  /**
   * Compresses an image and converts it to a Base64 string.
   * @param file The image file to compress.
   * @param targetKB Target size in KB (approx).
   */
  compressAndConvertToBase64: (file: File, targetKB: number = 500): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;

          // Maintain aspect ratio while ensuring reasonable dimensions
          const maxDimension = 1200;
          if (width > height) {
            if (width > maxDimension) {
              height *= maxDimension / width;
              width = maxDimension;
            }
          } else {
            if (height > maxDimension) {
              width *= maxDimension / height;
              height = maxDimension;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, width, height);

          // Initial quality
          let quality = 0.8;
          let dataUrl = canvas.toDataURL("image/jpeg", quality);

          // Adjust quality to hit target size
          const targetSize = targetKB * 1024;
          while (dataUrl.length * 0.75 > targetSize && quality > 0.1) {
            quality -= 0.1;
            dataUrl = canvas.toDataURL("image/jpeg", quality);
          }

          resolve(dataUrl);
        };
        img.onerror = (err) => reject(err);
      };
      reader.onerror = (err) => reject(err);
    });
  },
};
