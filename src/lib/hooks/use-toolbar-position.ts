import { useEffect, useState } from 'react';

function useToolbarPosition() {
  const [toolbarBottom, setToolbarBottom] = useState(0);

  useEffect(() => {
    function fixPosition() {
      const footer = document.querySelector('.stick-it-to-the-man');
      if (footer && window.visualViewport) {
        const vv = window.visualViewport;
        const footerHeight = (footer as HTMLElement).offsetHeight; // Cast to HTMLElement to access offsetHeight
        const toolbarBottomPosition = vv.height - footerHeight;
        setToolbarBottom(toolbarBottomPosition);
      }
    }

    const footer = document.querySelector('.stick-it-to-the-man');
    if (footer && window.visualViewport) {
      const vv = window.visualViewport;
      vv.addEventListener('resize', fixPosition);
      fixPosition();
    }

    return () => {
      const vv = window.visualViewport;
      if (vv) {
        vv.removeEventListener('resize', fixPosition);
      }
    };
  }, []);

  return toolbarBottom;
}

export default useToolbarPosition;
