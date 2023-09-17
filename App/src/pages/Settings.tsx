import PageContainer from "../components/PageContainer";
import SettingsPopUp from "../components/settings_components/SettingsPopUp";
import Landing from "../pages/Landing";

const Settings = () => {
    return (
        <PageContainer>
            <Landing />
            <SettingsPopUp />
        </PageContainer>
    );
}
    
export default Settings;