import useReveal from '../hooks/useReveal.js';

export default function Reveal({ children, className = '', as: Tag = 'div' }) {
  const [ref, cls] = useReveal();
  return <Tag ref={ref} className={`${cls} ${className}`}>{children}</Tag>;
}
