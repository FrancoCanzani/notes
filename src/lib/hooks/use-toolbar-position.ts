import { useEffect, useState } from 'react';

function useToolbarPosition() {
  const [toolbarTop, setToolbarTop] = useState(0);

  useEffect(() => {
    function fixPosition() {
      const keyboardHeight =
        parseInt(
          getComputedStyle(document.documentElement).getPropertyValue(
            '--keyboard-inset-height'
          ),
          10
        ) || 0;
      setToolbarTop(keyboardHeight);
    }

    fixPosition();
    window.addEventListener('resize', fixPosition);
    return () => window.removeEventListener('resize', fixPosition);
  }, []);

  return toolbarTop;
}

export default useToolbarPosition;
