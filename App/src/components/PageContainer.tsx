import PageContainerStyled from "./styles/PagesContainer.styled"

export type PagesProps = {
    children?: React.ReactNode;
  };

const PageContainer: React.FC<PagesProps> = ({ children}) => {
    return (
      <PageContainerStyled>
        {children}
      </PageContainerStyled>
    );
}

export default PageContainer;