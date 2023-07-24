import { useCallback, useEffect, useState } from "react";

const useCacheImage = (src?: string) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  const cacheImage = useCallback(async (src: string) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.src = src;
      img.onerror = (...args) => reject(args);
    });
  }, []);

  useEffect(() => {
    if (src) {
      cacheImage(src).then(() => setImageLoaded(true));
      return;
    }
  }, [src, cacheImage]);

  return [imageLoaded];
};

export default useCacheImage;
