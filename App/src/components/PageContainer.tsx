import PageContainerStyled from "./styles/PagesContainer.styled";

export type PagesProps = {
  children?: React.ReactNode;
  type?: "settings" | "other";
};

const PageContainer: React.FC<PagesProps> = ({ children, type }) => {
  return <PageContainerStyled type={type}>{children}</PageContainerStyled>;
};

export default PageContainer;
