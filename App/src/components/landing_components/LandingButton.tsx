import PSSButton, {LandingProps} from "./styles/LandingButton.styled";

const LandingButton: React.FC<LandingProps> = ({ navBar, onClick }) => {
  return (
    <div>
      <PSSButton onClick={onClick} navBar={navBar}>
        <h1>./</h1>
      </PSSButton>
    </div>
  );
};

export default LandingButton;