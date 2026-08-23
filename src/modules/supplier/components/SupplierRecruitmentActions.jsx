import { Link } from 'react-router';
import { List, Plus } from 'lucide-react';

const actionBtn =
  'inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-[12px] font-semibold transition-colors';

const SupplierRecruitmentActions = ({ activeView = 'browse' }) => (
  <div className="flex flex-wrap gap-2">
    <Link
      to="/supplier/recruitment/my-jobs"
      className={`${actionBtn} ${
        activeView === 'mine'
          ? 'bg-green-secondary text-green-primary'
          : 'border border-green-primary/30 text-green-primary hover:bg-green-secondary'
      }`}
    >
      <List className="h-3.5 w-3.5" />
      My Job Post
    </Link>
    <Link
      to="/supplier/recruitment/create"
      className={`${actionBtn} bg-primary text-white hover:bg-[#066BB0]`}
    >
      <Plus className="h-3.5 w-3.5" />
      Post Job
    </Link>
  </div>
);

export default SupplierRecruitmentActions;
