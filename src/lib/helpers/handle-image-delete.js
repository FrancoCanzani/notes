export function handleImageDelete(transaction) {
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

  // Determine which images were deleted
  let deletedImageSrcs = Array.from(previousSrcs).filter(
    (src) => !currentSrcs.has(src)
  );

  if (deletedImageSrcs.length > 0) {
    // Schedule the deletion task to run after 30 minutes
    setTimeout(
      () => {
        handleDelayedDeletion(deletedImageSrcs, previousSrcs);
      },
      30 * 60 * 1000
    ); // 30 minutes delay
  }
}

// Function to handle delayed image deletions
async function handleDelayedDeletion(deletedImageSrcs, previousSrcs) {
  // Iterate over deleted image srcs and delete the blobs
  for (const src of deletedImageSrcs) {
    try {
      // Check if the src still exists in the previous set
      if (previousSrcs.has(src)) {
        // Make a DELETE request to the API route to delete the blob
        const response = await fetch(`/api/images/delete?url=${src}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          console.log(`Blob deleted successfully for src: ${src}`);
        } else {
          console.error(`Failed to delete blob for src: ${src}`);
        }
      } else {
        console.log(
          `Image with src ${src} was added or modified after 30 minutes.`
        );
      }
    } catch (error) {
      console.error(`Error deleting blob for src: ${src}`, error);
    }
  }
}
