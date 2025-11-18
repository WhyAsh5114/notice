import { formatHex } from 'culori';

export function oklchToHex(oklchString: string): string {
	const cleaned = oklchString.replace(/oklch\(|\)/g, '').trim();
	const [l, c, h] = cleaned.split(/\s+/).map((val, index) => {
		const num = parseFloat(val);
		if (index === 0) return Math.max(0, Math.min(1, num)); // lightness
		if (index === 1) return Math.max(0, Math.min(0.4, num)); // chroma
		if (index === 2) return num % 360; // hue
		return num;
	});

	const oklchColor = { mode: 'oklch' as const, l, c, h: h || 0 };
	return formatHex(oklchColor) || '#000000';
}

export async function getAppropriateBackgroundColor(base64Image: string): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous'; // Enable CORS for canvas
    
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        
        if (!ctx) {
          resolve('#f5f5f5');
          return;
        }

        // Use naturalWidth/naturalHeight to ensure we have the actual image dimensions
        const w = img.naturalWidth || img.width;
        const h = img.naturalHeight || img.height;

        if (w === 0 || h === 0) {
          resolve('#f5f5f5');
          return;
        }

        canvas.width = w;
        canvas.height = h;
        ctx.drawImage(img, 0, 0, w, h);

        // Sample edge pixels
        const edgePixels: number[][] = [];

        // Top and bottom edges
        for (let x = 0; x < w; x += Math.max(1, Math.floor(w / 20))) {
          const topData = ctx.getImageData(x, 0, 1, 1).data;
          const bottomData = ctx.getImageData(x, h - 1, 1, 1).data;
          // Only include pixels with sufficient opacity (alpha > 50)
          if (topData[3] > 50) {
            edgePixels.push([topData[0], topData[1], topData[2]]);
          }
          if (bottomData[3] > 50) {
            edgePixels.push([bottomData[0], bottomData[1], bottomData[2]]);
          }
        }

        // Left and right edges
        for (let y = 0; y < h; y += Math.max(1, Math.floor(h / 20))) {
          const leftData = ctx.getImageData(0, y, 1, 1).data;
          const rightData = ctx.getImageData(w - 1, y, 1, 1).data;
          // Only include pixels with sufficient opacity (alpha > 50)
          if (leftData[3] > 50) {
            edgePixels.push([leftData[0], leftData[1], leftData[2]]);
          }
          if (rightData[3] > 50) {
            edgePixels.push([rightData[0], rightData[1], rightData[2]]);
          }
        }

        if (edgePixels.length === 0) {
          // If no opaque edge pixels, sample the entire image for opaque pixels
          const sampleSize = 5; // Sample every 5th pixel for better coverage
          for (let y = 0; y < h; y += sampleSize) {
            for (let x = 0; x < w; x += sampleSize) {
              const pixelData = ctx.getImageData(x, y, 1, 1).data;
              if (pixelData[3] > 50) {
                edgePixels.push([pixelData[0], pixelData[1], pixelData[2]]);
              }
            }
          }
        }

        if (edgePixels.length === 0) {
          // Completely transparent image - use a dark gray
          resolve('#2a2a2a');
          return;
        }

        // Calculate average edge color
        const avgR = edgePixels.reduce((sum, p) => sum + p[0], 0) / edgePixels.length;
        const avgG = edgePixels.reduce((sum, p) => sum + p[1], 0) / edgePixels.length;
        const avgB = edgePixels.reduce((sum, p) => sum + p[2], 0) / edgePixels.length;

        // Calculate relative luminance
        const luminance = (0.2126 * avgR + 0.7152 * avgG + 0.0722 * avgB) / 255;

        // Check if the image is very light (white or near-white)
        const isVeryLight = avgR > 240 && avgG > 240 && avgB > 240;
        // Check if the image is very dark (black or near-black)
        const isVeryDark = avgR < 15 && avgG < 15 && avgB < 15;

        let result: string;

        if (isVeryLight) {
          // White/very light image - use dark gray background
          result = '#2a2a2a';
        } else if (isVeryDark) {
          // Black/very dark image - use a light gray background for contrast
          result = '#e5e5e5';
        } else if (luminance < 0.5) {
          // Dark image - create a light, tinted background
          const lightenFactor = 0.88;
          const r = Math.round(avgR + (255 - avgR) * lightenFactor);
          const g = Math.round(avgG + (255 - avgG) * lightenFactor);
          const b = Math.round(avgB + (255 - avgB) * lightenFactor);
          result = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
        } else {
          // Light image - create a dark, tinted background
          const darkenFactor = 0.88;
          const r = Math.round(avgR * (1 - darkenFactor));
          const g = Math.round(avgG * (1 - darkenFactor));
          const b = Math.round(avgB * (1 - darkenFactor));
          result = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
        }

        resolve(result);
      } catch (error) {
        resolve('#f5f5f5');
      }
    };

    img.onerror = () => {
      resolve('#f5f5f5');
    };

    const src = base64Image.startsWith('data:') ? base64Image : `data:image/png;base64,${base64Image}`;
    img.src = src;
  });
}
