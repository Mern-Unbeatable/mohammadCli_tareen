import { panelPageTheme } from './panelPageTheme';

const PanelPage = ({ children, className = '' }) => (
  <div className={`${panelPageTheme.page} ${className}`.trim()}>{children}</div>
);

export default PanelPage;
