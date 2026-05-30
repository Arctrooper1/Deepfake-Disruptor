/**
 * Performs digital Error Level Analysis (ELA) on an image using HTML5 Canvas.
 * ELA works by compressing an image at a known quality level (e.g., 85%) and 
 * observing the difference pixel-by-pixel against the raw input. Since edited
 * or AI-synthesized portions of images have different compression histories, 
 * they manifest as clusters of high discrepancy (brighter pixels) in the scaled difference.
 */
export function performErrorLevelAnalysis(
  imageSrc: string,
  jpegQuality: number = 0.85,
  amplification: number = 20
): Promise<{ elaDataUrl: string; width: number; height: number }> {
  return new Promise((resolve, reject) => {
    // Standard image element loading
    const img = new Image();
    // Enable cross-origin for external images fetched via URL
    img.crossOrigin = "anonymous";
    img.src = imageSrc;

    img.onload = () => {
      try {
        const originalCanvas = document.createElement("canvas");
        const ctxOriginal = originalCanvas.getContext("2d");
        if (!ctxOriginal) {
          throw new Error("Could not initialize original canvas render context.");
        }

        // Keep bounds reasonable for instant frame analysis without lag
        const maxDimension = 900;
        let w = img.naturalWidth;
        let h = img.naturalHeight;
        
        if (w === 0 || h === 0) {
          // Fallback if dimensions are missing
          w = 600;
          h = 400;
        }

        if (w > maxDimension || h > maxDimension) {
          if (w > h) {
            h = Math.round((h * maxDimension) / w);
            w = maxDimension;
          } else {
            w = Math.round((w * maxDimension) / h);
            h = maxDimension;
          }
        }

        originalCanvas.width = w;
        originalCanvas.height = h;
        ctxOriginal.drawImage(img, 0, 0, w, h);

        // 1. Export as JPEG at specific forensic quality (e.g. 85%)
        const jpegDataUrl = originalCanvas.toDataURL("image/jpeg", jpegQuality);

        // 2. Load the recompressed image to compare pixel arrays
        const recompressedImg = new Image();
        recompressedImg.src = jpegDataUrl;
        
        recompressedImg.onload = () => {
          try {
            const recompressedCanvas = document.createElement("canvas");
            const ctxRecompressed = recompressedCanvas.getContext("2d");
            if (!ctxRecompressed) {
              throw new Error("Could not initialize compressed canvas render context.");
            }

            recompressedCanvas.width = w;
            recompressedCanvas.height = h;
            ctxRecompressed.drawImage(recompressedImg, 0, 0, w, h);

            // Extract pixel byte buffers
            const originalBuffer = ctxOriginal.getImageData(0, 0, w, h);
            const recompressedBuffer = ctxRecompressed.getImageData(0, 0, w, h);

            const oData = originalBuffer.data;
            const rData = recompressedBuffer.data;

            // 3. Render the absolute difference amplified onto a final canvas
            const elaCanvas = document.createElement("canvas");
            const ctxEla = elaCanvas.getContext("2d");
            if (!ctxEla) {
              throw new Error("Could not initialize ELA canvas render context.");
            }

            elaCanvas.width = w;
            elaCanvas.height = h;

            const elaBuffer = ctxEla.createImageData(w, h);
            const eData = elaBuffer.data;

            for (let i = 0; i < oData.length; i += 4) {
              // Compute difference and multiply with amplification scaling
              const diffRed = Math.abs(oData[i] - rData[i]) * amplification;
              const diffGreen = Math.abs(oData[i + 1] - rData[i + 1]) * amplification;
              const diffBlue = Math.abs(oData[i + 2] - rData[i + 2]) * amplification;

              // Cap channel levels at 255
              eData[i] = Math.min(255, diffRed);
              eData[i + 1] = Math.min(255, diffGreen);
              eData[i + 2] = Math.min(255, diffBlue);
              eData[i + 3] = 255; // Alpha opaque
            }

            ctxEla.putImageData(elaBuffer, 0, 0);
            
            resolve({
              elaDataUrl: elaCanvas.toDataURL("image/png"),
              width: img.naturalWidth,
              height: img.naturalHeight,
            });
          } catch (e: any) {
            reject(e.message || "Failed inner recompression comparisons.");
          }
        };

        recompressedImg.onerror = () => {
          reject("Corrupt recompressed buffer load triggered. Try a higher quality setting.");
        };
      } catch (e: any) {
        reject(e.message || "Canvas ELA comparison error.");
      }
    };

    img.onerror = () => {
      reject("Failed to parse visual image source. Cross-Origin validation limits or unsupported media.");
    };
  });
}
