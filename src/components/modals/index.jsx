import Add from './Add';
import Rename from './Rename';
import Remove from './Remove';


export default (modalType) => {
  return {
    adding: Add,
    renaming: Rename,
    removing: Remove,
  }[modalType];
};