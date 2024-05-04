export async function handleImageDelete(transaction) {
  const getImageSrcs = (fragment) => {
    let srcs = new Set();
    fragment.forEach((node) => {
      if (node.type.name === 'image') {
        srcs.add(node.attrs.src);
      }
    });
    return srcs;
  };

  let currentSrcs = getImageSrcs(transaction.doc.content);
  let previousSrcs = getImageSrcs(transaction.before.content);

  if (currentSrcs.size === 0 && previousSrcs.size === 0) {
    return;
  }

  // Determine which images were deleted
  let deletedImageSrcs = Array.from(previousSrcs).filter(
    (src) => !currentSrcs.has(src)
  );

  if (deletedImageSrcs.length > 0) {
    // Iterate over deleted image srcs and delete the blobs
    deletedImageSrcs.forEach(async (src) => {
      try {
        // Make a DELETE request to the API route to delete the blob
        const response = await fetch(`/api/images/delete?url=${src}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          console.log(`Blob deleted successfully for src: ${src}`);
        } else {
          console.error(`Failed to delete blob for src: ${src}`);
        }
      } catch (error) {
        console.error(`Error deleting blob for src: ${src}`, error);
      }
    });
  }
}
