/**
 * Utility to split text into semantic chunks for vector storage.
 * Target size: 800-1200 characters per chunk.
 * Strategy: Split by paragraphs, then merge small paragraphs.
 */
export function chunkText(text: string, targetSize = 1000, minSize = 500): string[] {
  if (!text || text.trim().length === 0) return [];

  // 1. Split by paragraphs (double newlines)
  const paragraphs = text.split(/\n\n+/).map(p => p.trim()).filter(p => p.length > 0);
  
  const chunks: string[] = [];
  let currentChunk = '';

  for (const paragraph of paragraphs) {
    // If paragraph is huge (much larger than target), force split it (simple substring logic)
    // This handles giant walls of text without newlines
    if (paragraph.length > targetSize * 1.5) {
      if (currentChunk) {
        chunks.push(currentChunk);
        currentChunk = '';
      }
      
      // Split giant paragraph into smaller pieces
      let remaining = paragraph;
      while (remaining.length > targetSize) {
        // Try to find a sentence break near targetSize
        let splitIndex = remaining.lastIndexOf('. ', targetSize);
        if (splitIndex === -1 || splitIndex < targetSize * 0.5) {
            // No good sentence break, hard split at targetSize
            splitIndex = targetSize;
        } else {
            splitIndex += 1; // Include period
        }
        
        chunks.push(remaining.substring(0, splitIndex).trim());
        remaining = remaining.substring(splitIndex).trim();
      }
      if (remaining) {
        currentChunk = remaining; // Start new chunk with remainder
      }
      continue;
    }

    // Normal paragraph merging
    if (currentChunk.length + paragraph.length <= targetSize * 1.2) {
      currentChunk += (currentChunk ? '\n\n' : '') + paragraph;
    } else {
      if (currentChunk.length >= minSize) {
        chunks.push(currentChunk);
        currentChunk = paragraph;
      } else {
        // Current chunk is tiny but adding paragraph exceeds target?
        // Add it anyway if total is reasonable (< 1500 chars), otherwise push current and start new
        if (currentChunk.length + paragraph.length < 1500) {
           currentChunk += (currentChunk ? '\n\n' : '') + paragraph;
        } else {
           chunks.push(currentChunk);
           currentChunk = paragraph;
        }
      }
    }
  }

  if (currentChunk) {
    // Prevent tiny trailing fragments
    // If we have previous chunks and this one is very small (< 300 chars), merge it back
    if (chunks.length > 0 && currentChunk.length < 300) {
      chunks[chunks.length - 1] += '\n\n' + currentChunk;
    } else {
      chunks.push(currentChunk);
    }
  }

  return chunks;
}
