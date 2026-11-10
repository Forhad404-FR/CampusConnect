import { Link } from 'react-router-dom';

// variant: primary | secondary | danger | ghost    size: md | sm
// Pass `to` to render a router link styled as a button.
export default function Button({ variant = 'primary', size = 'md', to, icon: Icon, children, className = '', type = 'button', ...rest }) {
  const cls = `btn btn-${variant} btn-${size} ${className}`.trim();
  const content = (
    <>
      {Icon && <Icon size={size === 'sm' ? 15 : 17} aria-hidden="true" />}
      {children}
    </>
  );
  if (to) return <Link to={to} className={cls} {...rest}>{content}</Link>;
  return <button type={type} className={cls} {...rest}>{content}</button>;
}
