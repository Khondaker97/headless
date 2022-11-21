import React, { FC, useEffect, useState } from "react";
import styled from "styled-components";
import { Folder } from "./componens/Folder";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ActionProps, useAction } from "./context/ActionProvider";

export type FolderProps = {
  _id: string;
  folderName: string;
  parentId: null;
  children: ChildProps[];
};

export interface ChildProps {
  folderName: string;
  childId: string;
}

const App: FC = () => {
  const [rootFolder, setRootFolder] = useState<FolderProps | null>(null);
  const { actionTaken } = useAction() as ActionProps;

  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();
    const getData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/root", {
          signal: controller.signal,
        });
        const result = await response.json();
        if (mounted) {
          setRootFolder(result[0]);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getData();

    return () => {
      mounted = false;
      controller.abort();
    };
  }, [actionTaken]);

  return (
    <React.Fragment>
      <AppContainer>
        <Folder folder={rootFolder} />
      </AppContainer>
      <ToastContainer
        position="top-left"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover={false}
        theme="dark"
      />
    </React.Fragment>
  );
};

export default App;

const AppContainer = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: #404258;
  padding: 2rem 4rem;
  display: flex;
  justify-content: flex-start;
`;
