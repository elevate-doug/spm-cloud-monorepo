import { useBuildScreen } from "../../../hooks/useBuildScreen";
import BuildScreenTemplate from "../../../components/templates/BuildScreenTemplate";
import type { ComponentProperties } from "../../../types/componentProperties";

const BuildScreen: React.FC<ComponentProperties> = (props: ComponentProperties) => {
    const {
        assemblyBuild,
        isLoading,
        error,
        assemblyComments,
        setAssemblyComments,
        barcodeValue,
        setBarcodeValue,
        inputHighlight,
        lastScannedId,
        canComplete,
        isSaving,
        groupedInstruments,
        setInputRefs,
        handleFormSubmit,
        handleCountUpdate,
        handlePause,
        handleComplete,
        handleExit,
    } = useBuildScreen(props.setPageTitle);

    return (
        <BuildScreenTemplate
            assemblyBuild={assemblyBuild}
            isLoading={isLoading}
            error={error}
            assemblyComments={assemblyComments}
            onAssemblyCommentsChange={setAssemblyComments}
            barcodeValue={barcodeValue}
            onBarcodeChange={setBarcodeValue}
            inputHighlight={inputHighlight}
            lastScannedId={lastScannedId}
            canComplete={canComplete}
            isSaving={isSaving}
            groupedInstruments={groupedInstruments}
            setInputRefs={setInputRefs}
            onFormSubmit={handleFormSubmit}
            onCountUpdate={handleCountUpdate}
            onPause={handlePause}
            onComplete={handleComplete}
            onExit={handleExit}
        />
    );
};

export default BuildScreen;
