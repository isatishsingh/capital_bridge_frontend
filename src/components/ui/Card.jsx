export const Card = ({ children, className = '', ...rest }) => (
  <div className={`surface p-6 ${className}`} {...rest}>
    {children}
  </div>
);
