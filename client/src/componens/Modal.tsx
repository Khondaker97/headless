import React from "react";
import styled from "styled-components";
import { toast } from "react-toastify";
import { ActionProps, useAction } from "../context/ActionProvider";
type Props = {
  isAdd: boolean;
  parentFolder: string;
  parentId: string;
  folderName: string;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  setFolderName: React.Dispatch<React.SetStateAction<string>>;
};

const Modal = ({
  isAdd,
  parentFolder,
  parentId,
  setShowModal,
  folderName,
  setFolderName,
}: Props) => {
  const { setActionTaken } = useAction() as ActionProps;
  const handleChange: React.ChangeEventHandler = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const input = e.target.value;
    setFolderName(input);
  };

  const CreateFolder = async (id: string) => {
    try {
      let folderData = {
        parentId: id,
        folderName,
      };
      const response = await fetch(`http://localhost:5000/api/folders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(folderData),
      });
      const result = await response.json();
      setFolderName("");
      setActionTaken((prev: boolean) => !prev);
      if (result.success) {
        toast.success("Folder Created!");
      }
    } catch (error) {
      console.log(error);
    }
    setShowModal((prev: boolean) => !prev);
  };
  const DelFolder = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/folders/${id}`, {
        method: "DELETE",
      });
      const result = await response.json();
      if (result) {
        toast.warn("Deleted!");
      }
      setActionTaken((prev: boolean) => !prev);
    } catch (error) {
      console.log(error);
    }
    setShowModal((prev: boolean) => !prev);
  };

  const handleButton = () => {
    // console.log(parentId);
    return isAdd ? CreateFolder(parentId) : DelFolder(parentId);
  };
  return (
    <ModalContainer>
      <ModalWrapper>
        {isAdd ? (
          <Title>Add Folder in {parentFolder}</Title>
        ) : (
          <Title>Delete {parentFolder}</Title>
        )}
        {isAdd ? (
          <Input
            type="text"
            placeholder="Folder Name"
            value={folderName}
            onChange={handleChange}
          />
        ) : null}
        <ButtonWrapper>
          <Button onClick={() => setShowModal((prev: boolean) => !prev)}>
            Cancel
          </Button>
          <DelButton onClick={handleButton}>
            {isAdd ? "Create" : "Delete"}
          </DelButton>
        </ButtonWrapper>
      </ModalWrapper>
    </ModalContainer>
  );
};

export default Modal;

const ModalContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  width: 100%;
  height: 100vh;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.2);
`;

const ModalWrapper = styled.div`
  background-color: #fff;
  color: #4e4e4e;
  padding: 1rem 1.5rem;
  border-radius: 0.5rem;
`;
const Title = styled.h3``;
const Input = styled.input`
  margin-top: 1rem;
  outline: none;
  border: 2px solid #4e4e4e;
  border-radius: 0.5rem;
  padding: 0.5rem;
`;
const ButtonWrapper = styled.div`
  display: flex;
  justify-content: end;
  gap: 0.3rem;
  margin-top: 1rem;
`;
const Button = styled.button`
  outline: none;
  border: 2px solid salmon;
  background-color: #4e4e4e;
  color: #fff;
  padding: 0.3rem 0.8rem;
  border-radius: 0.5rem;
  font-size: 1rem;
  cursor: pointer;
  &:hover {
    border: 2px solid #eeeeee;
  }
`;
const DelButton = styled(Button)`
  border: 2px solid salmon;
  background-color: #ff4444;
`;
