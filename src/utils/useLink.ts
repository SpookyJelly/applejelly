import { useMemo } from 'react';

export const useLink = ({ onClick, href, isEnabled = true }) => {
  const handleClick = useMemo(() => {
    if (isEnabled && href && href[0] === '#') {
      return (event) => {
        const target = document.getElementById(href.substring(1));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
          history.pushState(undefined, document.title, href);
          event.preventDefault();
        }
      };
    }
    return onClick;
  }, [isEnabled, href, onClick]);

  return handleClick;
};
