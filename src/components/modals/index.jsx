import Add from './Add';
import Rename from './Rename';
import Remove from './Remove';

export default (modalType) => ({
  adding: Add,
  renaming: Rename,
  removing: Remove,
}[modalType]);
