import { useAssembly } from "../../../hooks/useAssembly";
import AssemblyTemplate from "../../../components/templates/AssemblyTemplate";
import type { ComponentProperties } from "../../../types/componentProperties";

const Assembly: React.FC<ComponentProperties> = (props: ComponentProperties) => {
    const {
        barcodeValue,
        setBarcodeValue,
        pausedSearchValue,
        setPausedSearchValue,
        sorting,
        setSorting,
        pausedSorting,
        setPausedSorting,
        inputHighlight,
        setInputRefs,
        isLoading,
        error,
        completedBuilds,
        nonCompletedBuilds,
        handleFormSubmit,
        handleRowClick,
    } = useAssembly(props.setPageTitle);

    return (
        <AssemblyTemplate
            barcodeValue={barcodeValue}
            onBarcodeChange={setBarcodeValue}
            pausedSearchValue={pausedSearchValue}
            onPausedSearchChange={setPausedSearchValue}
            sorting={sorting}
            onSortingChange={setSorting}
            pausedSorting={pausedSorting}
            onPausedSortingChange={setPausedSorting}
            inputHighlight={inputHighlight}
            setInputRefs={setInputRefs}
            isLoading={isLoading}
            error={error}
            completedBuilds={completedBuilds}
            nonCompletedBuilds={nonCompletedBuilds}
            onFormSubmit={handleFormSubmit}
            onRowClick={handleRowClick}
        />
    );
};

export default Assembly;
