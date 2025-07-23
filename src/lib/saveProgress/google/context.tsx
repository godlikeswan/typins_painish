import { createContext, FC } from "preact/compat";
import { useCallback, useContext, useState } from "preact/hooks";

type GoogleState = "initial" | "loading" | "ready" | "failed";

export const useGoogleContextProviderValue = () => {
    const [googleState, setGoogleState] = useState<GoogleState>("initial");
    const [tokenClient, setTokenClient] = useState<any | null>(null);

    const enable = useCallback(() => {
        setGoogleState("loading");
    }, [setGoogleState]);

    return {
        googleState,
        enable,
        setGoogleState,
        tokenClient,
        setTokenClient,
    };
};

export const GoogleContext =
    createContext<ReturnType<typeof useGoogleContextProviderValue>>(null);

export const GoogleContextProvider: FC = (props) => {
    const { children } = props;
    const value = useGoogleContextProviderValue();
    return (
        <GoogleContext.Provider value={value}>
            {children}
        </GoogleContext.Provider>
    );
};

export const useGoogle = () => {
    const googleContext = useContext(GoogleContext);
    if (!googleContext) throw new Error("No google context found");
    return googleContext;
};
