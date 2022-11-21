import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useState,
} from "react";

export type ActionProps = {
  actionTaken: boolean;
  setActionTaken: React.Dispatch<React.SetStateAction<boolean>>;
};
const ActionContext = createContext<ActionProps | undefined>(undefined);
const ActionProvider = ({ children }: PropsWithChildren) => {
  const [actionTaken, setActionTaken] = useState<boolean>(false);
  const value = {
    actionTaken,
    setActionTaken,
  };
  return (
    <ActionContext.Provider value={value}>{children}</ActionContext.Provider>
  );
};

export default ActionProvider;

export const useAction = () => {
  return useContext(ActionContext);
};
