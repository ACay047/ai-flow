import { ReactNode, memo, useCallback, useState } from "react";
import { FiHelpCircle } from "react-icons/fi";
import ConfigPopup from "../../../components/popups/config-popup/ConfigPopup";
import DnDSidebar from "../../../components/bars/dnd-sidebar/DnDSidebar";
import RightIconButton from "../../../components/buttons/ConfigurationButton";
import { ApplicationMenu, ApplicationMode } from "../AppLayout";
import HelpPopup from "../../../components/popups/HelpPopup";
import FlowErrorBoundary from "./FlowErrorBoundary";
import { useVisibility } from "../../../providers/VisibilityProvider";

interface FlowWrapperProps {
  children?: ReactNode;
  mode: ApplicationMode;
  onChangeMode: (newMode: ApplicationMode) => void;
  onAddNewFlow: (flowData: any) => void;
}

type MenuStateType = {
  [key in ApplicationMenu]: boolean;
};

function FlowWrapper({
  mode,
  onChangeMode,
  onAddNewFlow,
  children,
}: FlowWrapperProps) {
  const [menuState, setMenuState] = useState<MenuStateType>(
    {} as MenuStateType,
  );

  const { getElement } = useVisibility();
  const configPopup = getElement("configPopup");

  const handleMenuChange = useCallback((menu: ApplicationMenu) => {
    menuState[menu] = !menuState[menu];
    setMenuState({ ...menuState });
  }, []);

  return (
    <>
      <FlowErrorBoundary>
        <div
          className="fixed left-0 
                          z-10
                          flex
                          h-full
                          flex-row
                          pt-16"
        >
          {mode === "flow" && <DnDSidebar />}
        </div>
        <RightIconButton onClick={() => configPopup.show()} />
        <RightIconButton
          onClick={() => handleMenuChange("help")}
          color="#7fcce38f"
          bottom="80px"
          icon={<FiHelpCircle />}
        />

        <ConfigPopup
          isOpen={configPopup.isVisible}
          onClose={() => configPopup.hide()}
        />
        <HelpPopup
          isOpen={menuState["help"]}
          onClose={() => handleMenuChange("help")}
        />
        {children}
      </FlowErrorBoundary>
    </>
  );
}

export default memo(FlowWrapper);
