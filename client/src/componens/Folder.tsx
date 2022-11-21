import React, { FC, useState } from "react";
import {
  FaFolder,
  FaFolderOpen,
  FaFolderPlus,
  FaFolderMinus,
} from "react-icons/fa";
import { RiArrowDownSFill, RiArrowRightSFill } from "react-icons/ri";
import styled from "styled-components";
import { FolderProps } from "../App";
import Modal from "./Modal";

export const Folder: FC<FolderProps | any> = ({ folder }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isAdd, setIsAdd] = useState<boolean>(false);
  const [children, setChildren] = useState<FolderProps[] | []>([]);
  const [folderName, setfolderName] = useState<string>("");
  const [folderId, setfolderId] = useState<string>("");

  const hasChild = folder?.children?.length > 0 ? true : false;

  const handleClick = async (id: string) => {
    if (hasChild) {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/api/folders/${id}`);
        const result = await response.json();
        if (result) {
          setChildren(result);
          setLoading(false);
        }
        // console.log(result);
      } catch (error) {
        console.log(error);
      }
    }
    setIsOpen((prev: boolean) => !prev);
  };
  const handleFolder = async (id: string, action: string) => {
    setfolderId(id);
    if (action === "Add") {
      setIsAdd(true);
      setShowModal((prev: boolean) => !prev);
    } else if (action === "Del") {
      setIsAdd(false);
      setShowModal((prev: boolean) => !prev);
    }
  };

  if (loading) return <div>Loading...</div>;
  return (
    <React.Fragment>
      <FolderContainer>
        <FolderWrapper>
          <NewFolder onClick={() => handleClick(folder._id)}>
            {isOpen ? (
              <React.Fragment>
                <FaFolderOpen style={FolderIcon} title="Open" />
                <RiArrowDownSFill
                  style={{ color: "#EEEEEE", fontSize: "1.5rem" }}
                />
              </React.Fragment>
            ) : (
              <React.Fragment>
                <FaFolder style={FolderIcon} title="Folder" />
                <RiArrowRightSFill
                  style={{ color: "#EEEEEE", fontSize: "1.5rem" }}
                />
              </React.Fragment>
            )}
            <span style={{ marginRight: "0.3rem" }}>{folder?.folderName}</span>
          </NewFolder>
          <DeleteFolder onClick={() => handleFolder(folder._id, "Del")}>
            {folder?.parentId === null ? null : (
              <FaFolderMinus style={FolderIcon} title="delete" />
            )}
          </DeleteFolder>
          <AddFolder onClick={() => handleFolder(folder._id, "Add")}>
            <FaFolderPlus style={FolderIcon} title="add" />
          </AddFolder>
        </FolderWrapper>
        <ChildFolder>
          {isOpen && (
            <div>
              <ul>
                {children?.length > 0
                  ? children?.map((childData: FolderProps) => (
                      <Folder folder={childData} key={childData._id} />
                    ))
                  : null}
              </ul>
            </div>
          )}
        </ChildFolder>
      </FolderContainer>
      {showModal ? (
        <Modal
          isAdd={isAdd}
          parentFolder={folder?.folderName}
          setShowModal={setShowModal}
          setFolderName={setfolderName}
          folderName={folderName}
          parentId={folderId}
        />
      ) : null}
    </React.Fragment>
  );
};

const FolderContainer = styled.div`
  color: white;
`;
const FolderWrapper = styled.span`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 2rem;
`;
const FolderIcon = { color: "#FC9B0A" };
const NewFolder = styled.span`
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
`;
const AddFolder = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`;
const DeleteFolder = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`;
const ChildFolder = styled.div`
  margin-left: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
